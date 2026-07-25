"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import StatsCard from "@/components/ui/StatsCard";
import Pagination from "@/components/ui/Pagination";
import ActionDropdown from "@/components/ui/ActionDropdown";
import { Eye, UserX, Check } from "lucide-react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import TableHeader from "@/components/ui/TableHeader";
import { emptyUser } from "../../../../public/assets/images";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import useUserAPI from "@/services/useUsersAPI";
import type { AdminUserFilter, AdminUserRecord } from "@/lib/users/types";
import { useDebounce } from "use-debounce";

const columnHelper = createColumnHelper<AdminUserRecord>();

const USER_FILTER_OPTIONS: Array<{ value: AdminUserFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending_utility_bill", label: "Pending utility bill" },
  { value: "blocked", label: "Blocked" },
  { value: "kyc_complete", label: "KYC complete" },
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

function getKycLabel(user: AdminUserRecord) {
  const { nin, utilityBill } = user.kyc;
  if (nin && utilityBill) return "Complete";
  if (nin || utilityBill) return "Partial";
  return "Pending";
}

const AccountPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 400);
  const [filter, setFilter] = useState<AdminUserFilter>("all");
  const [page, setPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: "block" | "unblock" | ""; userId: string | null }>({
    type: "",
    userId: null,
  });
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, filter, pageSize]);

  const {
    summaryStats,
    isLoadingSummary,
    users = [],
    usersMeta,
    isLoadingUsers,
    usersError,
    blockUser,
    unblockUser,
    isBlockingUser,
    isUnblockingUser,
  } = useUserAPI({
    enableUsers: true,
    enableStats: true,
    page,
    limit: pageSize,
    search: debouncedSearchQuery,
    filter,
  });

  const handleViewUser = useCallback(
    (id: string) => {
      router.push(`/accounts/${id}`);
    },
    [router]
  );

  const handleToggleUserStatus = useCallback((id: string, shouldUnblock: boolean) => {
    setConfirmAction({
      type: shouldUnblock ? "unblock" : "block",
      userId: id,
    });
    setShowConfirmModal(true);
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => `${row.firstName || ""} ${row.lastName || ""}`.trim(), {
        id: "name",
        header: "Name",
        cell: (info) => <span className="font-medium">{info.getValue() || "N/A"}</span>,
      }),
      columnHelper.accessor("email", {
        cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
        header: "Email",
      }),
      columnHelper.accessor("phoneNumber", {
        cell: (info) => <span className="text-gray-600">{info.getValue() || "N/A"}</span>,
        header: "Phone",
      }),
      columnHelper.display({
        id: "kyc",
        header: "KYC",
        cell: (info) => {
          const label = getKycLabel(info.row.original);
          const styles =
            label === "Complete"
              ? "bg-[#CEDDB7] text-[#6D9F1B]"
              : label === "Partial"
                ? "bg-[#E3DAC1] text-[#C39830]"
                : "bg-[#DBC8C0] text-[#9F471B]";

          return (
            <span className={`inline-flex items-center px-2 py-[6px] text-sm leading-5 rounded-lg ${styles}`}>
              {label}
            </span>
          );
        },
      }),
      columnHelper.accessor("isBlocked", {
        header: "Status",
        cell: (info) => {
          const isBlocked = info.getValue();
          const statusText = isBlocked ? "Blocked" : "Active";
          const statusStyles = isBlocked ? "bg-[#DBC8C0] text-[#9F471B]" : "bg-[#CEDDB7] text-[#6D9F1B]";
          const dotColor = isBlocked ? "bg-[#9F471B]" : "bg-[#6D9F1B]";

          return (
            <span className={`inline-flex items-center gap-2 px-2 py-[6px] text-sm leading-5 rounded-lg ${statusStyles}`}>
              <span className={`w-2 h-2 rounded-full ${dotColor}`} />
              {statusText}
            </span>
          );
        },
      }),
      columnHelper.accessor("createdAt", {
        header: "Date Joined",
        cell: (info) => <span className="text-gray-600">{formatDate(info.getValue())}</span>,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const userId = info.row.original.id;
          const isBlocked = info.row.original.isBlocked;

          return (
            <ActionDropdown
              actions={[
                {
                  label: "View Detail",
                  icon: Eye,
                  onClick: () => handleViewUser(userId),
                },
                {
                  label: isBlocked ? "Unblock User" : "Block User",
                  icon: isBlocked ? Check : UserX,
                  variant: isBlocked ? "success" : "danger",
                  onClick: () => handleToggleUserStatus(userId, isBlocked),
                },
              ]}
            />
          );
        },
      }),
    ],
    [handleViewUser, handleToggleUserStatus]
  );

  const handleConfirmAction = useCallback(() => {
    if (!confirmAction.userId) return;

    if (confirmAction.type === "block") {
      blockUser(confirmAction.userId, {
        onSuccess: () => {
          setShowConfirmModal(false);
          setConfirmAction({ type: "", userId: null });
        },
      });
      return;
    }

    if (confirmAction.type === "unblock") {
      unblockUser(confirmAction.userId, {
        onSuccess: () => {
          setShowConfirmModal(false);
          setConfirmAction({ type: "", userId: null });
        },
      });
    }
  }, [confirmAction, blockUser, unblockUser]);

  const handleCancelAction = useCallback(() => {
    setShowConfirmModal(false);
    setConfirmAction({ type: "", userId: null });
  }, []);

  const table = useReactTable({
    data: users,
    columns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: usersMeta.totalPages,
  });

  const hasData = users.length > 0;
  const isConfirmPending = isBlockingUser || isUnblockingUser;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 items-start">
        <h2 className="text-primary-10 font-Raleway font-bold text-[28px]">
          User <span className="text-primary-20">Management</span>
        </h2>
        <p className="text-primary-10 font-Raleway text-sm">Create and manage user accounts on EkoBuja</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <StatsCard
          title="All Users"
          count={isLoadingSummary ? "..." : summaryStats?.allUsers ?? 0}
          textColor="#E8EBEB"
          FTextColor="#1d3638"
          bodyBg="#4E6E6E"
          footerBg="#E1E7E7"
          footerText="Total registered users"
        />
        <StatsCard
          title="Pending Utility Bill"
          count={isLoadingSummary ? "..." : summaryStats?.pendingUtilityBillReview ?? 0}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Awaiting utility bill review"
        />
        <StatsCard
          title="Blocked Users"
          count={isLoadingSummary ? "..." : summaryStats?.blockedUsers ?? 0}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Currently blocked accounts"
        />
        <StatsCard
          title="KYC Complete"
          count={isLoadingSummary ? "..." : summaryStats?.kycCompleteUsers ?? 0}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Fully verified users"
        />
      </div>

      <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
        <TableHeader
          title={`Users (${usersMeta.totalRecords})`}
          searchQuery={searchQuery}
          handleInputChange={(e) => setSearchQuery(e.target.value)}
          handleClear={() => setSearchQuery("")}
          isLoading={isLoadingUsers}
          table={table}
          filterLabel="All"
          filterOptions={USER_FILTER_OPTIONS}
          filterValue={filter}
          onFilterChange={(value) => setFilter(value as AdminUserFilter)}
          searchPlaceholder="Search by name or email..."
        />
        <TableHeadAndBody
          table={table}
          isLoading={isLoadingUsers}
          emptyState={{
            image: emptyUser,
            alt: "No Users Found",
            message: usersError ? "Failed to load users. Please try again." : "No users found",
          }}
        />
        {hasData && (
          <Pagination
            currentPage={usersMeta.pageNumber}
            totalPages={usersMeta.totalPages}
            onPageChange={setPage}
            totalRecords={usersMeta.totalRecords}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelAction}
        onConfirm={handleConfirmAction}
        message={
          confirmAction.type === "unblock"
            ? "Are you sure you want to unblock this user?"
            : "Are you sure you want to block this user?"
        }
        confirmMsg={isConfirmPending ? "Please wait..." : "Yes, Am sure"}
        confirmButtonColor={confirmAction.type === "unblock" ? "green" : "red"}
        cancelMsg="No, Cancel Request"
      />
    </section>
  );
};

export default AccountPage;
