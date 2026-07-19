"use client";

import React from "react";
import type { FacilityManagerAssistant } from "@/lib/facility-manager/types";

type ViewAssistantManagerDrawerProps = {
  assistant: FacilityManagerAssistant;
};

const labelClass = "font-Raleway font-semibold text-opacityClr-100 text-base";
const valueClass =
  "w-full border border-opacityClr-30 rounded-lg px-4 py-3 bg-[#F8F9F9] text-opacityClr-100 text-base font-Raleway";

function formatPhone(phone?: { code?: string; number?: string }) {
  if (!phone?.number) return "—";
  return `${phone.code || ""} ${phone.number}`.trim();
}

const ViewAssistantManagerDrawer = ({ assistant }: ViewAssistantManagerDrawerProps) => {
  const fullName = [assistant.firstName, assistant.lastName].filter(Boolean).join(" ") || "—";
  const accountStatus = assistant.isBlocked ? "Blocked" : assistant.status || "Active";

  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Full Name</label>
        <div className={valueClass}>{fullName}</div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Email</label>
        <div className={valueClass}>{assistant.email || "—"}</div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Phone Number</label>
        <div className={valueClass}>{formatPhone(assistant.phoneNumber)}</div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Assigned Properties</label>
        <div className={valueClass}>{assistant.assignedPropertyCount ?? 0}</div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Account Status</label>
        <div className={`${valueClass} capitalize`}>{accountStatus}</div>
      </div>
    </div>
  );
};

export default ViewAssistantManagerDrawer;
