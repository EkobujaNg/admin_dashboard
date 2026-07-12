import http from "@/lib/http";
import { normalizeAdminLog, normalizePaginatedAdminLogs } from "./mappers";
import type { AdminLog, GetAdminLogsParams, PaginatedAdminLogs } from "./types";

const ADMIN_LOGS_BASE = "/admin/logs";

function unwrapData<T>(data: T | { data: T }): T {
  if (!data || typeof data !== "object") return data as T;

  const record = data as Record<string, unknown>;
  // List responses are { items, total, page, ... } — do not unwrap those.
  if (Array.isArray(record.items) || record.total != null || record.page != null) {
    return data as T;
  }

  if ("data" in record && record.data) {
    return record.data as T;
  }

  return data as T;
}

export async function getAdminLogs(params: GetAdminLogsParams = {}): Promise<PaginatedAdminLogs> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    ADMIN_LOGS_BASE,
    {
      params: {
        page,
        limit,
        ...(params.action ? { action: params.action } : {}),
        ...(params.resourceType ? { resourceType: params.resourceType } : {}),
        ...(params.adminUserId ? { adminUserId: params.adminUserId } : {}),
      },
    }
  );

  return normalizePaginatedAdminLogs(unwrapData(data) as Record<string, unknown>, page, limit);
}

export async function getAdminLogById(id: string): Promise<AdminLog> {
  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    `${ADMIN_LOGS_BASE}/${id}`
  );
  return normalizeAdminLog(unwrapData(data) as Record<string, unknown>);
}
