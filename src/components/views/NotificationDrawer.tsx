"use client";

import React, { useState } from "react";
import { Loader2, Mail, MailOpen } from "lucide-react";
import { useDrawerModal } from "@/context/DrawerModalContext";
import useNotificationsAPI from "@/services/useNotificationsAPI";
import {
  formatNotificationDate,
  formatNotificationRelativeTime,
  isNotificationUnread,
} from "@/lib/notifications/mappers";
import type { NotificationItem } from "@/lib/notifications/types";

function NotificationDetail({ item }: { item: NotificationItem }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-primary-10 font-Raleway">{item.title}</h3>
        <p className="text-xs text-opacityClr-60 font-Raleway">
          {formatNotificationDate(item.createdAt)}
        </p>
      </div>
      <p className="text-sm text-primary-10 font-Raleway font-medium leading-relaxed whitespace-pre-wrap">
        {item.body || "—"}
      </p>
    </div>
  );
}

const NotificationDrawer = () => {
  const { openNestedModal } = useDrawerModal();
  const [page, setPage] = useState(1);
  const {
    items,
    listMeta,
    isLoadingList,
    listError,
    refetchList,
    markAsRead,
    markAllAsRead,
    isMarkingAllRead,
    unreadCount,
  } = useNotificationsAPI({
    page,
    limit: 20,
    enableList: true,
    enableUnreadCount: true,
  });

  const hasUnread = unreadCount > 0 || items.some(isNotificationUnread);

  const handleNotificationClick = (item: NotificationItem) => {
    if (isNotificationUnread(item)) {
      markAsRead(item.id);
    }
    openNestedModal("Notification Details", <NotificationDetail item={item} />);
  };

  return (
    <div className="flex flex-col gap-4 h-full relative pb-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-Raleway text-opacityClr-80">
          {hasUnread
            ? `${unreadCount > 0 ? unreadCount : items.filter(isNotificationUnread).length} unread`
            : "You are all caught up"}
        </p>
        <button
          type="button"
          disabled={isMarkingAllRead || !hasUnread}
          onClick={() => markAllAsRead()}
          className="text-sm font-semibold text-primary-10 font-Raleway disabled:opacity-40 cursor-pointer"
        >
          {isMarkingAllRead ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        {isLoadingList ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-20 w-full rounded-lg bg-opacityClr-10 animate-pulse" />
          ))
        ) : listError ? (
          <div className="flex flex-col gap-3 py-6">
            <p className="font-Raleway text-sm text-opacityClr-80">Could not load notifications.</p>
            <button
              type="button"
              onClick={() => refetchList()}
              className="self-start px-4 py-2 rounded-md bg-neutral-lightGreen text-primary-10 font-semibold text-sm cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="font-Raleway text-sm text-opacityClr-80 py-6">No notifications yet.</p>
        ) : (
          items.map((item) => {
            const unread = isNotificationUnread(item);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNotificationClick(item)}
                className={`flex w-full text-left p-4 items-start gap-4 rounded-lg transition-colors duration-200 cursor-pointer ${
                  unread ? "bg-opacityClr-10" : "hover:bg-opacityClr-10"
                }`}
              >
                <span className="flex w-10 h-10 shrink-0 items-center justify-center rounded-lg bg-opacityClr-10">
                  {unread ? (
                    <Mail size={18} className="text-primary-20" />
                  ) : (
                    <MailOpen size={18} className="text-primary-20" />
                  )}
                </span>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className={`text-sm font-Raleway leading-normal truncate ${
                        unread ? "font-semibold text-primary-10" : "font-medium text-primary-10"
                      }`}
                    >
                      {item.title}
                    </p>
                    <small className="shrink-0 text-primary-60 text-xs font-Raleway font-medium">
                      {formatNotificationRelativeTime(item.createdAt)}
                    </small>
                  </div>
                  <p className="text-opacityClr-80 text-sm font-Raleway font-medium leading-normal line-clamp-2">
                    {item.body}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {!isLoadingList && !listError && listMeta.totalPages > 1 ? (
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-opacityClr-20">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="px-4 py-2 rounded-md border border-opacityClr-20 text-sm font-semibold disabled:opacity-40 cursor-pointer"
          >
            Previous
          </button>
          <span className="text-sm font-Raleway text-opacityClr-60">
            Page {page} of {listMeta.totalPages}
          </span>
          <button
            type="button"
            disabled={!listMeta.hasMore}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 rounded-md border border-opacityClr-20 text-sm font-semibold disabled:opacity-40 cursor-pointer"
          >
            Next
          </button>
        </div>
      ) : null}

      {isMarkingAllRead ? (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center pointer-events-none">
          <Loader2 className="w-5 h-5 animate-spin text-primary-10" />
        </div>
      ) : null}
    </div>
  );
};

export default NotificationDrawer;
