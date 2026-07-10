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
import ViewBuybackDetailDrawer from "@/components/views/ViewBuybackDetailDrawer";
import useBuybackAPI from "@/services/useBuybackAPI";
import useAppWalletAPI from "@/services/useAppWalletAPI";
import type { BuybackRequest, BuybackStatusFilter } from "@/lib/buyback/types";

const columnHelper = createColumnHelper<BuybackRequest>();

const STATUS_FILTER_OPTIONS: Array<{ value: BuybackStatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
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

function formatMoney(amount: number) {
  return `₦${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function statusStyles(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "approved") return "bg-[#CEDDB7] text-[#6D9F1B]";
  if (normalized === "declined") return "bg-[#DBC8C0] text-[#9F471B]";
  return "bg-[#E3DAC1] text-[#C39830]";
}

const BuybackPage = () => {
  const { openModal, closeModal } = useDrawerModal();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<BuybackStatusFilter>("all");
  const pageSize = 10;

  useEffect(() => {
    setPage(1);
  }, [status]);

  const { requests, requestsMeta, isLoadingRequests, requestsError } = useBuybackAPI({
    enableList: true,
    page,
    limit: pageSize,
    status,
  });

  const { balance, isLoadingBalance } = useAppWalletAPI({ enableBalance: true });

  const handleViewRequest = useCallback(
    (id: string) => {
      openModal("Buyback Details", <ViewBuybackDetailDrawer requestId={id} closeModal={closeModal} />);
    },
    [openModal, closeModal]
  );

  const pendingCount = requests.filter((request) => String(request.status).toLowerCase() === "pending").length;

  const columns = useMemo(
    () => [
      columnHelper.accessor("propertyName", {
        header: "Property",
        cell: (info) => <span className="font-medium text-primary-10">{info.getValue() || "—"}</span>,
      }),
      columnHelper.accessor("units", {
        header: "Units",
        cell: (info) => <span className="text-primary-10">{info.getValue() ?? 0}</span>,
      }),
      columnHelper.accessor("shareValue", {
        header: "Share Value",
        cell: (info) => <span className="text-primary-10">{formatMoney(info.getValue())}</span>,
      }),
      columnHelper.accessor("buybackRatePerUnit", {
        header: "Buyback Rate",
        cell: (info) => <span className="text-primary-10">{formatMoney(info.getValue())}</span>,
      }),
      columnHelper.accessor("totalAmount", {
        header: "Total Amount",
        cell: (info) => (
          <span className="font-semibold text-primary-10">{formatMoney(info.getValue())}</span>
        ),
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
            aria-label="View buyback request"
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
          Ekobuja <span className="text-primary-20">Buyback</span>
        </h2>
        <p className="text-primary-10 font-Raleway text-sm">
          Review users who sold shares back to Ekobuja
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        <StatsCard
          title="Buyback Balance"
          count={isLoadingBalance ? "..." : formatMoney(balance?.buyBackBalance ?? 0)}
          textColor="#E8EBEB"
          FTextColor="#1d3638"
          bodyBg="#4E6E6E"
          footerBg="#E1E7E7"
          footerText="Available buyback funds"
        />
        <StatsCard
          title="Total Requests"
          count={isLoadingRequests ? "..." : requestsMeta.totalRecords}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Filtered buyback requests"
        />
        <StatsCard
          title="Pending on Page"
          count={isLoadingRequests ? "..." : pendingCount}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Awaiting review"
        />
      </div>

      <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
        <TableHeader
          title={`Buyback Requests (${requestsMeta.totalRecords})`}
          isLoading={isLoadingRequests}
          table={table}
          showExport={false}
          showSearch={false}
          filterLabel="All"
          filterOptions={STATUS_FILTER_OPTIONS}
          filterValue={status}
          onFilterChange={(value) => setStatus(value as BuybackStatusFilter)}
        />
        <TableHeadAndBody
          table={table}
          isLoading={isLoadingRequests}
          emptyState={{
            image: emptyWallet,
            alt: "No Buyback Requests",
            message: requestsError
              ? "Failed to load buyback requests. Please try again."
              : "No buyback requests found",
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

export default BuybackPage;
