"use client";

import React from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import useNotificationsAPI from "@/services/useNotificationsAPI";
import {
  formatNotificationCategoryLabel,
  getNotificationCategoryDescription,
} from "@/lib/notifications/mappers";
import type { NotificationSetting } from "@/lib/notifications/types";

function SettingToggle({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <label className={`relative inline-flex items-center gap-2 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
      <span className="text-xs font-Raleway font-medium text-opacityClr-80">{label}</span>
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <div className={`w-10 h-5 rounded-full relative transition-all duration-300 ${checked ? "bg-[#325E62]" : "bg-[#D2D7D7]"}`}>
        <div
          className={`absolute top-[3px] left-1 w-3.5 h-3.5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </div>
    </label>
  );
}

function SettingRow({
  setting,
  disabled,
  onToggle,
}: {
  setting: NotificationSetting;
  disabled?: boolean;
  onToggle: (channel: "email" | "push") => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-[#BBC3C3] last:border-b-0 w-full">
      <div className="flex flex-col gap-1 items-start min-w-0">
        <p className="font-Raleway font-semibold text-opacityClr-100 text-sm leading-normal">
          {formatNotificationCategoryLabel(setting.category)}
        </p>
        <p className="font-Raleway font-normal text-opacityClr-80 text-sm leading-normal">
          {getNotificationCategoryDescription(setting.category)}
        </p>
      </div>

      <div className="flex items-center gap-5 shrink-0">
        <SettingToggle
          label="Email"
          checked={setting.emailEnabled}
          disabled={disabled}
          onChange={() => onToggle("email")}
        />
        <SettingToggle
          label="Push"
          checked={setting.pushEnabled}
          disabled={disabled}
          onChange={() => onToggle("push")}
        />
      </div>
    </div>
  );
}

const NotificationsAndAlerts = () => {
  const {
    settings,
    isLoadingSettings,
    settingsError,
    refetchSettings,
    updateSetting,
    updatingSettingCategory,
  } = useNotificationsAPI({ enableSettings: true });

  const handleToggle = (setting: NotificationSetting, channel: "email" | "push") => {
    updateSetting({
      category: setting.category,
      emailEnabled: channel === "email" ? !setting.emailEnabled : setting.emailEnabled,
      pushEnabled: channel === "push" ? !setting.pushEnabled : setting.pushEnabled,
    });
  };

  return (
    <div className="flex flex-col gap-8 items-start w-full">
      <Breadcrumb items={[{ label: "Settings", href: "/settings" }, { label: "Notifications and Alerts" }]} />

      <div className="flex flex-col gap-2 items-start w-full">
        <h2 className="font-Raleway font-semibold text-opacityClr-100 text-base leading-normal border-b border-[#BBC3C3] pb-3 w-full">
          Notification preferences
        </h2>
        <p className="font-Raleway text-sm text-opacityClr-80">
          Choose which alerts you want by email and push for each category.
        </p>
      </div>

      <div className="flex flex-col items-start w-full">
        {isLoadingSettings ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-16 w-full rounded-lg bg-opacityClr-10 animate-pulse my-2" />
          ))
        ) : settingsError ? (
          <div className="flex flex-col gap-3 py-6">
            <p className="font-Raleway text-sm text-opacityClr-80">Could not load notification settings.</p>
            <button
              type="button"
              onClick={() => refetchSettings()}
              className="self-start px-4 py-2 rounded-md bg-neutral-lightGreen text-primary-10 font-semibold text-sm cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : settings.length === 0 ? (
          <p className="font-Raleway text-sm text-opacityClr-80 py-6">No notification settings available.</p>
        ) : (
          settings.map((setting) => (
            <SettingRow
              key={setting.category}
              setting={setting}
              disabled={updatingSettingCategory === setting.category}
              onToggle={(channel) => handleToggle(setting, channel)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsAndAlerts;
