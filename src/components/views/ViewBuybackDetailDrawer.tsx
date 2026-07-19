"use client";

import React, { useCallback, useState } from "react";
import { Building2, Check, Loader2, Percent, User, Wallet, X } from "lucide-react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import useBuybackAPI from "@/services/useBuybackAPI";

type ViewBuybackDetailDrawerProps = {
  requestId: string;
  closeModal?: () => void;
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatMoney(amount: number) {
  return `₦${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function statusStyles(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "approved") return "bg-[#CEDDB7] text-[#6D9F1B]";
  if (normalized === "declined") return "bg-[#DBC8C0] text-[#9F471B]";
  return "bg-[#E3DAC1] text-[#C39830]";
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-3 border-b border-gray-100 last:border-b-0">
      <p className="text-xs font-medium text-gray-500 font-Raleway">{label}</p>
      <div className="text-sm font-semibold text-primary-10 font-Raleway break-words">{value || "—"}</div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-opacityClr-30 bg-white p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary-10/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary-10" />
        </div>
        <h4 className="text-sm font-bold text-primary-10 font-Raleway">{title}</h4>
      </div>
      {children}
    </div>
  );
}

const ViewBuybackDetailDrawer = ({ requestId, closeModal }: ViewBuybackDetailDrawerProps) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"approve" | "decline" | "">("");

  const {
    requestDetail,
    isLoadingRequestDetail,
    requestDetailError,
    approveRequest,
    declineRequest,
    isApprovingRequest,
    isDecliningRequest,
  } = useBuybackAPI({
    requestId,
    enableDetail: true,
  });

  const handleCancelAction = useCallback(() => {
    setShowConfirmModal(false);
    setConfirmAction("");
  }, []);

  const handleConfirmAction = useCallback(() => {
    if (!requestId) return;

    if (confirmAction === "approve") {
      approveRequest(requestId, {
        onSuccess: () => {
          handleCancelAction();
          closeModal?.();
        },
      });
      return;
    }

    if (confirmAction === "decline") {
      declineRequest(requestId, {
        onSuccess: () => {
          handleCancelAction();
          closeModal?.();
        },
      });
    }
  }, [confirmAction, requestId, approveRequest, declineRequest, handleCancelAction, closeModal]);

  if (isLoadingRequestDetail) {
    return (
      <div className="flex items-center justify-center gap-3 py-16">
        <Loader2 className="w-5 h-5 animate-spin text-primary-10" />
        <p className="text-sm text-primary-10 font-Raleway">Loading buyback request...</p>
      </div>
    );
  }

  if (requestDetailError || !requestDetail) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-red-600 font-Raleway">Failed to load buyback request.</p>
      </div>
    );
  }

  const status = String(requestDetail.status || "pending");
  const isPending = status.toLowerCase() === "pending";
  const isConfirmPending = isApprovingRequest || isDecliningRequest;
  const isDeclineFlow = confirmAction === "decline";

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 flex flex-col gap-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-xl font-Raleway font-bold text-primary-10">
              {formatMoney(requestDetail.totalAmount)}
            </h3>
            <p className="text-sm text-gray-600 font-Raleway mt-1">
              {requestDetail.propertyName || "Property"} · {requestDetail.units} units
            </p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-1 text-xs rounded-lg font-semibold capitalize shrink-0 ${statusStyles(status)}`}
          >
            {status}
          </span>
        </div>

        <Section title="Buyback Summary" icon={Wallet}>
          <DetailRow label="Total Amount" value={formatMoney(requestDetail.totalAmount)} />
          <DetailRow label="Units" value={String(requestDetail.units ?? 0)} />
          <DetailRow label="Share Value" value={formatMoney(requestDetail.shareValue)} />
          <DetailRow label="Buyback Rate / Unit" value={formatMoney(requestDetail.buybackRatePerUnit)} />
          <DetailRow label="Available Units" value={String(requestDetail.availableUnits ?? 0)} />
          <DetailRow label="Status" value={<span className="capitalize">{status}</span>} />
          <DetailRow label="Date Requested" value={formatDate(requestDetail.createdAt)} />
        </Section>

        <Section title="Property" icon={Building2}>
          <DetailRow label="Property Name" value={requestDetail.propertyName || "—"} />
          <DetailRow label="Property ID" value={requestDetail.propertyId || "—"} />
          <DetailRow label="Holding ID" value={requestDetail.holdingId || "—"} />
        </Section>

        <Section title="Buyback Rate" icon={Percent}>
          <DetailRow
            label="Ekobuja Buyback %"
            value={`${Number(requestDetail.ekobujaBuyBackPercent || 0)}%`}
          />
          <DetailRow label="Buyback Rate Per Unit" value={formatMoney(requestDetail.buybackRatePerUnit)} />
        </Section>

        {(requestDetail.userName || requestDetail.userEmail) && (
          <Section title="User" icon={User}>
            {requestDetail.userName && <DetailRow label="Name" value={requestDetail.userName} />}
            {requestDetail.userEmail && <DetailRow label="Email" value={requestDetail.userEmail} />}
          </Section>
        )}
      </div>

      {isPending && (
        <div className="sticky bottom-0 z-10 -mx-4 mt-auto px-4 py-4 bg-white border-t border-opacityClr-30 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => {
                setConfirmAction("approve");
                setShowConfirmModal(true);
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#6D9F1B] text-white text-sm font-semibold font-Raleway hover:opacity-90 transition"
            >
              <Check className="w-4 h-4" />
              Approve
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmAction("decline");
                setShowConfirmModal(true);
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#9F1B1B] text-[#9F1B1B] text-sm font-semibold font-Raleway hover:bg-[#9F1B1B] hover:text-white transition"
            >
              <X className="w-4 h-4" />
              Decline
            </button>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelAction}
        onConfirm={handleConfirmAction}
        message={
          isDeclineFlow
            ? "Are you sure you want to decline this buyback request?"
            : "Are you sure you want to approve this buyback request?"
        }
        confirmMsg={
          isConfirmPending ? "Please wait..." : isDeclineFlow ? "Yes, Decline" : "Yes, Approve"
        }
        confirmButtonColor={isDeclineFlow ? "red" : "green"}
        cancelMsg="No, Cancel"
        confirmDisabled={isConfirmPending}
      />
    </div>
  );
};

export default ViewBuybackDetailDrawer;
