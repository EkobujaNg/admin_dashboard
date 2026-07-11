"use client";

import React from "react";
import { Calendar, CreditCard, User } from "lucide-react";
import type { PropertyMarketTransaction } from "@/lib/transactions/types";

type ViewPropertyMarketTransactionDrawerProps = {
  transaction: PropertyMarketTransaction;
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

export default function ViewPropertyMarketTransactionDrawer({
  transaction,
}: ViewPropertyMarketTransactionDrawerProps) {
  return (
    <div className="flex flex-col gap-4 py-4 pb-8">
      <div>
        <h3 className="text-xl font-Raleway font-bold text-primary-10">
          {transaction.title || "Transaction"}
        </h3>
        <p className="text-sm text-gray-600 font-Raleway mt-1">
          {transaction.description || transaction.propertyName || "—"}
        </p>
      </div>

      <Section title="Transaction" icon={CreditCard}>
        <DetailRow label="Amount" value={formatMoney(transaction.amount, transaction.currency)} />
        <DetailRow label="Units" value={Number(transaction.units || 0).toLocaleString()} />
        <DetailRow
          label="Price / Unit"
          value={formatMoney(transaction.pricePerUnit, transaction.currency)}
        />
        {transaction.sharesAmount != null && (
          <DetailRow
            label="Shares Amount"
            value={formatMoney(transaction.sharesAmount, transaction.currency)}
          />
        )}
        {transaction.commissionAmount != null && (
          <DetailRow
            label="Commission"
            value={`${formatMoney(transaction.commissionAmount, transaction.currency)}${
              transaction.commissionPercent != null ? ` (${transaction.commissionPercent}%)` : ""
            }`}
          />
        )}
        <DetailRow label="Status" value={<span className="capitalize">{transaction.status || "—"}</span>} />
        <DetailRow label="Action" value={<span className="capitalize">{transaction.action || "—"}</span>} />
        <DetailRow label="Provider" value={<span className="capitalize">{transaction.provider || "—"}</span>} />
        <DetailRow label="Type" value={<span className="capitalize">{transaction.type.replace(/_/g, " ") || "—"}</span>} />
        <DetailRow label="Reference" value={transaction.reference || "—"} />
        {transaction.listingId && <DetailRow label="Listing ID" value={transaction.listingId} />}
      </Section>

      <Section title="User" icon={User}>
        <DetailRow label="Name" value={transaction.userName || "—"} />
        <DetailRow label="Email" value={transaction.userEmail || "—"} />
        <DetailRow label="User ID" value={transaction.userId || "—"} />
      </Section>

      <Section title="Timeline" icon={Calendar}>
        <DetailRow label="Created At" value={formatDate(transaction.createdAt)} />
        <DetailRow label="Updated At" value={formatDate(transaction.updatedAt)} />
        <DetailRow label="Transaction ID" value={transaction.id || "—"} />
      </Section>
    </div>
  );
}
