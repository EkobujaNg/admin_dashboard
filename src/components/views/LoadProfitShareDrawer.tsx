"use client";

import React, { useState } from "react";
import CurrencyAmountInput from "@/components/ui/CurrencyAmountInput";
import { useDrawerModal } from "@/context/DrawerModalContext";
import useProfitSharingAPI from "@/services/useProfitSharingAPI";
import { formatZodErrors, loadProfitShareSchema } from "@/lib/profit-sharing/validation";

type LoadProfitShareDrawerProps = {
  propertyId: string;
  propertyName?: string;
  nextSectionToLoad?: number | null;
  onSuccess?: () => void;
};

const LoadProfitShareDrawer = ({
  propertyId,
  propertyName,
  nextSectionToLoad,
  onSuccess,
}: LoadProfitShareDrawerProps) => {
  const { closeModal } = useDrawerModal();
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { loadAmount, isLoadingAmount } = useProfitSharingAPI();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoadingAmount) return;

    const validation = loadProfitShareSchema.safeParse({ amount });
    if (!validation.success) {
      setErrors(formatZodErrors(validation.error));
      return;
    }

    setErrors({});
    loadAmount(
      propertyId,
      { amount: validation.data.amount },
      {
        onSuccess: () => {
          onSuccess?.();
          closeModal();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full relative pb-28">
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
      </div>

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
            disabled={isLoadingAmount}
            size="md"
            inputClassName="!text-base font-Raleway"
            autoFocus
          />
        </div>
        {errors.amount ? <p className="text-sm text-red-600 font-Raleway">{errors.amount}</p> : null}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white py-3 border-t border-opacityClr-20 flex items-center gap-3">
        <button
          type="button"
          disabled={isLoadingAmount}
          onClick={() => closeModal()}
          className="flex-1 py-3 rounded-md border border-opacityClr-30 text-primary-10 font-semibold text-sm cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoadingAmount}
          className="flex-1 py-3 rounded-md bg-primary-10 text-white font-semibold text-sm cursor-pointer disabled:opacity-50"
        >
          {isLoadingAmount ? "Loading..." : "Confirm load"}
        </button>
      </div>
    </form>
  );
};

export default LoadProfitShareDrawer;
