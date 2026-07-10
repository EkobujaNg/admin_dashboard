"use client";

import React from "react";
import { Calendar, CreditCard, User, Wallet } from "lucide-react";
import type { WalletTransaction } from "@/lib/transactions/types";

type ViewWalletTransactionDrawerProps = {
  transaction: WalletTransaction;
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
  if (normalized === "completed" || normalized === "success") return "bg-[#CEDDB7] text-[#6D9F1B]";
  if (normalized === "failed" || normalized === "rejected") return "bg-[#DBC8C0] text-[#9F471B]";
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

const ViewWalletTransactionDrawer = ({ transaction }: ViewWalletTransactionDrawerProps) => {
  const metadata = transaction.metadata || {};
  const bankName = metadata.bankName ? String(metadata.bankName) : null;
  const accountName = metadata.accountName ? String(metadata.accountName) : null;
  const accountNumber = metadata.accountNumber ? String(metadata.accountNumber) : null;

  return (
    <div className="flex flex-col gap-4 py-4 pb-8">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-xl font-Raleway font-bold text-primary-10">{transaction.title || "Transaction"}</h3>
          <p className="text-sm text-gray-600 font-Raleway mt-1">{transaction.description || "—"}</p>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-1 text-xs rounded-lg font-semibold capitalize shrink-0 ${statusStyles(transaction.status)}`}
        >
          {transaction.status || "—"}
        </span>
      </div>

      <Section title="Transaction" icon={Wallet}>
        <DetailRow label="Amount" value={formatMoney(transaction.amount, transaction.currency)} />
        <DetailRow label="Action" value={<span className="capitalize">{transaction.action || "—"}</span>} />
        <DetailRow label="Type" value={transaction.type || "—"} />
        <DetailRow label="Provider" value={transaction.provider || "—"} />
        <DetailRow label="Reference" value={transaction.reference || "—"} />
        <DetailRow label="Provider Reference" value={transaction.providerReference || "—"} />
        <DetailRow label="Created At" value={formatDate(transaction.createdAt)} />
        <DetailRow label="Updated At" value={formatDate(transaction.updatedAt)} />
      </Section>

      <Section title="User" icon={User}>
        <DetailRow label="Name" value={transaction.userName || "—"} />
        <DetailRow label="Email" value={transaction.userEmail || "—"} />
      </Section>

      {(transaction.propertyName || bankName || accountName || accountNumber) && (
        <Section title="Details" icon={CreditCard}>
          {transaction.propertyName && <DetailRow label="Property" value={transaction.propertyName} />}
          {bankName && <DetailRow label="Bank Name" value={bankName} />}
          {accountName && <DetailRow label="Account Name" value={accountName} />}
          {accountNumber && <DetailRow label="Account Number" value={accountNumber} />}
        </Section>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-400 font-Raleway">
        <Calendar className="w-3.5 h-3.5" />
        <span>ID: {transaction.id}</span>
      </div>
    </div>
  );
};

export default ViewWalletTransactionDrawer;
