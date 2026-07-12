import http from "@/lib/http";
import { getDeviceType } from "./device";
import type {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  ForgotPasswordResetPayload,
  LoginPayload,
  LoginResponse,
} from "./types";
import { normalizePaginatedLoginHistory } from "./login-history";
import type { PaginatedLoginHistory } from "./login-history";

const ADMIN_PORTAL = "admin";

function unwrapData<T>(data: T | { data: T }): T {
  if (!data || typeof data !== "object") return data as T;
  const record = data as Record<string, unknown>;
  if (Array.isArray(record.items) || record.total != null || record.page != null) {
    return data as T;
  }
  if ("data" in record && record.data) {
    return record.data as T;
  }
  return data as T;
}

export async function login(payload: Omit<LoginPayload, "portal" | "deviceType">) {
  const { data } = await http.post<LoginResponse | { data: LoginResponse }>("/auth/login", {
    ...payload,
    portal: ADMIN_PORTAL,
    deviceType: getDeviceType(),
  });
  return unwrapData(data);
}

export async function getLoginHistory(page = 1, limit = 10): Promise<PaginatedLoginHistory> {
  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    "/auth/login-history",
    { params: { page, limit } }
  );
  return normalizePaginatedLoginHistory(unwrapData(data) as Record<string, unknown> | unknown[], page, limit);
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

export async function changePassword(payload: ChangePasswordPayload) {
  const { data } = await http.post("/auth/change-password", payload);
  return data;
}
