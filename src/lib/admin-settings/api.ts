import http from "@/lib/http";
import { normalizeAdminSettings } from "./mappers";
import type { AdminSettings, UpdateAdminSettingsPayload } from "./types";

const ADMIN_SETTINGS_BASE = "/admin/settings";

function unwrapData<T>(data: T | { data: T }): T {
  if (data && typeof data === "object" && "data" in data && (data as { data: T }).data) {
    return (data as { data: T }).data;
  }
  return data as T;
}

export function getAdminSettingsErrorMessage(error: any, fallback: string) {
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

export async function getAdminSettings(): Promise<AdminSettings> {
  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    ADMIN_SETTINGS_BASE
  );
  return normalizeAdminSettings(unwrapData(data) as Record<string, unknown>);
}

export async function updateAdminSettings(
  payload: UpdateAdminSettingsPayload
): Promise<AdminSettings> {
  const { data } = await http.patch<Record<string, unknown> | { data: Record<string, unknown> }>(
    ADMIN_SETTINGS_BASE,
    payload
  );
  return normalizeAdminSettings(unwrapData(data) as Record<string, unknown>);
}
