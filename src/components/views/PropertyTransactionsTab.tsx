"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Eye } from "lucide-react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import TableHeader from "@/components/ui/TableHeader";
import Pagination from "@/components/ui/Pagination";
import { useDrawerModal } from "@/context/DrawerModalContext";
import useTransactionsAPI from "@/services/useTransactionsAPI";
import { emptyWallet } from "../../../public/assets/images";
import type { PropertyMarketTransaction, PropertyMarketType } from "@/lib/transactions/types";
import ViewPropertyMarketTransactionDrawer from "@/components/views/ViewPropertyMarketTransactionDrawer";

const columnHelper = createColumnHelper<PropertyMarketTransaction>();

const MARKET_FILTERS: Array<{ value: PropertyMarketType; label: string }> = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
];

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
  if (normalized === "completed" || normalized === "success" || normalized === "complete") {
    return { badge: "bg-[#CEDDB7] text-[#6D9F1B]", dot: "bg-[#6D9F1B]" };
  }
  if (normalized === "failed" || normalized === "rejected" || normalized === "declined") {
    return { badge: "bg-[#DBC8C0] text-[#9F471B]", dot: "bg-[#9F471B]" };
  }
  if (normalized === "pending" || normalized === "processing") {
    return { badge: "bg-[#E3DAC1] text-[#C39830]", dot: "bg-[#C39830]" };
  }
  return { badge: "bg-opacityClr-10 text-opacityClr-60", dot: "bg-opacityClr-40" };
}

type PropertyTransactionsTabProps = {
  propertyId: string;
};

export default function PropertyTransactionsTab({ propertyId }: PropertyTransactionsTabProps) {
  const { openModal } = useDrawerModal();
  const [market, setMarket] = useState<PropertyMarketType>("primary");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setPage(1);
  }, [market]);

  const {
    propertyMarketTransactions,
    propertyMarketMeta,
    isLoadingPropertyMarketTransactions,
    propertyMarketTransactionsError,
  } = useTransactionsAPI({
    propertyId,
    market,
    page,
    limit: pageSize,
    enablePropertyMarketTransactions: true,
  });

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "user",
        header: "User",
        cell: (info) => (
          <span className="font-medium text-primary-10">{info.row.original.userName || "—"}</span>
        ),
      }),
      columnHelper.accessor("units", {
        header: "Units",
        cell: (info) => <span>{Number(info.getValue() || 0).toLocaleString()}</span>,
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => (
          <span className="font-semibold text-primary-10">
            {formatMoney(info.getValue(), info.row.original.currency)}
          </span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = String(info.getValue() || "—");
          const styles = statusStyles(status);
          return (
            <span
              className={`inline-flex items-center gap-2 px-2 py-[6px] text-sm leading-5 rounded-lg capitalize ${styles.badge}`}
            >
              <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
              {status || "—"}
            </span>
          );
        },
      }),
      columnHelper.accessor("createdAt", {
        header: "Date",
        cell: (info) => <span className="whitespace-nowrap">{formatDate(info.getValue())}</span>,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <button
            type="button"
            onClick={() =>
              openModal(
                "Transaction details",
                <ViewPropertyMarketTransactionDrawer transaction={info.row.original} />
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-opacityClr-30 text-sm font-Raleway font-semibold text-primary-10 hover:bg-opacityClr-10"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
        ),
      }),
    ],
    [openModal]
  );

  const table = useReactTable({
    data: propertyMarketTransactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: propertyMarketMeta.totalPages,
  });

  const hasData = propertyMarketTransactions.length > 0;
  const marketLabel = market === "primary" ? "Primary" : "Secondary";

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap items-center gap-2">
        {MARKET_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setMarket(filter.value)}
            className={`px-4 py-2 rounded-full text-sm font-Raleway font-semibold transition-colors ${
              market === filter.value
                ? "bg-primary-10 text-white"
                : "bg-opacityClr-10 text-opacityClr-80 hover:bg-opacityClr-20"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
        <TableHeader
          title={`${marketLabel} transactions (${propertyMarketMeta.totalRecords})`}
          isLoading={isLoadingPropertyMarketTransactions}
          table={table}
          showExport={false}
          showSearch={false}
          showFilter={false}
          onFilterChange={() => undefined}
        />
        <TableHeadAndBody
          table={table}
          isLoading={isLoadingPropertyMarketTransactions}
          emptyState={{
            image: emptyWallet,
            alt: "No Transactions",
            message: propertyMarketTransactionsError
              ? `Failed to load ${marketLabel.toLowerCase()} market transactions. Please try again.`
              : `No ${marketLabel.toLowerCase()} market transactions for this property.`,
          }}
        />
        {hasData && (
          <Pagination
            currentPage={propertyMarketMeta.pageNumber}
            totalPages={propertyMarketMeta.totalPages}
            onPageChange={setPage}
            totalRecords={propertyMarketMeta.totalRecords}
          />
        )}
      </div>
    </div>
  );
}
