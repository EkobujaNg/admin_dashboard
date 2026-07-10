"use client";

import React, { useCallback, useState } from "react";
import {
  Building2,
  Check,
  Loader2,
  User,
  Wallet,
  X,
} from "lucide-react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import useWithdrawalsAPI from "@/services/useWithdrawalsAPI";

type ViewWithdrawalDetailDrawerProps = {
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

function formatMoney(amount: number, currency = "NGN") {
  return `₦${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}${currency && currency !== "NGN" ? ` ${currency}` : ""}`;
}

function statusStyles(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "completed") return "bg-[#CEDDB7] text-[#6D9F1B]";
  if (normalized === "rejected") return "bg-[#DBC8C0] text-[#9F471B]";
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

const ViewWithdrawalDetailDrawer = ({ requestId, closeModal }: ViewWithdrawalDetailDrawerProps) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [confirmAction, setConfirmAction] = useState<"complete" | "reject" | "">("");

  const {
    requestDetail,
    isLoadingRequestDetail,
    requestDetailError,
    completeRequest,
    rejectRequest,
    isCompletingRequest,
    isRejectingRequest,
  } = useWithdrawalsAPI({
    requestId,
    enableDetail: true,
  });

  const handleCancelAction = useCallback(() => {
    setShowConfirmModal(false);
    setConfirmAction("");
    setRejectReason("");
  }, []);

  const handleConfirmAction = useCallback(() => {
    if (!requestId) return;

    if (confirmAction === "complete") {
      completeRequest(requestId, {
        onSuccess: () => {
          handleCancelAction();
          closeModal?.();
        },
      });
      return;
    }

    if (confirmAction === "reject") {
      const reason = rejectReason.trim();
      if (!reason) return;
      rejectRequest(
        requestId,
        { reason },
        {
          onSuccess: () => {
            handleCancelAction();
            closeModal?.();
          },
        }
      );
    }
  }, [confirmAction, requestId, completeRequest, rejectRequest, rejectReason, handleCancelAction, closeModal]);

  if (isLoadingRequestDetail) {
    return (
      <div className="flex items-center justify-center gap-3 py-16">
        <Loader2 className="w-5 h-5 animate-spin text-primary-10" />
        <p className="text-sm text-primary-10 font-Raleway">Loading withdrawal request...</p>
      </div>
    );
  }

  if (requestDetailError || !requestDetail) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-red-600 font-Raleway">Failed to load withdrawal request.</p>
      </div>
    );
  }

  const status = String(requestDetail.status || "pending");
  const isPending = status.toLowerCase() === "pending";
  const isConfirmPending = isCompletingRequest || isRejectingRequest;
  const isRejectFlow = confirmAction === "reject";
  const canConfirmReject = rejectReason.trim().length > 0;

  return (
    <div className="flex flex-col gap-4 py-4 pb-8">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-xl font-Raleway font-bold text-primary-10">
            {formatMoney(requestDetail.amount, requestDetail.currency)}
          </h3>
          <p className="text-sm text-gray-600 font-Raleway mt-1">
            {requestDetail.userName || "—"}
          </p>
          <p className="text-xs text-gray-500 font-Raleway mt-1">{requestDetail.userEmail || "—"}</p>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-1 text-xs rounded-lg font-semibold capitalize shrink-0 ${statusStyles(status)}`}
        >
          {status}
        </span>
      </div>

      {isPending && (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => {
              setConfirmAction("complete");
              setRejectReason("");
              setShowConfirmModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#6D9F1B] text-white text-sm font-semibold font-Raleway hover:opacity-90 transition"
          >
            <Check className="w-4 h-4" />
            Mark Completed
          </button>
          <button
            type="button"
            onClick={() => {
              setConfirmAction("reject");
              setRejectReason("");
              setShowConfirmModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#9F1B1B] text-[#9F1B1B] text-sm font-semibold font-Raleway hover:bg-[#9F1B1B] hover:text-white transition"
          >
            <X className="w-4 h-4" />
            Reject
          </button>
        </div>
      )}

      <Section title="Request Details" icon={Wallet}>
        <DetailRow label="Amount" value={formatMoney(requestDetail.amount, requestDetail.currency)} />
        <DetailRow label="Status" value={<span className="capitalize">{status}</span>} />
        <DetailRow label="Date Requested" value={formatDate(requestDetail.createdAt)} />
        <DetailRow label="Reviewed At" value={formatDate(requestDetail.reviewedAt)} />
        {requestDetail.rejectionReason && (
          <DetailRow label="Rejection Reason" value={requestDetail.rejectionReason} />
        )}
      </Section>

      <Section title="User" icon={User}>
        <DetailRow label="Name" value={requestDetail.userName || "—"} />
        <DetailRow label="Email" value={requestDetail.userEmail || "—"} />
      </Section>

      <Section title="Bank Account" icon={Building2}>
        <DetailRow label="Bank Name" value={requestDetail.bankName || "—"} />
        <DetailRow label="Account Name" value={requestDetail.accountName || "—"} />
        <DetailRow label="Account Number" value={requestDetail.accountNumber || "—"} />
      </Section>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelAction}
        onConfirm={handleConfirmAction}
        message={
          isRejectFlow
            ? "Are you sure you want to reject this withdrawal request? Please provide a reason."
            : "Are you sure you want to mark this withdrawal as completed?"
        }
        confirmMsg={
          isConfirmPending ? "Please wait..." : isRejectFlow ? "Yes, Reject" : "Yes, Complete"
        }
        confirmButtonColor={isRejectFlow ? "red" : "green"}
        cancelMsg="No, Cancel"
        confirmDisabled={isConfirmPending || (isRejectFlow && !canConfirmReject)}
      >
        {isRejectFlow ? (
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason for rejection"
            rows={3}
            className="w-full rounded-xl border border-opacityClr-50 px-3 py-2.5 text-sm font-Raleway text-primary-10 outline-none focus:border-primary-10 resize-none"
          />
        ) : null}
      </ConfirmationModal>
    </div>
  );
};

export default ViewWithdrawalDetailDrawer;
