import http from "@/lib/http";
import { normalizeAdminProfile } from "./mappers";
import type { AdminProfile, UpdateAdminProfilePayload } from "./types";

const ADMIN_PROFILE_BASE = "/admin/profile";

function unwrapData<T>(data: T | { data: T }): T {
  if (data && typeof data === "object" && "data" in data && (data as { data: T }).data) {
    return (data as { data: T }).data;
  }
  return data as T;
}

export function getAdminProfileErrorMessage(error: any, fallback: string) {
  const message = error?.response?.data?.message;
  if (Array.isArray(message)) return message.join(", ");
  return (
    error?.response?.data?.responseDescription ||
    error?.response?.data?.responseMessage ||
    message ||
    error?.message ||
    fallback
  );
}

export async function getAdminProfile(): Promise<AdminProfile> {
  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    ADMIN_PROFILE_BASE
  );
  return normalizeAdminProfile(unwrapData(data) as Record<string, unknown>);
}

export async function updateAdminProfile(payload: UpdateAdminProfilePayload): Promise<AdminProfile> {
  const { data } = await http.patch<Record<string, unknown> | { data: Record<string, unknown> }>(
    ADMIN_PROFILE_BASE,
    payload
  );
  return normalizeAdminProfile(unwrapData(data) as Record<string, unknown>);
}
