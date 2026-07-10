"use client";

import React from "react";
import { Building2, Calendar, User, Wallet } from "lucide-react";
import type { CommissionRecord } from "@/lib/transactions/types";

type ViewCommissionDrawerProps = {
  commission: CommissionRecord;
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

function formatMoney(amount: number) {
  return `₦${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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

const ViewCommissionDrawer = ({ commission }: ViewCommissionDrawerProps) => {
  return (
    <div className="flex flex-col gap-4 py-4 pb-8">
      <div>
        <h3 className="text-xl font-Raleway font-bold text-primary-10">{formatMoney(commission.amount)}</h3>
        <p className="text-sm text-gray-600 font-Raleway mt-1">
          Commission from {commission.propertyName || "property"}
        </p>
      </div>

      <Section title="Commission" icon={Wallet}>
        <DetailRow label="Amount" value={formatMoney(commission.amount)} />
        <DetailRow label="Units" value={String(commission.units ?? 0)} />
        <DetailRow label="Price Per Unit" value={formatMoney(commission.pricePerUnit)} />
        <DetailRow label="Transaction ID" value={commission.transactionId || "—"} />
        <DetailRow label="Created At" value={formatDate(commission.createdAt)} />
      </Section>

      <Section title="User" icon={User}>
        <DetailRow label="Name" value={commission.userName || "—"} />
        <DetailRow label="Email" value={commission.userEmail || "—"} />
      </Section>

      <Section title="Property" icon={Building2}>
        <DetailRow label="Property Name" value={commission.propertyName || "—"} />
        <DetailRow label="Property ID" value={commission.propertyId || "—"} />
      </Section>

      <div className="flex items-center gap-2 text-xs text-gray-400 font-Raleway">
        <Calendar className="w-3.5 h-3.5" />
        <span>ID: {commission.id}</span>
      </div>
    </div>
  );
};

export default ViewCommissionDrawer;
