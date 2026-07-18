import type {
  NotificationItem,
  NotificationSetting,
  PaginatedNotifications,
  UnreadNotificationCount,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
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

function pickData(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function normalizeNotificationItem(raw: unknown, index = 0): NotificationItem {
  const data = asRecord(raw);

  return {
    id: pickString(data.id, data._id) || `notification-${index}`,
    category: pickString(data.category) || "general",
    type: pickString(data.type) || "UNKNOWN",
    title: pickString(data.title) || "Notification",
    body: pickString(data.body, data.message) || "",
    data: pickData(data.data),
    readAt: pickNullableString(data.readAt),
    createdAt: pickNullableString(data.createdAt, data.created_at),
  };
}

export function normalizePaginatedNotifications(
  data: Record<string, unknown> | unknown[],
  fallbackPage = 1,
  fallbackLimit = 20
): PaginatedNotifications {
  if (Array.isArray(data)) {
    const items = data.map((item, index) => normalizeNotificationItem(item, index));
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
        : [];

  const items = list.map((item, index) => normalizeNotificationItem(item, index));
  const page = Number(record.page ?? fallbackPage) || fallbackPage;
  const limit = Number(record.limit ?? record.pageSize ?? fallbackLimit) || fallbackLimit;
  const total = Number(record.total ?? items.length) || items.length;
  const totalPages =
    Number(record.totalPages ?? Math.max(1, Math.ceil(total / Math.max(limit, 1)))) || 1;

  return {
    items,
    total,
    page,
    limit,
    totalPages,
    hasMore: Boolean(record.hasMore ?? page < totalPages),
  };
}

export function normalizeUnreadNotificationCount(raw: unknown): UnreadNotificationCount {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return { count: Math.max(0, raw) };
  }

  const record = asRecord(raw);
  const nested = asRecord(record.data);
  const count = Number(
    record.count ??
      record.unreadCount ??
      record.total ??
      nested.count ??
      nested.unreadCount ??
      0
  );

  return { count: Number.isFinite(count) ? Math.max(0, count) : 0 };
}

export function isNotificationUnread(item: NotificationItem): boolean {
  return !item.readAt;
}

export function formatNotificationDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatNotificationRelativeTime(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return "now";

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d`;

  return date.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
}

const CATEGORY_LABELS: Record<string, string> = {
  wallet_payments: "Wallet & payments",
  primary_market: "Primary market",
  secondary_market: "Secondary market",
  buyback: "Buyback",
  profit_sharing: "Profit sharing",
  referrals: "Referrals",
  property_updates: "Property updates",
  auth_security: "Security",
  admin_finance: "Admin finance",
  tasks: "Tasks",
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  wallet_payments: "Deposits, withdrawals, and wallet activity.",
  primary_market: "Primary market investments and order updates.",
  secondary_market: "Secondary market trades and listing updates.",
  buyback: "Buyback offers and related activity.",
  profit_sharing: "Profit share loads and distributions.",
  referrals: "Referral rewards and invite activity.",
  property_updates: "Property status and listing updates.",
  auth_security: "Login and security alerts for your account.",
  admin_finance: "Admin finance and profit sharing alerts.",
  tasks: "Task assignments and results.",
};

export function formatNotificationCategoryLabel(category: string): string {
  if (CATEGORY_LABELS[category]) return CATEGORY_LABELS[category];
  return category
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getNotificationCategoryDescription(category: string): string {
  return CATEGORY_DESCRIPTIONS[category] || "Manage email and push alerts for this category.";
}

export function normalizeNotificationSetting(raw: unknown, index = 0): NotificationSetting {
  const data = asRecord(raw);
  return {
    category: pickString(data.category) || `category-${index}`,
    emailEnabled: Boolean(data.emailEnabled ?? data.email ?? true),
    pushEnabled: Boolean(data.pushEnabled ?? data.push ?? true),
  };
}

export function normalizeNotificationSettings(raw: unknown): NotificationSetting[] {
  if (Array.isArray(raw)) {
    return raw.map((item, index) => normalizeNotificationSetting(item, index));
  }

  const record = asRecord(raw);
  const list = Array.isArray(record.data)
    ? record.data
    : Array.isArray(record.items)
      ? record.items
      : Array.isArray(record.settings)
        ? record.settings
        : [];

  return list.map((item, index) => normalizeNotificationSetting(item, index));
}
