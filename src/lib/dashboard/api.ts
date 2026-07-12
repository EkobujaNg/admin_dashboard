import http from "@/lib/http";
import { normalizeAdminDashboard } from "./mappers";
import type { AdminDashboard } from "./types";

const ADMIN_DASHBOARD_BASE = "/admin/dashboard";

function unwrapData<T>(data: T | { data: T }): T {
  if (data && typeof data === "object" && "data" in data && (data as { data: T }).data) {
    return (data as { data: T }).data;
  }
  return data as T;
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    ADMIN_DASHBOARD_BASE
  );
  return normalizeAdminDashboard(unwrapData(data) as Record<string, unknown>);
}
