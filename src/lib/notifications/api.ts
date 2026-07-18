import http from "@/lib/http";
import {
  normalizeNotificationSettings,
  normalizePaginatedNotifications,
  normalizeUnreadNotificationCount,
} from "./mappers";
import type {
  GetNotificationsParams,
  NotificationSetting,
  PaginatedNotifications,
  UnreadNotificationCount,
  UpdateNotificationSettingPayload,
} from "./types";

const NOTIFICATIONS_BASE = "/notifications";

function unwrapData<T>(data: T | { data: T }): T {
  if (!data || typeof data !== "object") return data as T;
  const record = data as Record<string, unknown>;
  if (
    Array.isArray(record.items) ||
    record.total != null ||
    record.page != null ||
    record.count != null ||
    record.unreadCount != null
  ) {
    return data as T;
  }
  if ("data" in record && record.data != null) {
    return record.data as T;
  }
  return data as T;
}

export function getNotificationsErrorMessage(error: any, fallback: string) {
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

export async function getNotifications(
  params: GetNotificationsParams = {}
): Promise<PaginatedNotifications> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  const { data } = await http.get<
    Record<string, unknown> | unknown[] | { data: Record<string, unknown> | unknown[] }
  >(NOTIFICATIONS_BASE, {
    params: {
      page,
      limit,
      ...(params.unreadOnly != null ? { unreadOnly: params.unreadOnly } : {}),
    },
  });

  return normalizePaginatedNotifications(
    unwrapData(data) as Record<string, unknown> | unknown[],
    page,
    limit
  );
}

export async function getUnreadNotificationCount(): Promise<UnreadNotificationCount> {
  const { data } = await http.get<unknown>(`${NOTIFICATIONS_BASE}/unread-count`);
  return normalizeUnreadNotificationCount(unwrapData(data));
}

export async function markNotificationRead(id: string): Promise<unknown> {
  const { data } = await http.patch(`${NOTIFICATIONS_BASE}/${id}/read`);
  return unwrapData(data);
}

export async function markAllNotificationsRead(): Promise<unknown> {
  const { data } = await http.patch(`${NOTIFICATIONS_BASE}/read-all`);
  return unwrapData(data);
}

export async function getNotificationSettings(): Promise<NotificationSetting[]> {
  const { data } = await http.get<unknown>(`${NOTIFICATIONS_BASE}/settings`);
  return normalizeNotificationSettings(unwrapData(data));
}

export async function updateNotificationSetting(
  payload: UpdateNotificationSettingPayload
): Promise<NotificationSetting> {
  const { data } = await http.patch<unknown>(`${NOTIFICATIONS_BASE}/settings`, payload);
  const unwrapped = unwrapData(data);
  const list = normalizeNotificationSettings(unwrapped);
  if (list.length === 1) return list[0];
  const matched = list.find((item) => item.category === payload.category);
  if (matched) return matched;
  return {
    category: payload.category,
    emailEnabled: payload.emailEnabled,
    pushEnabled: payload.pushEnabled,
  };
}
