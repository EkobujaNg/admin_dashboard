"use client";

import React, { useState } from "react";
import CurrencyAmountInput from "@/components/ui/CurrencyAmountInput";
import { useDrawerModal } from "@/context/DrawerModalContext";
import useProfitSharingAPI from "@/services/useProfitSharingAPI";
import {
  confirmLoadProfitShareSchema,
  formatZodErrors,
  loadProfitShareSchema,
} from "@/lib/profit-sharing/validation";

type LoadProfitShareDrawerProps = {
  propertyId: string;
  propertyName?: string;
  nextSectionToLoad?: number | null;
  onSuccess?: () => void;
};

type Step = "amount" | "confirm";

const LoadProfitShareDrawer = ({
  propertyId,
  propertyName,
  nextSectionToLoad,
  onSuccess,
}: LoadProfitShareDrawerProps) => {
  const { closeModal } = useDrawerModal();
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [code, setCode] = useState("");
  const [confirmedAmount, setConfirmedAmount] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { initiateLoad, isInitiatingLoad, loadAmount, isLoadingAmount } = useProfitSharingAPI();

  const isBusy = isInitiatingLoad || isLoadingAmount;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBusy) return;

    const validation = loadProfitShareSchema.safeParse({ amount });
    if (!validation.success) {
      setErrors(formatZodErrors(validation.error));
      return;
    }

    setErrors({});
    initiateLoad(
      propertyId,
      { amount: validation.data.amount },
      {
        onSuccess: () => {
          setConfirmedAmount(validation.data.amount);
          setStep("confirm");
        },
      }
    );
  };

  const handleConfirmLoad = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBusy || confirmedAmount == null) return;

    const validation = confirmLoadProfitShareSchema.safeParse({
      amount: String(confirmedAmount),
      code,
    });
    if (!validation.success) {
      setErrors(formatZodErrors(validation.error));
      return;
    }

    setErrors({});
    loadAmount(
      propertyId,
      { amount: validation.data.amount, code: validation.data.code.toUpperCase() },
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
    setStep("amount");
    setCode("");
    setErrors({});
  };

  return (
    <form
      onSubmit={step === "amount" ? handleSendOtp : handleConfirmLoad}
      className="flex flex-col gap-6 h-full relative pb-28"
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm font-Raleway text-opacityClr-80">
          {propertyName ? (
            <>
              Load profit share for <span className="font-semibold text-primary-10">{propertyName}</span>
              {nextSectionToLoad != null ? <> · section {nextSectionToLoad}</> : null}
            </>
          ) : (
            "Enter the amount to load for the next eligible section."
          )}
        </p>
        {step === "confirm" ? (
          <p className="text-sm font-Raleway text-opacityClr-80">
            Enter the OTP sent to the super admin email to confirm this load.
          </p>
        ) : (
          <p className="text-sm font-Raleway text-opacityClr-80">
            An OTP will be sent to the super admin email before the amount is loaded.
          </p>
        )}
      </div>

      {step === "amount" ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-opacityClr-30 bg-white p-5">
          <label htmlFor="load-amount" className="text-base font-semibold text-primary-10 font-Raleway">
            Amount to load
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-opacityClr-50 px-4 py-3 focus-within:border-primary-10">
            <span className="text-primary-10 font-Raleway font-semibold">₦</span>
            <CurrencyAmountInput
              id="load-amount"
              value={amount}
              onChange={(value) => {
                setAmount(value);
                setErrors((prev) => {
                  if (!prev.amount) return prev;
                  const next = { ...prev };
                  delete next.amount;
                  return next;
                });
              }}
              placeholder="0.00"
              disabled={isBusy}
              size="md"
              inputClassName="!text-base font-Raleway"
              autoFocus
            />
          </div>
          {errors.amount ? <p className="text-sm text-red-600 font-Raleway">{errors.amount}</p> : null}
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-opacityClr-30 bg-white p-5">
            <p className="text-xs font-medium text-gray-500 font-Raleway">Amount to load</p>
            <p className="text-lg font-bold text-primary-10 font-Raleway mt-1">
              ₦{Number(confirmedAmount || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-opacityClr-30 bg-white p-5">
            <label htmlFor="load-otp" className="text-base font-semibold text-primary-10 font-Raleway">
              Super admin OTP
            </label>
            <input
              id="load-otp"
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
        </>
      )}

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
          {step === "amount"
            ? isInitiatingLoad
              ? "Sending OTP..."
              : "Send OTP"
            : isLoadingAmount
              ? "Loading..."
              : "Confirm load"}
        </button>
      </div>
    </form>
  );
};

export default LoadProfitShareDrawer;
