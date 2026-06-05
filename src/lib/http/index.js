// src/api/index.js
import axios from "axios";
import { toast } from "sonner";
import { parseCookies, destroyCookie } from "nookies";

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

// Store reference for dispatching logout
let store;
export const injectStore = (_store) => {
  store = _store;
};

// Helper: Attach auth token if present
function attachAuthToken(config) {
  const { authToken } = parseCookies();
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
}

// Helper: Handle request errors
function handleRequestError(error) {
  toast.error("Error with the request.");
  return Promise.reject(error);
}

// Helper: Handle response errors
function handleResponseError(error) {
  if (error.response) {
    const status = error.response.status;
    if (status === 401) {
      // Dispatch logout action to clear Redux state
      if (store) {
        const { logout } = require("@/lib/store/slices/authSlice");
        store.dispatch(logout());
      }

      // Clear the authToken cookie
      destroyCookie(null, "authToken", { path: "/" });

      toast.error("Session expired. Please log in again.");

      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } else if (status === 500) {
      toast.error("Server error, please try again later.");
    } else {
      toast.error(error.response.data?.message || "An error occurred.");
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
