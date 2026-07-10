"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import StatsCard from "@/components/ui/StatsCard";
import Pagination from "@/components/ui/Pagination";
import { Eye } from "lucide-react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import TableHeader from "@/components/ui/TableHeader";
import { emptyWallet } from "../../../../public/assets/images";
import { useDrawerModal } from "@/context/DrawerModalContext";
import ViewWithdrawalDetailDrawer from "@/components/views/ViewWithdrawalDetailDrawer";
import useWithdrawalsAPI from "@/services/useWithdrawalsAPI";
import type { WithdrawalRequest, WithdrawalStatusFilter } from "@/lib/withdrawals/types";

const columnHelper = createColumnHelper<WithdrawalRequest>();

const STATUS_FILTER_OPTIONS: Array<{ value: WithdrawalStatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
];

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
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
  if (normalized === "completed") return "bg-[#CEDDB7] text-[#6D9F1B]";
  if (normalized === "rejected") return "bg-[#DBC8C0] text-[#9F471B]";
  return "bg-[#E3DAC1] text-[#C39830]";
}

const WithdrawalsPage = () => {
  const { openModal, closeModal } = useDrawerModal();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<WithdrawalStatusFilter>("all");
  const pageSize = 10;

  useEffect(() => {
    setPage(1);
  }, [status]);

  const {
    requests,
    requestsMeta,
    isLoadingRequests,
    requestsError,
    stats,
    isLoadingStats,
  } = useWithdrawalsAPI({
    enableList: true,
    enableStats: true,
    page,
    limit: pageSize,
    status,
  });

  const handleViewRequest = useCallback(
    (id: string) => {
      openModal("Withdrawal Details", <ViewWithdrawalDetailDrawer requestId={id} closeModal={closeModal} />);
    },
    [openModal, closeModal]
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "user",
        header: "User",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium text-primary-10">{info.row.original.userName || "—"}</span>
            <span className="text-xs text-gray-500">{info.row.original.userEmail || "—"}</span>
          </div>
        ),
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => (
          <span className="font-semibold text-primary-10">
            {formatMoney(info.getValue(), info.row.original.currency)}
          </span>
        ),
      }),
      columnHelper.display({
        id: "bank",
        header: "Bank Account",
        cell: (info) => {
          const { bankName, accountName, accountNumber } = info.row.original;
          return (
            <div className="flex flex-col">
              <span className="text-primary-10">{bankName || "—"}</span>
              <span className="text-xs text-gray-500">
                {[accountName, accountNumber].filter(Boolean).join(" · ") || "—"}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const value = String(info.getValue() || "pending");
          return (
            <span
              className={`inline-flex items-center px-2 py-[6px] text-sm leading-5 rounded-lg capitalize ${statusStyles(value)}`}
            >
              {value}
            </span>
          );
        },
      }),
      columnHelper.accessor("createdAt", {
        header: "Date Requested",
        cell: (info) => <span className="text-gray-600">{formatDate(info.getValue())}</span>,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <button
            type="button"
            onClick={() => handleViewRequest(info.row.original.id)}
            className="inline-flex items-center justify-center p-2 rounded-md text-primary-10 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="View withdrawal request"
          >
            <Eye className="w-4 h-4" />
          </button>
        ),
      }),
    ],
    [handleViewRequest]
  );

  const table = useReactTable({
    data: requests,
    columns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: requestsMeta.totalPages,
  });

  const hasData = requests.length > 0;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 items-start">
        <h2 className="text-primary-10 font-Raleway font-bold text-[28px]">
          Withdrawal <span className="text-primary-20">Requests</span>
        </h2>
        <p className="text-primary-10 font-Raleway text-sm">
          Review and process wallet withdrawal requests
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <StatsCard
          title="All Requests"
          count={isLoadingStats ? "..." : stats?.all ?? 0}
          textColor="#E8EBEB"
          FTextColor="#1d3638"
          bodyBg="#4E6E6E"
          footerBg="#E1E7E7"
          footerText="Total withdrawal requests"
        />
        <StatsCard
          title="Pending"
          count={isLoadingStats ? "..." : stats?.pending ?? 0}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Awaiting review"
        />
        <StatsCard
          title="Completed"
          count={isLoadingStats ? "..." : stats?.completed ?? 0}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Successfully paid out"
        />
        <StatsCard
          title="Rejected"
          count={isLoadingStats ? "..." : stats?.rejected ?? 0}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Declined requests"
        />
      </div>

      <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
        <TableHeader
          title={`Requests (${requestsMeta.totalRecords})`}
          isLoading={isLoadingRequests}
          table={table}
          showExport={false}
          showSearch={false}
          filterLabel="All"
          filterOptions={STATUS_FILTER_OPTIONS}
          filterValue={status}
          onFilterChange={(value) => setStatus(value as WithdrawalStatusFilter)}
        />
        <TableHeadAndBody
          table={table}
          isLoading={isLoadingRequests}
          emptyState={{
            image: emptyWallet,
            alt: "No Withdrawal Requests",
            message: requestsError
              ? "Failed to load withdrawal requests. Please try again."
              : "No withdrawal requests found",
          }}
        />
        {hasData && (
          <Pagination
            currentPage={requestsMeta.pageNumber}
            totalPages={requestsMeta.totalPages}
            onPageChange={setPage}
            totalRecords={requestsMeta.totalRecords}
          />
        )}
      </div>
    </section>
  );
};

export default WithdrawalsPage;
