"use client";

import React, { useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import { useDrawerModal } from "@/context/DrawerModalContext";
import useProfitSharingAPI from "@/services/useProfitSharingAPI";
import { PROFIT_SHARING_RATE_OPTIONS } from "@/lib/profit-sharing/types";
import { formatZodErrors, updateProfitSharingRateSchema } from "@/lib/profit-sharing/validation";

type UpdateProfitSharingRateDrawerProps = {
  propertyId: string;
  propertyName?: string;
  currentRate?: number;
  onSuccess?: () => void;
};

const RATE_DROPDOWN_OPTIONS = PROFIT_SHARING_RATE_OPTIONS.map((option) => ({
  value: String(option.value),
  label: option.label,
}));

const UpdateProfitSharingRateDrawer = ({
  propertyId,
  propertyName,
  currentRate,
  onSuccess,
}: UpdateProfitSharingRateDrawerProps) => {
  const { closeModal } = useDrawerModal();
  const initialRate =
    currentRate != null && PROFIT_SHARING_RATE_OPTIONS.some((option) => option.value === currentRate)
      ? String(currentRate)
      : "";
  const [rate, setRate] = useState(initialRate);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { updateRate, isUpdatingRate } = useProfitSharingAPI();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdatingRate) return;

    const validation = updateProfitSharingRateSchema.safeParse({
      profitSharingRate: rate ? Number(rate) : undefined,
    });
    if (!validation.success) {
      setErrors(formatZodErrors(validation.error));
      return;
    }

    setErrors({});
    updateRate(
      propertyId,
      { profitSharingRate: validation.data.profitSharingRate },
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
              Update profit sharing rate for{" "}
              <span className="font-semibold text-primary-10">{propertyName}</span>
              {currentRate != null ? <> · current {currentRate}× / year</> : null}
            </>
          ) : (
            "Select how many times profit is shared per year."
          )}
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-opacityClr-30 bg-white p-5">
        <label className="text-base font-semibold text-primary-10 font-Raleway">
          Profit sharing rate
        </label>
        <Dropdown
          label="Select rate"
          options={RATE_DROPDOWN_OPTIONS}
          value={rate}
          onSelect={(value) => {
            setRate(value);
            setErrors((prev) => {
              if (!prev.profitSharingRate) return prev;
              const next = { ...prev };
              delete next.profitSharingRate;
              return next;
            });
          }}
        />
        {errors.profitSharingRate ? (
          <p className="text-sm text-red-600 font-Raleway">{errors.profitSharingRate}</p>
        ) : null}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white py-3 border-t border-opacityClr-20 flex items-center gap-3">
        <button
          type="button"
          disabled={isUpdatingRate}
          onClick={() => closeModal()}
          className="flex-1 py-3 rounded-md border border-opacityClr-30 text-primary-10 font-semibold text-sm cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isUpdatingRate || !rate}
          className="flex-1 py-3 rounded-md bg-primary-10 text-white font-semibold text-sm cursor-pointer disabled:opacity-50"
        >
          {isUpdatingRate ? "Updating..." : "Update rate"}
        </button>
      </div>
    </form>
  );
};

export default UpdateProfitSharingRateDrawer;
