"use client";

import React from "react";
import { ScrollText, User } from "lucide-react";
import useAdminLogsAPI from "@/services/useAdminLogsAPI";
import {
  formatAdminLogAction,
  formatAdminLogResourceType,
  type AdminLog,
} from "@/lib/admin-logs/types";

type ViewAdminLogDrawerProps = {
  logId: string;
  initialLog?: AdminLog | null;
};

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-3 border-b border-gray-100 last:border-b-0">
      <p className="text-xs font-medium text-gray-500 font-Raleway">{label}</p>
      <div className="text-sm font-semibold text-primary-10 font-Raleway break-words">{value || "—"}</div>
    </div>
  );
}

export default function ViewAdminLogDrawer({ logId, initialLog = null }: ViewAdminLogDrawerProps) {
  const { log, isLoadingLog, logError } = useAdminLogsAPI({
    logId,
    enableDetail: true,
  });

  const current = log ?? initialLog;

  if (isLoadingLog && !current) {
    return (
      <div className="flex flex-col gap-4 py-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-full h-12 bg-opacityClr-10 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (logError && !current) {
    return (
      <div className="py-4">
        <p className="text-[#9F1B1B] text-sm font-Raleway">Failed to load log details.</p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="py-4">
        <p className="text-opacityClr-60 text-sm font-Raleway">Log not found.</p>
      </div>
    );
  }

  const metadataEntries = current.metadata ? Object.entries(current.metadata) : [];

  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-Raleway font-bold text-primary-10">
          {formatAdminLogAction(current.action)}
        </h3>
        <p className="text-sm font-Raleway text-opacityClr-60">{formatDateTime(current.createdAt)}</p>
      </div>

      <div className="rounded-xl border border-opacityClr-30 bg-white p-4">
        <div className="flex items-center gap-2 mb-2">
          <ScrollText className="w-4 h-4 text-primary-10" />
          <h4 className="text-sm font-bold text-primary-10 font-Raleway">Activity</h4>
        </div>
        <DetailRow label="Action" value={formatAdminLogAction(current.action)} />
        <DetailRow label="Resource type" value={formatAdminLogResourceType(current.resourceType)} />
        <DetailRow label="Resource ID" value={current.resourceId} />
        <DetailRow label="Description" value={current.description} />
        <DetailRow label="Remark" value={current.remark} />
      </div>

      <div className="rounded-xl border border-opacityClr-30 bg-white p-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-primary-10" />
          <h4 className="text-sm font-bold text-primary-10 font-Raleway">Performed by</h4>
        </div>
        <DetailRow label="Admin name" value={current.adminName} />
        <DetailRow label="Admin email" value={current.adminEmail} />
        <DetailRow label="Admin user ID" value={current.adminUserId} />
      </div>

      {metadataEntries.length > 0 && (
        <div className="rounded-xl border border-opacityClr-30 bg-white p-4">
          <h4 className="text-sm font-bold text-primary-10 font-Raleway mb-2">Metadata</h4>
          <pre className="text-xs font-mono text-primary-10 whitespace-pre-wrap break-words bg-[#F8F9F9] rounded-lg p-3 overflow-x-auto">
            {JSON.stringify(current.metadata, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
