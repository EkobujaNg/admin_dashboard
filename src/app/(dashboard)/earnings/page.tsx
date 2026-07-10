"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Pagination from "@/components/ui/Pagination";
import TableHeader from "@/components/ui/TableHeader";
import StatsCard from "@/components/ui/StatsCard";
import TabButton from "@/components/ui/TabButton";
import { emptyWallet } from "../../../../public/assets/images";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import { useDrawerModal } from "@/context/DrawerModalContext";
import ViewWalletTransactionDrawer from "@/components/views/ViewWalletTransactionDrawer";
import ViewCommissionDrawer from "@/components/views/ViewCommissionDrawer";
import TopUpBuybackDrawer from "@/components/views/TopUpBuybackDrawer";
import useAppWalletAPI from "@/services/useAppWalletAPI";
import useTransactionsAPI from "@/services/useTransactionsAPI";
import type { CommissionRecord, WalletTransaction } from "@/lib/transactions/types";
import { Eye, Plus } from "lucide-react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

type EarningsTab = "transactions" | "commissions";

const walletColumnHelper = createColumnHelper<WalletTransaction>();
const commissionColumnHelper = createColumnHelper<CommissionRecord>();

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

function statusStyles(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "completed" || normalized === "success") {
    return { badge: "bg-[#CEDDB7] text-[#6D9F1B]", dot: "bg-[#6D9F1B]" };
  }
  if (normalized === "failed" || normalized === "rejected") {
    return { badge: "bg-[#DBC8C0] text-[#9F471B]", dot: "bg-[#9F471B]" };
  }
  return { badge: "bg-[#E3DAC1] text-[#C39830]", dot: "bg-[#C39830]" };
}

const EarningsPage = () => {
  const { openModal, closeModal } = useDrawerModal();
  const [activeTab, setActiveTab] = useState<EarningsTab>("commissions");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const { balance, isLoadingBalance } = useAppWalletAPI({ enableBalance: true });

  const {
    walletTransactions,
    walletMeta,
    isLoadingWalletTransactions,
    walletTransactionsError,
    commissions,
    commissionsMeta,
    isLoadingCommissions,
    commissionsError,
  } = useTransactionsAPI({
    page,
    limit: pageSize,
    enableWalletTransactions: activeTab === "transactions",
    enableCommissions: activeTab === "commissions",
  });

  const handleTopUpBuyback = useCallback(() => {
    openModal(
      "Top Up Buyback",
      <TopUpBuybackDrawer closeModal={closeModal} currentBalance={balance?.buyBackBalance} />
    );
  }, [openModal, closeModal, balance?.buyBackBalance]);

  const handleViewTransaction = useCallback(
    (transaction: WalletTransaction) => {
      openModal("Transaction Details", <ViewWalletTransactionDrawer transaction={transaction} />);
    },
    [openModal]
  );

  const handleViewCommission = useCallback(
    (commission: CommissionRecord) => {
      openModal("Commission Details", <ViewCommissionDrawer commission={commission} />);
    },
    [openModal]
  );

  const walletColumns = useMemo(
    () => [
      walletColumnHelper.display({
        id: "user",
        header: "User",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium text-primary-10">{info.row.original.userName || "—"}</span>
            <span className="text-xs text-gray-500">{info.row.original.userEmail || "—"}</span>
          </div>
        ),
      }),
      walletColumnHelper.display({
        id: "title",
        header: "Transaction",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium text-primary-10">{info.row.original.title || "—"}</span>
            <span className="text-xs text-gray-500">{info.row.original.description || "—"}</span>
          </div>
        ),
      }),
      walletColumnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => (
          <span className="font-semibold text-primary-10">
            {formatMoney(info.getValue(), info.row.original.currency)}
          </span>
        ),
      }),
      walletColumnHelper.accessor("action", {
        header: "Action",
        cell: (info) => <span className="capitalize text-gray-600">{info.getValue() || "—"}</span>,
      }),
      walletColumnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = String(info.getValue() || "—");
          const styles = statusStyles(status);
          return (
            <span className={`inline-flex items-center gap-2 px-2 py-[6px] text-sm leading-5 rounded-lg capitalize ${styles.badge}`}>
              <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
              {status}
            </span>
          );
        },
      }),
      walletColumnHelper.accessor("createdAt", {
        header: "Date",
        cell: (info) => <span className="text-gray-600">{formatDate(info.getValue())}</span>,
      }),
      walletColumnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <button
            type="button"
            onClick={() => handleViewTransaction(info.row.original)}
            className="inline-flex items-center justify-center p-2 rounded-md text-primary-10 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="View transaction"
          >
            <Eye className="w-4 h-4" />
          </button>
        ),
      }),
    ],
    [handleViewTransaction]
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

  const walletTable = useReactTable({
    data: walletTransactions,
    columns: walletColumns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: walletMeta.totalPages,
  });

  const commissionsTable = useReactTable({
    data: commissions,
    columns: commissionColumns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: commissionsMeta.totalPages,
  });

  const isTransactionsTab = activeTab === "transactions";
  const activeTable = isTransactionsTab ? walletTable : commissionsTable;
  const activeMeta = isTransactionsTab ? walletMeta : commissionsMeta;
  const isLoading = isTransactionsTab ? isLoadingWalletTransactions : isLoadingCommissions;
  const hasError = isTransactionsTab ? walletTransactionsError : commissionsError;
  const hasData = isTransactionsTab ? walletTransactions.length > 0 : commissions.length > 0;

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
        <button
          type="button"
          onClick={handleTopUpBuyback}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary-10 rounded-lg border border-transparent transition hover:bg-transparent hover:border-primary-10 group cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white group-hover:text-primary-10" />
          <span className="text-white font-Raleway font-semibold text-sm group-hover:text-primary-10">
            Top Up Buyback
          </span>
        </button>
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
          title="Buyback Balance"
          count={isLoadingBalance ? "..." : formatMoney(balance?.buyBackBalance, balance?.currency)}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Available buyback funds"
        />
      </div>

      <div className="flex items-center justify-center gap-2 w-full bg-[#ECECEC] rounded-[100px]">
        <TabButton
          label="Commissions"
          isActive={!isTransactionsTab}
          onClick={() => setActiveTab("commissions")}
        />
        <TabButton
          label="Wallet Transaction"
          isActive={isTransactionsTab}
          onClick={() => setActiveTab("transactions")}
        />
      </div>

      <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
        <TableHeader
          title={
            isTransactionsTab
              ? `Wallet Transactions (${activeMeta.totalRecords})`
              : `Commissions (${activeMeta.totalRecords})`
          }
          isLoading={isLoading}
          table={activeTable}
          showExport={false}
          showSearch={false}
          showFilter={false}
        />
        <TableHeadAndBody
          table={activeTable}
          isLoading={isLoading}
          emptyState={{
            image: emptyWallet,
            alt: isTransactionsTab ? "No Wallet Transactions" : "No Commissions",
            message: hasError
              ? `Failed to load ${isTransactionsTab ? "wallet transactions" : "commissions"}. Please try again.`
              : isTransactionsTab
                ? "No wallet transactions found"
                : "No commission records found",
          }}
        />
        {hasData && (
          <Pagination
            currentPage={activeMeta.pageNumber}
            totalPages={activeMeta.totalPages}
            onPageChange={setPage}
            totalRecords={activeMeta.totalRecords}
          />
        )}
      </div>
    </section>
  );
};

export default EarningsPage;
