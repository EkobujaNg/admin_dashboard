"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useDrawerModal } from "@/context/DrawerModalContext";
import usePropertyAPI from "@/services/usePropertyAPI";
import { formatZodErrors, updatePropertyBuybackSchema } from "@/lib/property/validation";

type UpdatePropertyBuybackDrawerProps = {
  propertyId: string;
  currentBuyback?: number | null;
};

export default function UpdatePropertyBuybackDrawer({
  propertyId,
  currentBuyback,
}: UpdatePropertyBuybackDrawerProps) {
  const { closeModal } = useDrawerModal();
  const [value, setValue] = useState(
    currentBuyback != null && !Number.isNaN(Number(currentBuyback)) ? String(currentBuyback) : ""
  );
  const { updatePropertyEkobujaBuyback, isUpdatingEkobujaBuyback } = usePropertyAPI({ propertyId });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = updatePropertyBuybackSchema.safeParse({ ekobujaBuyBack: value });
    if (!validation.success) {
      const errors = formatZodErrors(validation.error);
      toast.error(errors.ekobujaBuyBack || Object.values(errors)[0] || "Invalid buyback percent.");
      return;
    }

    updatePropertyEkobujaBuyback(propertyId, validation.data.ekobujaBuyBack, {
      onSuccess: () => closeModal(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-4 h-full">
      <div className="flex flex-col gap-2">
        <label className="font-Raleway font-semibold text-opacityClr-100 text-base">
          Ekobuja buyback (%)
        </label>
        <input
          type="number"
          min={0.1}
          max={100}
          step="0.1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="5"
          className="w-full p-4 rounded-lg border border-opacityClr-50 text-opacityClr-100 outline-none focus:border-opacityClr-100"
        />
        <p className="text-sm font-Raleway text-opacityClr-60">
          Allowed range: 0.1% – 100%. Current:{" "}
          {currentBuyback != null ? `${Number(currentBuyback)}%` : "—"}
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-opacityClr-20">
        <button
          type="submit"
          disabled={isUpdatingEkobujaBuyback}
          className="w-full px-5 py-[14px] rounded-md bg-neutral-lightGreen text-primary-10 font-Raleway font-bold text-base hover:bg-primary-10 hover:text-white transition-colors disabled:opacity-50"
        >
          {isUpdatingEkobujaBuyback ? "Saving..." : "Save buyback"}
        </button>
      </div>
    </form>
  );
}
