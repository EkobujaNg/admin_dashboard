"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Pagination from "@/components/ui/Pagination";
import TableHeader from "@/components/ui/TableHeader";
import StatsCard from "@/components/ui/StatsCard";
import TabButton from "@/components/ui/TabButton";
import { emptyWallet } from "../../../../public/assets/images";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import { useDrawerModal } from "@/context/DrawerModalContext";
import ViewCommissionDrawer from "@/components/views/ViewCommissionDrawer";
import useAppWalletAPI from "@/services/useAppWalletAPI";
import useTransactionsAPI from "@/services/useTransactionsAPI";
import useProfitSharingAPI from "@/services/useProfitSharingAPI";
import type { CommissionRecord } from "@/lib/transactions/types";
import type { UnownedProfitHistoryEntry } from "@/lib/profit-sharing/types";
import { Eye } from "lucide-react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

type EarningsTab = "commissions" | "unowned-history";

const commissionColumnHelper = createColumnHelper<CommissionRecord>();
const unownedColumnHelper = createColumnHelper<UnownedProfitHistoryEntry>();

function formatMoney(amount?: number, currency = "NGN") {
  const value = Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currency === "NGN" ? `₦${value}` : `${currency} ${value}`;
}

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

const EarningsPage = () => {
  const { openModal } = useDrawerModal();
  const [activeTab, setActiveTab] = useState<EarningsTab>("commissions");
  const [page, setPage] = useState(1);
  const [propertySearch, setPropertySearch] = useState("");
  const [debouncedPropertySearch, setDebouncedPropertySearch] = useState("");
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedPropertySearch, pageSize]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedPropertySearch(propertySearch.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [propertySearch]);

  const { balance, isLoadingBalance } = useAppWalletAPI({ enableBalance: true });

  const { commissions, commissionsMeta, isLoadingCommissions, commissionsError } = useTransactionsAPI({
    page,
    limit: pageSize,
    enableCommissions: activeTab === "commissions",
  });

  const { unownedHistory, unownedHistoryMeta, isLoadingUnownedHistory, unownedHistoryError } =
    useProfitSharingAPI({
      page,
      limit: pageSize,
      propertyName: debouncedPropertySearch,
      enableUnownedHistory: activeTab === "unowned-history",
    });

  const handleViewCommission = useCallback(
    (commission: CommissionRecord) => {
      openModal("Commission Details", <ViewCommissionDrawer commission={commission} />);
    },
    [openModal]
  );

  const commissionColumns = useMemo(
    () => [
      commissionColumnHelper.display({
        id: "user",
        header: "User",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium text-primary-10">{info.row.original.userName || "—"}</span>
            <span className="text-xs text-gray-500">{info.row.original.userEmail || "—"}</span>
          </div>
        ),
      }),
      commissionColumnHelper.accessor("propertyName", {
        header: "Property",
        cell: (info) => <span className="text-primary-10">{info.getValue() || "—"}</span>,
      }),
      commissionColumnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => <span className="font-semibold text-primary-10">{formatMoney(info.getValue())}</span>,
      }),
      commissionColumnHelper.accessor("createdAt", {
        header: "Date",
        cell: (info) => <span className="text-gray-600">{formatDate(info.getValue())}</span>,
      }),
      commissionColumnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <button
            type="button"
            onClick={() => handleViewCommission(info.row.original)}
            className="inline-flex items-center justify-center p-2 rounded-md text-primary-10 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="View commission"
          >
            <Eye className="w-4 h-4" />
          </button>
        ),
      }),
    ],
    [handleViewCommission]
  );

  const unownedColumns = useMemo(
    () => [
      unownedColumnHelper.accessor("propertyName", {
        header: "Property",
        cell: (info) => <span className="font-medium text-primary-10">{info.getValue() || "—"}</span>,
      }),
      unownedColumnHelper.accessor("section", {
        header: "Section",
        cell: (info) => <span className="text-gray-600">{info.getValue() ?? "—"}</span>,
      }),
      unownedColumnHelper.accessor("year", {
        header: "Year",
        cell: (info) => <span className="text-gray-600">{info.getValue() ?? "—"}</span>,
      }),
      unownedColumnHelper.accessor("loadedAmount", {
        header: "Loaded amount",
        cell: (info) => (
          <span className="font-semibold text-primary-10">
            {formatMoney(info.getValue(), info.row.original.currency)}
          </span>
        ),
      }),
      unownedColumnHelper.accessor("amountToProfitBalance", {
        header: "To profit balance",
        cell: (info) => (
          <span className="font-semibold text-primary-10">
            {formatMoney(info.getValue(), info.row.original.currency)}
          </span>
        ),
      }),
      unownedColumnHelper.accessor("distributedAt", {
        header: "Distributed at",
        cell: (info) => <span className="text-gray-600">{formatDate(info.getValue())}</span>,
      }),
    ],
    []
  );

  const commissionsTable = useReactTable({
    data: commissions,
    columns: commissionColumns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: commissionsMeta.totalPages,
  });

  const unownedTable = useReactTable({
    data: unownedHistory,
    columns: unownedColumns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: unownedHistoryMeta.totalPages,
  });

  const isCommissionsTab = activeTab === "commissions";
  const activeTable = isCommissionsTab ? commissionsTable : unownedTable;
  const activeMeta = isCommissionsTab ? commissionsMeta : unownedHistoryMeta;
  const isLoading = isCommissionsTab ? isLoadingCommissions : isLoadingUnownedHistory;
  const hasError = isCommissionsTab ? commissionsError : unownedHistoryError;
  const hasData = isCommissionsTab ? commissions.length > 0 : unownedHistory.length > 0;

  return (
    <section className="flex flex-col gap-6 pb-5">
      <div className="flex flex-wrap items-center justify-between w-full gap-4">
        <div>
          <h2 className="text-[28px] font-Raleway font-bold text-primary-10">
            Wallet <span className="text-primary-20">& Total Earnings</span>
          </h2>
          <p className="text-sm font-Raleway font-medium text-primary-10">
            Manage all earnings, revenue and cost of maintenance here.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <StatsCard
          title="Balance"
          count={isLoadingBalance ? "..." : formatMoney(balance?.balance, balance?.currency)}
          textColor="#E8EBEB"
          FTextColor="#1d3638"
          bodyBg="#4E6E6E"
          footerBg="#E1E7E7"
          footerText="App wallet balance"
        />
        <StatsCard
          title="Profit Balance"
          count={isLoadingBalance ? "..." : formatMoney(balance?.profitBalance, balance?.currency)}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Unowned profit balance"
        />
      </div>

      <div className="flex items-center justify-center gap-2 w-full bg-[#ECECEC] rounded-[100px]">
        <TabButton
          label="Commissions"
          isActive={isCommissionsTab}
          onClick={() => setActiveTab("commissions")}
        />
        <TabButton
          label="Profit Balance Unowned History"
          isActive={!isCommissionsTab}
          onClick={() => setActiveTab("unowned-history")}
        />
      </div>

      <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
        <TableHeader
          title={
            isCommissionsTab
              ? `Commissions (${activeMeta.totalRecords})`
              : `Profit Balance Unowned History (${activeMeta.totalRecords})`
          }
          isLoading={isLoading}
          table={activeTable}
          showFilter={false}
          showSearch={!isCommissionsTab}
          searchQuery={propertySearch}
          handleInputChange={(e) => setPropertySearch(e.target.value)}
          handleClear={() => setPropertySearch("")}
          searchPlaceholder="Filter by property name..."
        />
        <TableHeadAndBody
          table={activeTable}
          isLoading={isLoading}
          emptyState={{
            image: emptyWallet,
            alt: isCommissionsTab ? "No Commissions" : "No Unowned Profit History",
            message: hasError
              ? `Failed to load ${isCommissionsTab ? "commissions" : "unowned profit history"}. Please try again.`
              : isCommissionsTab
                ? "No commission records found"
                : "No unowned profit history found",
          }}
        />
        {hasData && (
          <Pagination
            currentPage={activeMeta.pageNumber}
            totalPages={activeMeta.totalPages}
            onPageChange={setPage}
            totalRecords={activeMeta.totalRecords}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        )}
      </div>
    </section>
  );
};

export default EarningsPage;
