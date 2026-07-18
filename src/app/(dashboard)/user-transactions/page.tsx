"use client";

import React, { useCallback, useMemo, useState } from "react";
import Pagination from "@/components/ui/Pagination";
import TableHeader from "@/components/ui/TableHeader";
import { emptyWallet } from "../../../../public/assets/images";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import { useDrawerModal } from "@/context/DrawerModalContext";
import ViewWalletTransactionDrawer from "@/components/views/ViewWalletTransactionDrawer";
import useTransactionsAPI from "@/services/useTransactionsAPI";
import type { WalletTransaction } from "@/lib/transactions/types";
import { Eye } from "lucide-react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper<WalletTransaction>();

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

const UserTransactionsPage = () => {
  const { openModal } = useDrawerModal();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { walletTransactions, walletMeta, isLoadingWalletTransactions, walletTransactionsError } =
    useTransactionsAPI({
      page,
      limit: pageSize,
      enableWalletTransactions: true,
    });

  const handleViewTransaction = useCallback(
    (transaction: WalletTransaction) => {
      openModal("Transaction Details", <ViewWalletTransactionDrawer transaction={transaction} />);
    },
    [openModal]
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
      columnHelper.display({
        id: "title",
        header: "Transaction",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium text-primary-10">{info.row.original.title || "—"}</span>
            <span className="text-xs text-gray-500">{info.row.original.description || "—"}</span>
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
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => <span className="capitalize text-gray-600">{info.getValue() || "—"}</span>,
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
              {status}
            </span>
          );
        },
      }),
      columnHelper.accessor("createdAt", {
        header: "Date",
        cell: (info) => <span className="text-gray-600">{formatDate(info.getValue())}</span>,
      }),
      columnHelper.display({
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

  const table = useReactTable({
    data: walletTransactions,
    columns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: walletMeta.totalPages,
  });

  return (
    <section className="flex flex-col gap-6 pb-5">
      <div className="flex flex-col gap-1 items-start">
        <h2 className="text-[28px] font-Raleway font-bold text-primary-10">
          User <span className="text-primary-20">Transactions</span>
        </h2>
        <p className="text-sm font-Raleway font-medium text-primary-10">
          View all user wallet funding and withdrawal activity.
        </p>
      </div>

      <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
        <TableHeader
          title={`User Transactions (${walletMeta.totalRecords})`}
          isLoading={isLoadingWalletTransactions}
          table={table}
          showExport={false}
          showSearch={false}
          showFilter={false}
        />
        <TableHeadAndBody
          table={table}
          isLoading={isLoadingWalletTransactions}
          emptyState={{
            image: emptyWallet,
            alt: "No User Transactions",
            message: walletTransactionsError
              ? "Failed to load user transactions. Please try again."
              : "No user transactions found",
          }}
        />
        {walletTransactions.length > 0 && (
          <Pagination
            currentPage={walletMeta.pageNumber}
            totalPages={walletMeta.totalPages}
            onPageChange={setPage}
            totalRecords={walletMeta.totalRecords}
          />
        )}
      </div>
    </section>
  );
};

export default UserTransactionsPage;
