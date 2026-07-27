"use client";

import React, { useState } from "react";
import { useDrawerModal } from "@/context/DrawerModalContext";
import useProfitSharingAPI from "@/services/useProfitSharingAPI";
import { confirmDistributeProfitShareSchema, formatZodErrors } from "@/lib/profit-sharing/validation";

type DistributeProfitShareDrawerProps = {
  propertyId: string;
  propertyName?: string;
  amount?: number | null;
  section?: number | null;
  onSuccess?: () => void;
};

type Step = "initiate" | "confirm";

function formatMoney(amount?: number | null) {
  return `₦${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const DistributeProfitShareDrawer = ({
  propertyId,
  propertyName,
  amount,
  section,
  onSuccess,
}: DistributeProfitShareDrawerProps) => {
  const { closeModal } = useDrawerModal();
  const [step, setStep] = useState<Step>("initiate");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { initiateDistribute, isInitiatingDistribute, distributeShare, isDistributing } =
    useProfitSharingAPI();

  const isBusy = isInitiatingDistribute || isDistributing;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBusy) return;

    setErrors({});
    initiateDistribute(propertyId, {
      onSuccess: () => setStep("confirm"),
    });
  };

  const handleConfirmDistribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBusy) return;

    const validation = confirmDistributeProfitShareSchema.safeParse({ code });
    if (!validation.success) {
      setErrors(formatZodErrors(validation.error));
      return;
    }

    setErrors({});
    distributeShare(
      propertyId,
      { code: validation.data.code.toUpperCase() },
      {
        onSuccess: () => {
          onSuccess?.();
          closeModal();
        },
      }
    );
  };

  const handleBack = () => {
    if (isBusy) return;
    setStep("initiate");
    setCode("");
    setErrors({});
  };

  return (
    <form
      onSubmit={step === "initiate" ? handleSendOtp : handleConfirmDistribute}
      className="flex flex-col gap-6 h-full relative pb-28"
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm font-Raleway text-opacityClr-80">
          {propertyName ? (
            <>
              Distribute profit share for{" "}
              <span className="font-semibold text-primary-10">{propertyName}</span>
              {section != null ? <> · section {section}</> : null}
            </>
          ) : (
            "Distribute the loaded profit share to holders."
          )}
        </p>
        {step === "confirm" ? (
          <p className="text-sm font-Raleway text-opacityClr-80">
            Enter the OTP sent to the super admin email to confirm distribution.
          </p>
        ) : (
          <p className="text-sm font-Raleway text-opacityClr-80">
            An OTP will be sent to the super admin email before distribution proceeds. Unowned
            remainder goes to profit balance.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-opacityClr-30 bg-white p-5 flex flex-col gap-3">
        <div>
          <p className="text-xs font-medium text-gray-500 font-Raleway">Amount</p>
          <p className="text-lg font-bold text-primary-10 font-Raleway mt-1">{formatMoney(amount)}</p>
        </div>
        {section != null ? (
          <div>
            <p className="text-xs font-medium text-gray-500 font-Raleway">Section</p>
            <p className="text-sm font-semibold text-primary-10 font-Raleway mt-1">{section}</p>
          </div>
        ) : null}
      </div>

      {step === "confirm" ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-opacityClr-30 bg-white p-5">
          <label htmlFor="distribute-otp" className="text-base font-semibold text-primary-10 font-Raleway">
            Super admin OTP
          </label>
          <input
            id="distribute-otp"
            name="code"
            type="text"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => {
              const nextValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
              setCode(nextValue);
              setErrors((prev) => {
                if (!prev.code) return prev;
                const next = { ...prev };
                delete next.code;
                return next;
              });
            }}
            placeholder="6-character code"
            disabled={isBusy}
            autoFocus
            className="w-full rounded-lg border border-opacityClr-50 px-4 py-3 text-base font-Raleway uppercase tracking-widest focus:border-primary-10 focus:outline-none disabled:opacity-50"
          />
          {errors.code ? <p className="text-sm text-red-600 font-Raleway">{errors.code}</p> : null}
        </div>
      ) : null}

      <div className="absolute bottom-0 left-0 right-0 bg-white py-3 border-t border-opacityClr-20 flex items-center gap-3">
        {step === "confirm" ? (
          <button
            type="button"
            disabled={isBusy}
            onClick={handleBack}
            className="flex-1 py-3 rounded-md border border-opacityClr-30 text-primary-10 font-semibold text-sm cursor-pointer disabled:opacity-50"
          >
            Back
          </button>
        ) : (
          <button
            type="button"
            disabled={isBusy}
            onClick={() => closeModal()}
            className="flex-1 py-3 rounded-md border border-opacityClr-30 text-primary-10 font-semibold text-sm cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isBusy}
          className="flex-1 py-3 rounded-md bg-primary-10 text-white font-semibold text-sm cursor-pointer disabled:opacity-50"
        >
          {step === "initiate"
            ? isInitiatingDistribute
              ? "Sending OTP..."
              : "Send OTP"
            : isDistributing
              ? "Distributing..."
              : "Confirm distribute"}
        </button>
      </div>
    </form>
  );
};

export default DistributeProfitShareDrawer;
