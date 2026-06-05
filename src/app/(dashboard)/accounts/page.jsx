"use client";

import React, { useState, useMemo, useCallback } from "react";
import StatsCard from "@/components/ui/StatsCard";
import TabButton from "@/components/ui/TabButton";
import Pagination from "@/components/ui/Pagination";
import ActionDropdown from "@/components/ui/ActionDropdown";
import { Pencil, UserX, Check, X } from "lucide-react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import TableHeader from "@/components/ui/TableHeader";
import { emptyUser } from "../../../../public/assets/images";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useDrawerModal } from "@/context/DrawerModalContext";
import EditUserDrawer from "@/components/views/EditUserDrawer";
import useUserAPI from "@/services/useUsersAPI";

const columnHelper = createColumnHelper();

const AccountPage = () => {
  const { openModal } = useDrawerModal();
  const [activeTab, setActiveTab] = useState("activeUsers");
  const [searchQuery, setSearchQuery] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ type: "", userId: null });
  const {
    summaryStats,
    isLoadingSummary,
    users = [],
    isLoadingUsers,
    deactivateUser,
    acceptUser,
    rejectUser,
  } = useUserAPI({ enableUsers: true });

  // Format users data for the table

  // Handler functions (defined first so they can be used as useMemo deps)
  const handleEditUser = useCallback(
    (id) => {
      const userToEdit = users.find((user) => user.userId === id);
      if (userToEdit) {
        openModal("Edit User", <EditUserDrawer userDetails={userToEdit} />);
      }
    },
    [openModal, users]
  );

  const handleToggleUserStatus = useCallback((id, shouldActivate) => {
    setConfirmAction({
      type: shouldActivate ? "activate" : "deactivate",
      userId: id,
    });
    setShowConfirmModal(true);
  }, []);

  const handleAcceptUser = useCallback((id) => {
    setConfirmAction({ type: "accept", userId: id });
    setShowConfirmModal(true);
  }, []);

  const handleRejectUser = useCallback((id) => {
    setConfirmAction({ type: "reject", userId: id });
    setShowConfirmModal(true);
  }, []);

  const commonColumns = useMemo(
    () => [
      columnHelper.accessor((row) => `${row.firstName || ""} ${row.lastName || ""}`.trim(), {
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
      columnHelper.accessor("role", {
        cell: (info) => <span className="capitalize">{info.getValue()?.toLowerCase()}</span>,
        header: "Role",
      }),
      columnHelper.accessor("isActive", {
        header: "Status",
        cell: (info) => {
          const isActive = info.getValue();
          let statusText, statusStyles, dotColor;

          if (isActive === true) {
            statusText = "Active";
            statusStyles = "bg-[#CEDDB7] text-[#6D9F1B]";
            dotColor = "bg-[#6D9F1B]";
          } else if (isActive === false) {
            statusText = "Inactive";
            statusStyles = "bg-[#E3DAC1] text-[#C39830]";
            dotColor = "#C39830";
          } else {
            statusText = "Unknown";
            statusStyles = "bg-[#BCBAB2] text-[#3E392C]";
            dotColor = "#3E392C";
          }

          return (
            <span className={`inline-flex items-center gap-2 px-2 py-[6px] text-sm leading-5 rounded-lg capitalize ${statusStyles}`}>
              <span className={`w-2 h-2 rounded-full ${dotColor}`} />
              {statusText}
            </span>
          );
        },
      }),
    ],
    []
  );

  // ACTIVE USERS → Actions Column (Edit, Deactivate)
  const activeUserColumns = useMemo(
    () => [
      ...commonColumns,
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const userId = info.row.original.userId;
          return (
            <ActionDropdown
              actions={[
                {
                  label: "Edit User",
                  icon: Pencil,
                  onClick: () => handleEditUser(userId),
                },
                {
                  label: info.row.original.isActive ? "Deactivate User" : "Activate User",
                  icon: info.row.original.isActive ? UserX : Check,
                  variant: info.row.original.isActive ? "danger" : "success",
                  onClick: () => handleToggleUserStatus(userId, !info.row.original.isActive),
                },
              ]}
            />
          );
        },
      }),
    ],
    [commonColumns, handleEditUser, handleToggleUserStatus]
  );

  // PENDING USERS → Actions Column (Accept, Reject)
  const pendingUserColumns = useMemo(
    () => [
      ...commonColumns,
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const userId = info.row.original.userId;
          return (
            <ActionDropdown
              actions={[
                {
                  label: "Accept Request",
                  icon: Check,
                  variant: "success",
                  onClick: () => handleAcceptUser(userId),
                },
                {
                  label: "Reject Request",
                  icon: X,
                  variant: "danger",
                  onClick: () => handleRejectUser(userId),
                },
              ]}
            />
          );
        },
      }),
    ],
    [commonColumns, handleAcceptUser, handleRejectUser]
  );
  const handleConfirmAction = useCallback(() => {
    if (confirmAction.type === "deactivate" || confirmAction.type === "activate") {
      deactivateUser(confirmAction.userId);
    } else if (confirmAction.type === "accept") {
      acceptUser(confirmAction.userId);
    } else if (confirmAction.type === "reject") {
      rejectUser(confirmAction.userId);
    }
    setShowConfirmModal(false);
    setConfirmAction({ type: "", userId: null });
  }, [confirmAction, deactivateUser, acceptUser, rejectUser]);

  const handleCancelAction = useCallback(() => {
    setShowConfirmModal(false);
    setConfirmAction({ type: "", userId: null });
  }, []);

  // Initialize tables directly without useMemo
  const activeTable = useReactTable({
    data: users || [],
    columns: activeUserColumns,
    state: { globalFilter: searchQuery },
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pendingTable = useReactTable({
    data: users || [],
    columns: pendingUserColumns,
    state: { globalFilter: searchQuery },
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const renderPagination = useCallback((tableInstance) => {
    const hasData = tableInstance.getRowModel()?.rows.length > 0;
    return hasData ? <Pagination table={tableInstance} /> : null;
  }, []);

  return (
    <section className="flex flex-col gap-6">
      {/* header */}
      <div className="flex flex-col gap-1 items-start">
        <h2 className="text-primary-10 font-Raleway font-bold text-[28px]">
          User <span className="text-primary-20">Management</span>
        </h2>
        <p className="text-primary-10 font-Raleway text-sm">Create and manage user accounts on EkoBuja</p>
      </div>

      {/* stat card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <StatsCard
          title="Total Registered Users"
          count={isLoadingSummary ? "..." : summaryStats?.totalRegisteredUsers ?? 0}
          textColor="#E8EBEB"
          FTextColor="#1d3638"
          bodyBg="#4E6E6E"
          footerBg="#E1E7E7"
          footerText={`Starts from ${summaryStats?.earliestSignupDate ? new Date(summaryStats.earliestSignupDate).toDateString() : "N/A"}`}
        />
        <StatsCard
          title="Active Users"
          count={isLoadingSummary ? "..." : summaryStats?.activeUsers ?? 0}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText={`Starts from ${summaryStats?.earliestSignupDate ? new Date(summaryStats.earliestSignupDate).toDateString() : "N/A"}`}
        />
        <StatsCard
          title="Pending Request"
          count={isLoadingSummary ? "..." : summaryStats?.pendingRequests ?? 0}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText={`Starts from ${summaryStats?.earliestSignupDate ? new Date(summaryStats.earliestSignupDate).toDateString() : "N/A"}`}
        />
        <StatsCard
          title="Deactivated Accounts"
          count={isLoadingSummary ? "..." : summaryStats?.deactivatedAccounts ?? 0}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText={`Starts from ${summaryStats?.earliestSignupDate ? new Date(summaryStats.earliestSignupDate).toDateString() : "N/A"}`}
        />
      </div>

      {/* tab buttons */}
      <div className="flex items-center justify-center gap-2 w-full bg-[#ECECEC] rounded-[100px]">
        <TabButton label="Active Users" isActive={activeTab === "activeUsers"} onClick={() => setActiveTab("activeUsers")} />
        <TabButton label="Pending Request" isActive={activeTab === "pendingReq"} onClick={() => setActiveTab("pendingReq")} />
      </div>

      <div className="flex flex-col gap-4 w-full">
        {activeTab === "activeUsers" && (
          <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white ">
            <TableHeader
              title="User Management"
              searchQuery={searchQuery}
              handleInputChange={(e) => setSearchQuery(e.target.value)}
              handleClear={() => setSearchQuery("")}
              isLoading={isLoadingUsers}
              table={activeTable}
            />
            <TableHeadAndBody
              table={activeTable}
              isLoading={isLoadingUsers}
              emptyState={{
                image: emptyUser,
                alt: "No Users Found",
                message: isLoadingUsers ? "Loading users..." : "No users found",
                action: !isLoadingUsers && {
                  label: "Refresh",
                  onClick: () => window.location.reload(),
                },
              }}
            />
            {renderPagination(activeTable)}
          </div>
        )}

        {activeTab === "pendingReq" && (
          <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
            <TableHeader
              title="Pending Users"
              searchQuery={searchQuery}
              handleInputChange={(e) => setSearchQuery(e.target.value)}
              handleClear={() => setSearchQuery("")}
            />
            <TableHeadAndBody
              table={pendingTable}
              emptyState={{
                image: emptyUser,
                alt: "No Pending Users",
                message: "No pending requests currently!",
              }}
            />
            {renderPagination(pendingTable)}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelAction}
        onConfirm={handleConfirmAction}
        message={
          confirmAction.type === "edit"
            ? "Are you sure you want to edit this user?"
            : confirmAction.type === "accept"
            ? "You are about to approve a user onboarding request."
            : confirmAction.type === "reject"
            ? "You are about to reject a user onboarding request"
            : confirmAction.type === "activate"
            ? "Are you sure you want to activate this user?"
            : "Are you sure you want to deactivate this user?"
        }
        confirmMsg={
          confirmAction.type === "edit"
            ? "Edit"
            : confirmAction.type === "accept"
            ? "Yes, Proceed To Accept."
            : confirmAction.type === "reject"
            ? "Yes, Proceed To Reject."
            : "Yes, Am sure"
        }
        confirmButtonColor={confirmAction.type === "accept" || confirmAction.type === "activate" ? "green" : ""}
        cancelMsg="No, Cancel Request"
      />
    </section>
  );
};

export default AccountPage;
