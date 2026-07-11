import type {
  AffectPropertyDirection,
  PropertyTask,
  PropertyTaskStatus,
  PropertyTasksResponse,
} from "./types";

function unwrapData<T>(data: T | { data: T }): T {
  if (data && typeof data === "object" && "data" in data && (data as { data: T }).data) {
    return (data as { data: T }).data;
  }
  return data as T;
}

function parseAmount(value: unknown): number | null {
  if (value == null || value === "") return null;
  const num = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(num) ? num : null;
}

function normalizeStatus(raw: unknown): PropertyTaskStatus {
  const value = String(raw || "").toLowerCase();
  if (value === "complete" || value === "completed" || value === "approved") return "complete";
  if (value === "rejected" || value === "declined") return "rejected";
  if (value === "pending") return "pending";
  return "new";
}

function normalizeDirection(raw: unknown): AffectPropertyDirection | null {
  if (raw === "plus" || raw === "minus") return raw;
  return null;
}

export function normalizePropertyTask(raw: Record<string, unknown>): PropertyTask {
  const imageUrls = Array.isArray(raw.imageUrls)
    ? raw.imageUrls.map(String)
    : Array.isArray(raw.images)
      ? raw.images.map(String)
      : [];

  return {
    id: String(raw.id || ""),
    propertyId: String(raw.propertyId || ""),
    propertyName: raw.propertyName ? String(raw.propertyName) : undefined,
    taskAction: String(raw.taskAction || raw.taskName || ""),
    status: normalizeStatus(raw.status),
    imageUrls,
    report: raw.report != null ? String(raw.report) : null,
    remark: raw.remark != null ? String(raw.remark) : null,
    affectProperty: Boolean(raw.affectProperty),
    affectPropertyBy: parseAmount(raw.affectPropertyBy),
    affectPropertyDirection: normalizeDirection(raw.affectPropertyDirection),
    isAssistantReport: typeof raw.isAssistantReport === "boolean" ? raw.isAssistantReport : undefined,
    createdAt: raw.createdAt ? String(raw.createdAt) : raw.date ? String(raw.date) : null,
    submittedAt: raw.submittedAt ? String(raw.submittedAt) : null,
    reviewedAt: raw.reviewedAt ? String(raw.reviewedAt) : null,
  };
}

export function normalizePropertyTasksResponse(raw: unknown): PropertyTasksResponse {
  const payload = unwrapData(raw) as Record<string, unknown> | unknown[];

  const itemsRaw = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as Record<string, unknown>)?.items)
      ? ((payload as Record<string, unknown>).items as unknown[])
      : Array.isArray((payload as Record<string, unknown>)?.data)
        ? ((payload as Record<string, unknown>).data as unknown[])
        : Array.isArray((payload as Record<string, unknown>)?.pageItems)
          ? ((payload as Record<string, unknown>).pageItems as unknown[])
          : [];

  const items = itemsRaw.map((item) => normalizePropertyTask(item as Record<string, unknown>));

  return {
    items,
    totalCount:
      !Array.isArray(payload) && typeof (payload as Record<string, unknown>).totalCount === "number"
        ? Number((payload as Record<string, unknown>).totalCount)
        : items.length,
  };
}

export function normalizePropertyTaskDetail(raw: unknown): PropertyTask {
  const payload = unwrapData(raw) as Record<string, unknown>;
  return normalizePropertyTask(payload);
}
