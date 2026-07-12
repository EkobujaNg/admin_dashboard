"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import CurrencyAmountInput from "@/components/ui/CurrencyAmountInput";
import useBuybackAPI from "@/services/useBuybackAPI";
import { formatZodErrors, topUpBuybackSchema } from "@/lib/buyback/validation";

type TopUpBuybackDrawerProps = {
  closeModal?: () => void;
  currentBalance?: number;
};

const TopUpBuybackDrawer = ({ closeModal, currentBalance = 0 }: TopUpBuybackDrawerProps) => {
  const [amount, setAmount] = useState("");
  const { topUpBuyback, isToppingUpBuyback } = useBuybackAPI();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isToppingUpBuyback) return;

    const validation = topUpBuybackSchema.safeParse({ amount });
    if (!validation.success) {
      const errors = formatZodErrors(validation.error);
      toast.error(errors.amount || Object.values(errors)[0] || "Enter a valid amount.");
      return;
    }

    topUpBuyback(validation.data.amount, {
      onSuccess: () => {
        setAmount("");
        closeModal?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4 pb-8">
      <div>
        <p className="text-sm text-gray-600 font-Raleway">
          Add funds to the Ekobuja buyback wallet used when users sell shares back.
        </p>
        <p className="text-sm font-semibold text-primary-10 font-Raleway mt-2">
          Current buyback balance: ₦
          {Number(currentBalance || 0).toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="buyback-top-up-amount" className="text-sm font-semibold text-primary-10 font-Raleway">
          Amount (NGN)
        </label>
        <div className="flex items-center justify-center gap-1 rounded-2xl border border-opacityClr-50 px-4 py-6 bg-[#F7F8F8]">
          <span className="text-4xl md:text-5xl font-bold text-primary-10 font-Raleway shrink-0 pr-1">₦</span>
          <CurrencyAmountInput
            id="buyback-top-up-amount"
            value={amount}
            onChange={setAmount}
            placeholder="0.00"
            size="xl"
            disabled={isToppingUpBuyback}
            autoFocus
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isToppingUpBuyback}
        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary-10 text-white text-sm font-semibold font-Raleway hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isToppingUpBuyback ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Topping up...
          </>
        ) : (
          "Top Up Buyback"
        )}
      </button>
    </form>
  );
};

export default TopUpBuybackDrawer;
