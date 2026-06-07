import http from "@/lib/http";
import type {
  ForgotPasswordPayload,
  ForgotPasswordResetPayload,
  LoginPayload,
  LoginResponse,
} from "./types";

export const ADMIN_PORTAL = "admin";

function unwrapData<T>(data: T | { data: T }): T {
  if (data && typeof data === "object" && "data" in data && (data as { data: T }).data) {
    return (data as { data: T }).data;
  }
  return data as T;
}

export async function login(payload: Omit<LoginPayload, "portal">) {
  const { data } = await http.post<LoginResponse | { data: LoginResponse }>("/auth/login", {
    ...payload,
    portal: ADMIN_PORTAL,
  });
  return unwrapData(data);
}

export async function signOut() {
  await http.post("/auth/sign-out");
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  const { data } = await http.post("/auth/forgot-password", payload);
  return data;
}

export async function resendForgotPasswordCode(payload: ForgotPasswordPayload) {
  const { data } = await http.post("/auth/forgot-password/resend-code", payload);
  return data;
}

export async function resetPasswordWithCode(payload: ForgotPasswordResetPayload) {
  const { data } = await http.post("/auth/forgot-password/reset", payload);
  return data;
}
