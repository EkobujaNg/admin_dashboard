// src/api/index.js
import axios from "axios";
import { toast } from "sonner";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { AUTH_COOKIE_NAME } from "@/lib/auth/routes";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL = "/api";

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Separate client for the refresh call so it never goes through attachAuthToken
// (which would send the expired access token instead of the refresh token).
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  withCredentials: true,
});

// Store reference for dispatching logout
let store;
export const injectStore = (_store) => {
  store = _store;
};

// Helper: Attach auth token if present
function attachAuthToken(config) {
  const cookies = parseCookies();
  const token = cookies[AUTH_COOKIE_NAME];
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

// Helper: Handle request errors
function handleRequestError(error) {
  toast.error("Error with the request.");
  return Promise.reject(error);
}

function forceLogout() {
  // Dispatch logout action to clear Redux state
  if (store) {
    const { logout } = require("@/lib/store/slices/authSlice");
    store.dispatch(logout());
  }

  // Clear the authToken cookie
  destroyCookie(null, AUTH_COOKIE_NAME, { path: "/" });

  toast.error("Session expired. Please log in again.");

  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

// Refresh access tokens are 1hr-lived; the refresh token lives 7 days. Only one
// refresh call should be in flight at a time — concurrent 401s queue behind it.
let isRefreshing = false;
let pendingRequests = [];

function flushQueue(success) {
  pendingRequests.forEach((resolve) => resolve(success));
  pendingRequests = [];
}

async function refreshAccessToken() {
  const refreshToken = store?.getState()?.auth?.refreshToken;
  if (!refreshToken) return false;

  try {
    const { data } = await refreshClient.post(
      "/auth/refresh",
      {},
      { headers: { Authorization: `Bearer ${refreshToken}` } }
    );

    const newAccessToken = data?.accessToken;
    if (!newAccessToken) return false;

    setCookie(null, AUTH_COOKIE_NAME, newAccessToken, {
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });

    if (store) {
      const { setAccessToken } = require("@/lib/store/slices/authSlice");
      store.dispatch(setAccessToken({ accessToken: newAccessToken, refreshToken: data?.refreshToken }));
    }

    return true;
  } catch {
    return false;
  }
}

// Helper: Handle response errors
async function handleResponseError(error) {
  const originalRequest = error.config;
  const isRefreshCall = Boolean(originalRequest?.url?.includes("/auth/refresh"));
  const refreshToken = store?.getState()?.auth?.refreshToken;

  if (error.response) {
    const status = error.response.status;

    if (status === 401 && originalRequest && !originalRequest._retry && !isRefreshCall && refreshToken) {
      originalRequest._retry = true;

      if (isRefreshing) {
        const refreshed = await new Promise((resolve) => pendingRequests.push(resolve));
        if (refreshed) return http(originalRequest);
        return Promise.reject(error);
      }

      isRefreshing = true;
      const refreshed = await refreshAccessToken();
      isRefreshing = false;
      flushQueue(refreshed);

      if (refreshed) return http(originalRequest);

      forceLogout();
      return Promise.reject(error);
    }

    if (status === 401) {
      forceLogout();
    } else if (status === 500) {
      toast.error("Server error, please try again later.");
    } else {
      toast.error(
        error.response.data?.responseDescription ||
          error.response.data?.message ||
          "An error occurred."
      );
    }
  } else {
    toast.error("Network error. Please check your connection.");
  }
  return Promise.reject(error);
}

// Attach interceptors
http.interceptors.request.use(attachAuthToken, handleRequestError);
http.interceptors.response.use((response) => response, handleResponseError);

export default http;
