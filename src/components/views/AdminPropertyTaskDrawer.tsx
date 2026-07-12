"use client";

import React, { useState } from "react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import usePropertyTasksAPI from "@/services/usePropertyTasksAPI";
import {
  formatPropertyImpact,
  getAffectPropertyDirectionLabel,
  getTaskCreatedByLabel,
} from "@/lib/property-tasks/types";

type AdminPropertyTaskDrawerProps = {
  taskId: string;
  propertyId: string;
};

const labelClass = "font-Raleway font-semibold text-opacityClr-100 text-base";
const valueClass =
  "w-full border border-opacityClr-30 rounded-lg px-4 py-3 bg-[#F8F9F9] text-opacityClr-100 text-base font-Raleway";

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export default function AdminPropertyTaskDrawer({ taskId, propertyId }: AdminPropertyTaskDrawerProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [affectRemark, setAffectRemark] = useState("");
  const { task, isLoadingTask, taskError, setAffectProperty, isUpdatingAffectProperty } =
    usePropertyTasksAPI({
      propertyId,
      taskId,
      enableDetail: true,
    });

  if (isLoadingTask) {
    return (
      <div className="flex flex-col gap-4 py-4 h-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-full h-12 bg-opacityClr-10 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (taskError || !task) {
    return (
      <div className="py-4">
        <p className="text-[#9F1B1B] text-sm font-Raleway">Failed to load task details.</p>
      </div>
    );
  }

  // Disable when impact is on; enable when it was turned off but still has a % contribution.
  const canDisableImpact = task.affectProperty === true;
  const canEnableImpact = task.affectProperty === false && task.affectPropertyBy != null;
  const showAffectButton = canDisableImpact || canEnableImpact;
  const nextAffectProperty = canDisableImpact ? false : true;

  const closeConfirm = () => {
    setConfirmOpen(false);
    setAffectRemark("");
  };

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-5 py-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Task Action</label>
          <div className={valueClass}>{task.taskAction || "—"}</div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Status</label>
          <div className={`${valueClass} capitalize`}>{task.status}</div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Property Impact</label>
          <div className={valueClass}>
            {formatPropertyImpact(task.affectProperty, task.affectPropertyBy, task.affectPropertyDirection)}
          </div>
        </div>

        {task.affectPropertyBy != null && (
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Direction</label>
            <div className={valueClass}>{getAffectPropertyDirectionLabel(task.affectPropertyDirection)}</div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Created By</label>
          <div className={valueClass}>{getTaskCreatedByLabel(task.isAssistantReport)}</div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Created At</label>
          <div className={valueClass}>{formatDate(task.createdAt)}</div>
        </div>

        {task.submittedAt && (
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Submitted At</label>
            <div className={valueClass}>{formatDate(task.submittedAt)}</div>
          </div>
        )}

        {task.reviewedAt && (
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Reviewed At</label>
            <div className={valueClass}>{formatDate(task.reviewedAt)}</div>
          </div>
        )}

        {task.remark && (
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Remark</label>
            <div className={valueClass}>{task.remark}</div>
          </div>
        )}

        {task.report && (
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Report</label>
            <div className={valueClass}>{task.report}</div>
          </div>
        )}

        {task.imageUrls.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Images</label>
            <div className="grid grid-cols-2 gap-2">
              {task.imageUrls.map((url, index) => (
                <img
                  key={`${url}-${index}`}
                  src={url}
                  alt={`Task image ${index + 1}`}
                  className="w-full h-24 rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showAffectButton && (
        <div className="shrink-0 bg-white border-t border-opacityClr-20 py-4">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={isUpdatingAffectProperty}
            className={`w-full px-5 py-[14px] rounded-md font-Raleway font-bold text-base text-white transition-colors disabled:opacity-50 ${
              canDisableImpact
                ? "bg-[#9F1B1B] hover:bg-[#7f1616]"
                : "bg-[#6D9F1B] hover:bg-[#587f16]"
            }`}
          >
            {isUpdatingAffectProperty
              ? "Updating..."
              : canDisableImpact
                ? "Disable property value impact"
                : "Enable property value impact"}
          </button>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={closeConfirm}
        onConfirm={() => {
          if (!affectRemark.trim()) return;
          setAffectProperty(task.id, nextAffectProperty, affectRemark, {
            onSuccess: closeConfirm,
            onError: closeConfirm,
          });
        }}
        message={
          canDisableImpact
            ? "Disable this task's impact on the property value? Add a remark for the override."
            : "Enable this task's impact on the property value? Add a remark for the override."
        }
        cancelMsg="Cancel"
        confirmMsg={
          isUpdatingAffectProperty
            ? "Updating..."
            : canDisableImpact
              ? "Disable"
              : "Enable"
        }
        confirmButtonColor={canDisableImpact ? "red" : "green"}
        confirmDisabled={isUpdatingAffectProperty || !affectRemark.trim()}
      >
        <textarea
          value={affectRemark}
          onChange={(e) => setAffectRemark(e.target.value)}
          placeholder={
            canDisableImpact
              ? "Admin override: task should not affect property value."
              : "Admin override: re-apply task impact on property value."
          }
          rows={3}
          className="w-full rounded-xl border border-opacityClr-50 px-3 py-2.5 text-sm font-Raleway text-primary-10 outline-none focus:border-primary-10 resize-none"
        />
      </ConfirmationModal>
    </div>
  );
}
