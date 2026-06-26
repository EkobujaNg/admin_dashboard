"use client";
import React, { useState } from "react";
import { Mail, MailOpen } from "lucide-react";
import { useDrawerModal } from "@/context/DrawerModalContext";

const notificationsData = [
  {
    id: 1,
    message:
      "Transaction of ₦250,000.00 made to your wallet from Access bank using direct transfer.",
    time: "now",
    isRead: false,
  },
  {
    id: 2,
    message:
      "Join our telegram group and learn about real estate investing and connect to co-owners.",
    time: "yesterday",
    isRead: false,
  },
  {
    id: 3,
    message:
      "Get more out of property investment by checking market trends and property appreciation!",
    time: "wed",
    isRead: true,
  },
  {
    id: 4,
    message:
      "Welcome, Chinedu! Let’s start your real estate investment journey today!",
    time: "wed",
    isRead: true,
  },
];

const NotificationDrawer = () => {
  const { openNestedModal } = useDrawerModal();
  const [notifications, setNotifications] = useState([...notificationsData]); // Copy state properly

  // Handle clicking a notification
  const handleNotificationClick = (id, message) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );

    // Open the nested drawer with message details
    openNestedModal("Notification Details", message);
  };

  return (
    <div className="flex flex-col items-start gap-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`flex p-6 items-center gap-4 rounded-lg transition-colors duration-300 ease-linear cursor-pointer 
          ${notif.isRead ? "hover:bg-opacityClr-10" : "bg-opacityClr-10"}`}
          onClick={() => handleNotificationClick(notif.id, notif.message)}
        >
          <span className="flex w-10 h-10 p-[10px] items-center justify-center rounded-lg bg-opacityClr-10">
            {notif.isRead ? (
              <MailOpen className="text-primary-20 w-5 h-5" />
            ) : (
              <Mail className="text-primary-20 w-5 h-5" />
            )}
          </span>
          <p className="text-primary-10 text-sm font-Raleway font-medium leading-normal">
            {notif.message}
          </p>
          <small className="text-primary-60 text-xs text-center font-Raleway font-medium leading-normal">
            {notif.time}
          </small>
        </div>
      ))}
    </div>
  );
};

export default NotificationDrawer;
