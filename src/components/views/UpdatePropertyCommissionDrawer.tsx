"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useDrawerModal } from "@/context/DrawerModalContext";
import usePropertyAPI from "@/services/usePropertyAPI";
import { formatZodErrors, updatePropertyCommissionSchema } from "@/lib/property/validation";

type UpdatePropertyCommissionDrawerProps = {
  propertyId: string;
  currentCommission?: number | null;
};

export default function UpdatePropertyCommissionDrawer({
  propertyId,
  currentCommission,
}: UpdatePropertyCommissionDrawerProps) {
  const { closeModal } = useDrawerModal();
  const [value, setValue] = useState(
    currentCommission != null && !Number.isNaN(Number(currentCommission))
      ? String(currentCommission)
      : ""
  );
  const { updatePropertyCommission, isUpdatingCommission } = usePropertyAPI({ propertyId });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = updatePropertyCommissionSchema.safeParse({ commission: value });
    if (!validation.success) {
      const errors = formatZodErrors(validation.error);
      toast.error(errors.commission || Object.values(errors)[0] || "Invalid commission.");
      return;
    }

    updatePropertyCommission(propertyId, validation.data.commission, {
      onSuccess: () => closeModal(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-4 h-full">
      <div className="flex flex-col gap-2">
        <label className="font-Raleway font-semibold text-opacityClr-100 text-base">
          Commission (%)
        </label>
        <input
          type="number"
          min={0.1}
          max={100}
          step="0.1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="2"
          className="w-full p-4 rounded-lg border border-opacityClr-50 text-opacityClr-100 outline-none focus:border-opacityClr-100"
        />
        <p className="text-sm font-Raleway text-opacityClr-60">
          Allowed range: 0.1% – 100%. Current:{" "}
          {currentCommission != null ? `${Number(currentCommission)}%` : "—"}
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-opacityClr-20">
        <button
          type="submit"
          disabled={isUpdatingCommission}
          className="w-full px-5 py-[14px] rounded-md bg-neutral-lightGreen text-primary-10 font-Raleway font-bold text-base hover:bg-primary-10 hover:text-white transition-colors disabled:opacity-50"
        >
          {isUpdatingCommission ? "Saving..." : "Save commission"}
        </button>
      </div>
    </form>
  );
}
