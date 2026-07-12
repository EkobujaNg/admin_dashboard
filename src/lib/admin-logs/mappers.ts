import type { AdminLog, PaginatedAdminLogs } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asNullableString(value: unknown): string | null {
  if (value == null || value === "") return null;
  return String(value);
}

function asMetadata(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

/** API list item / detail shape from GET /admin/logs */
export function normalizeAdminLog(raw: Record<string, unknown>): AdminLog {
  const metadata = asMetadata(raw.metadata);
  const remarkFromMeta = metadata ? asNullableString(metadata.remark) : null;

  return {
    id: String(raw.id ?? ""),
    action: String(raw.action ?? ""),
    resourceType: String(raw.resourceType ?? ""),
    resourceId: asNullableString(raw.resourceId),
    adminUserId: asNullableString(raw.adminUserId),
    adminEmail: asNullableString(raw.adminEmail),
    adminName: asNullableString(raw.adminName),
    description: asNullableString(raw.description),
    remark: asNullableString(raw.remark) || remarkFromMeta,
    metadata,
    createdAt: asNullableString(raw.createdAt),
  };
}

/** API list shape: { items, total, page, limit, totalPages, hasMore } */
export function normalizePaginatedAdminLogs(
  data: Record<string, unknown>,
  fallbackPage = 1,
  fallbackLimit = 10
): PaginatedAdminLogs {
  const payload = asRecord(
    Array.isArray(data.items) || data.total != null || data.page != null
      ? data
      : ((data.data as Record<string, unknown>) ?? data)
  );

  const rawItems = payload.items ?? payload.pageItems ?? [];
  const pageItems = Array.isArray(rawItems)
    ? rawItems.map((item) => normalizeAdminLog(asRecord(item)))
    : [];

  const currentPage = Number(payload.page ?? payload.currentPage ?? fallbackPage) || fallbackPage;
  const pageSize = Number(payload.limit ?? payload.pageSize ?? fallbackLimit) || fallbackLimit;
  const totalItems = Number(payload.total ?? payload.totalItems ?? pageItems.length) || 0;
  const numberOfPages = Number(
    payload.totalPages ??
      payload.numberOfPages ??
      Math.max(1, Math.ceil(totalItems / Math.max(pageSize, 1)))
  );

  return {
    pageItems,
    currentPage,
    numberOfPages,
    totalItems,
    pageSize,
    hasMore: Boolean(payload.hasMore ?? currentPage < numberOfPages),
  };
}
