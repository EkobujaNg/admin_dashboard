export type LoginHistoryDeviceType = "web" | "ios" | "android" | string;

export type LoginHistoryEntry = {
  id: string;
  deviceType: LoginHistoryDeviceType;
  loggedInAt: string | null;
};

export type PaginatedLoginHistory = {
  items: LoginHistoryEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return "";
}

function pickNullableString(...values: unknown[]): string | null {
  const value = pickString(...values);
  return value || null;
}

function isLoginHistoryEntry(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return Boolean(record.deviceType || record.loggedInAt || record.id);
}

export function normalizeLoginHistoryEntry(raw: unknown, index = 0): LoginHistoryEntry {
  const data = asRecord(raw);

  return {
    id: pickString(data.id, data._id) || `login-history-${index}`,
    deviceType: pickString(data.deviceType, data.device) || "web",
    loggedInAt: pickNullableString(data.loggedInAt, data.createdAt, data.timestamp, data.date),
  };
}

export function normalizePaginatedLoginHistory(
  data: Record<string, unknown> | unknown[],
  fallbackPage = 1,
  fallbackLimit = 10
): PaginatedLoginHistory {
  // Single entry: { id, deviceType, loggedInAt }
  if (!Array.isArray(data) && isLoginHistoryEntry(data) && !Array.isArray(asRecord(data).items)) {
    const record = asRecord(data);
    if (!Array.isArray(record.data) && !Array.isArray(record.results) && !Array.isArray(record.items)) {
      const item = normalizeLoginHistoryEntry(data);
      return {
        items: [item],
        total: 1,
        page: fallbackPage,
        limit: fallbackLimit,
        totalPages: 1,
        hasMore: false,
      };
    }
  }

  if (Array.isArray(data)) {
    const items = data.map((item, index) => normalizeLoginHistoryEntry(item, index));
    return {
      items,
      total: items.length,
      page: fallbackPage,
      limit: fallbackLimit,
      totalPages: 1,
      hasMore: false,
    };
  }

  const record = asRecord(data);
  const list = Array.isArray(record.items)
    ? record.items
    : Array.isArray(record.data)
      ? record.data
      : Array.isArray(record.results)
        ? record.results
        : isLoginHistoryEntry(record)
          ? [record]
          : [];

  const items = list.map((item, index) => normalizeLoginHistoryEntry(item, index));
  const page = Number(record.page ?? fallbackPage) || fallbackPage;
  const limit = Number(record.limit ?? record.pageSize ?? fallbackLimit) || fallbackLimit;
  const total = Number(record.total ?? items.length) || items.length;
  const totalPages = Number(record.totalPages ?? Math.max(1, Math.ceil(total / Math.max(limit, 1)))) || 1;

  return {
    items,
    total,
    page,
    limit,
    totalPages,
    hasMore: Boolean(record.hasMore ?? page < totalPages),
  };
}

export function formatLoginHistoryDeviceLabel(deviceType: string): string {
  const normalized = deviceType.trim().toLowerCase();
  if (normalized === "ios") return "iOS";
  if (normalized === "android") return "Android";
  if (normalized === "web") return "Web";
  if (!normalized) return "Unknown device";
  return deviceType;
}

export function formatLoginHistoryDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function isMobileLoginDevice(deviceType: string): boolean {
  const normalized = deviceType.trim().toLowerCase();
  return normalized === "ios" || normalized === "android";
}
