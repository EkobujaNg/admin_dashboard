import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getNotificationSettings,
  getNotifications,
  getNotificationsErrorMessage,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  updateNotificationSetting,
} from "@/lib/notifications/api";
import type { NotificationSetting, UpdateNotificationSettingPayload } from "@/lib/notifications/types";

type UseNotificationsAPIOptions = {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  enableList?: boolean;
  enableUnreadCount?: boolean;
  enableSettings?: boolean;
};

export default function useNotificationsAPI({
  page = 1,
  limit = 20,
  unreadOnly,
  enableList = false,
  enableUnreadCount = false,
  enableSettings = false,
}: UseNotificationsAPIOptions = {}) {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["notifications", page, limit, unreadOnly ?? "all"],
    queryFn: () =>
      getNotifications({
        page,
        limit,
        ...(unreadOnly != null ? { unreadOnly } : {}),
      }),
    enabled: enableList,
  });

  const unreadCountQuery = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: getUnreadNotificationCount,
    enabled: enableUnreadCount,
    refetchInterval: 60_000,
  });

  const settingsQuery = useQuery({
    queryKey: ["notification-settings"],
    queryFn: getNotificationSettings,
    enabled: enableSettings,
  });

  const invalidateNotificationQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
  };

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: invalidateNotificationQueries,
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: invalidateNotificationQueries,
  });

  const updateSettingMutation = useMutation({
    mutationFn: (payload: UpdateNotificationSettingPayload) => updateNotificationSetting(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["notification-settings"] });
      const previous = queryClient.getQueryData<NotificationSetting[]>(["notification-settings"]);
      queryClient.setQueryData<NotificationSetting[]>(["notification-settings"], (current) =>
        (current ?? []).map((item) =>
          item.category === payload.category
            ? {
                ...item,
                emailEnabled: payload.emailEnabled,
                pushEnabled: payload.pushEnabled,
              }
            : item
        )
      );
      return { previous };
    },
    onError: (error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notification-settings"], context.previous);
      }
      toast.error(getNotificationsErrorMessage(error, "Failed to update notification setting."));
    },
    onSuccess: () => {
      toast.success("Notification setting updated.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
    },
  });

  const markAsRead = (
    id: string,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    markReadMutation.mutate(id, {
      onSuccess: (data) => options?.onSuccess?.(data),
      onError: (error) => {
        toast.error(getNotificationsErrorMessage(error, "Failed to mark notification as read."));
        options?.onError?.(error);
      },
    });
  };

  const markAllAsRead = (options?: {
    onSuccess?: (data?: unknown) => void;
    onError?: (error?: unknown) => void;
  }) => {
    markAllReadMutation.mutate(undefined, {
      onSuccess: (data) => {
        toast.success("All notifications marked as read.");
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        toast.error(getNotificationsErrorMessage(error, "Failed to mark all notifications as read."));
        options?.onError?.(error);
      },
    });
  };

  const updateSetting = (
    payload: UpdateNotificationSettingPayload,
    options?: { onSuccess?: (data?: NotificationSetting) => void; onError?: (error?: unknown) => void }
  ) => {
    updateSettingMutation.mutate(payload, {
      onSuccess: (data) => options?.onSuccess?.(data),
      onError: (error) => options?.onError?.(error),
    });
  };

  const list = listQuery.data;

  return {
    items: list?.items ?? [],
    listMeta: {
      total: list?.total ?? 0,
      page: list?.page ?? page,
      limit: list?.limit ?? limit,
      totalPages: list?.totalPages ?? 1,
      hasMore: list?.hasMore ?? false,
    },
    isLoadingList: listQuery.isLoading,
    listError: listQuery.error,
    refetchList: listQuery.refetch,

    unreadCount: unreadCountQuery.data?.count ?? 0,
    isLoadingUnreadCount: unreadCountQuery.isLoading,
    unreadCountError: unreadCountQuery.error,
    refetchUnreadCount: unreadCountQuery.refetch,

    settings: settingsQuery.data ?? [],
    isLoadingSettings: settingsQuery.isLoading,
    settingsError: settingsQuery.error,
    refetchSettings: settingsQuery.refetch,

    markAsRead,
    isMarkingRead: markReadMutation.isPending,
    markAllAsRead,
    isMarkingAllRead: markAllReadMutation.isPending,
    updateSetting,
    isUpdatingSetting: updateSettingMutation.isPending,
    updatingSettingCategory: updateSettingMutation.isPending
      ? updateSettingMutation.variables?.category ?? null
      : null,
  };
}
