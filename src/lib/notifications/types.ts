export type NotificationItem = {
  id: string;
  category: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string | null;
};

export type PaginatedNotifications = {
  items: NotificationItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
};

export type UnreadNotificationCount = {
  count: number;
};

export type GetNotificationsParams = {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
};

export type NotificationSetting = {
  category: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
};

export type UpdateNotificationSettingPayload = {
  category: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
};
