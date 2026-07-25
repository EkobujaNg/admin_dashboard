"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Eye, ShieldCheck, UserX } from "lucide-react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useSelector } from "react-redux";
import StatsCard from "@/components/ui/StatsCard";
import Pagination from "@/components/ui/Pagination";
import TableHeader from "@/components/ui/TableHeader";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import ActionDropdown from "@/components/ui/ActionDropdown";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useDrawerModal } from "@/context/DrawerModalContext";
import { useDebounce } from "use-debounce";
import { emptyUser } from "../../../../public/assets/images";
import useAdminsAPI from "@/services/useAdminsAPI";
import CreateAdminDrawer from "@/components/views/CreateAdminDrawer";
import ViewAdminDrawer from "@/components/views/ViewAdminDrawer";
import { formatAdminRoles, type AdminAccount } from "@/lib/admins/types";
import type { AuthUser } from "@/lib/auth/types";

function isCurrentAdmin(admin: AdminAccount, currentUser: AuthUser | null | undefined) {
  if (!currentUser) return false;
  if (currentUser.userId && admin.id === currentUser.userId) return true;
  if (currentUser.email && admin.email?.toLowerCase() === currentUser.email.toLowerCase()) return true;
  return false;
}

const columnHelper = createColumnHelper<AdminAccount>();

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

function formatPhone(phone?: { code?: string; number?: string }) {
  if (!phone?.number) return "—";
  return `${phone.code || ""} ${phone.number}`.trim();
}

export default function AdminsManagementPage() {
  const { openModal, closeModal } = useDrawerModal();
  const currentUser = useSelector((state: { auth: { user: AuthUser | null } }) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 400);
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState<{
    type: "block" | "unblock" | "";
    admin: AdminAccount | null;
  }>({ type: "", admin: null });
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, pageSize]);

  const {
    admins,
    adminsMeta,
    isLoadingAdmins,
    adminsError,
    blockAdminAccount,
    unblockAdminAccount,
    isBlockingAdmin,
    isUnblockingAdmin,
  } = useAdminsAPI({
    page,
    limit: pageSize,
    search: debouncedSearchQuery,
    enableList: true,
  });

  const blockedCount = useMemo(
    () => admins.filter((admin) => admin.isBlocked).length,
    [admins]
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "name",
        header: "Name",
        cell: (info) => (
          <span className="font-semibold font-Raleway text-primary-10">
            {[info.row.original.firstName, info.row.original.lastName].filter(Boolean).join(" ") ||
              "—"}
          </span>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => <span className="font-Raleway text-primary-10">{info.getValue() || "—"}</span>,
      }),
      columnHelper.display({
        id: "roles",
        header: "Roles",
        cell: (info) => (
          <span className="font-Raleway text-primary-10">
            {formatAdminRoles(info.row.original.roles)}
          </span>
        ),
      }),
      columnHelper.display({
        id: "phone",
        header: "Phone",
        cell: (info) => (
          <span className="font-Raleway text-primary-10">
            {formatPhone(info.row.original.phoneNumber)}
          </span>
        ),
      }),
      columnHelper.display({
        id: "status",
        header: "Status",
        cell: (info) => {
          const blocked = info.row.original.isBlocked;
          return (
            <span
              className={`inline-flex items-center gap-2 px-2 py-[6px] text-sm leading-5 rounded-lg ${
                blocked ? "bg-[#DBC8C0] text-[#9F471B]" : "bg-[#CEDDB7] text-[#6D9F1B]"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${blocked ? "bg-[#9F471B]" : "bg-[#6D9F1B]"}`} />
              {blocked ? "Blocked" : "Active"}
            </span>
          );
        },
      }),
      columnHelper.accessor("createdAt", {
        header: "Date Added",
        cell: (info) => <span className="font-Raleway text-primary-10">{formatDate(info.getValue())}</span>,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const admin = info.row.original;
          const isSelf = isCurrentAdmin(admin, currentUser);
          return (
            <ActionDropdown
              actions={[
                {
                  label: "View details",
                  icon: Eye,
                  onClick: () =>
                    openModal(
                      "Admin details",
                      <ViewAdminDrawer admin={admin} closeModal={closeModal} isSelf={isSelf} />
                    ),
                },
                ...(isSelf
                  ? []
                  : [
                      {
                        label: admin.isBlocked ? "Unblock admin" : "Block admin",
                        icon: admin.isBlocked ? ShieldCheck : UserX,
                        variant: (admin.isBlocked ? "success" : "danger") as "success" | "danger",
                        onClick: () =>
                          setConfirmAction({
                            type: admin.isBlocked ? "unblock" : "block",
                            admin,
                          }),
                      },
                    ]),
              ]}
            />
          );
        },
      }),
    ],
    [closeModal, currentUser, openModal]
  );

  const table = useReactTable({
    data: admins,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: adminsMeta.totalPages,
  });

  const hasData = admins.length > 0;
  const isConfirmPending = isBlockingAdmin || isUnblockingAdmin;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between w-full gap-4">
        <div>
          <h2 className="text-[28px] font-Raleway font-bold text-primary-10">
            Admins <span className="text-primary-20">Management</span>
          </h2>
          <p className="text-sm font-Raleway font-medium text-primary-10">
            Create and manage admin accounts and roles
          </p>
        </div>
        <button
          type="button"
          className="flex items-center justify-center gap-3 px-5 py-3 bg-primary-10 rounded-lg border border-transparent transition hover:bg-transparent hover:border-primary-10 group cursor-pointer"
          onClick={() => openModal("Create Admin", <CreateAdminDrawer closeModal={closeModal} />)}
        >
          <span className="text-white font-Raleway font-semibold text-base group-hover:text-primary-10">
            Create Admin
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        <StatsCard
          title="Total Admins"
          count={isLoadingAdmins ? "..." : adminsMeta.totalRecords}
          textColor="#E8EBEB"
          FTextColor="#1d3638"
          bodyBg="#4E6E6E"
          footerBg="#E1E7E7"
          footerText="All registered admin accounts"
        />
        <StatsCard
          title="Active (this page)"
          count={isLoadingAdmins ? "..." : Math.max(admins.length - blockedCount, 0)}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Visible on current page"
        />
        <StatsCard
          title="Blocked (this page)"
          count={isLoadingAdmins ? "..." : blockedCount}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Visible on current page"
        />
      </div>

      <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
        <TableHeader
          title={`Admins (${adminsMeta.totalRecords})`}
          searchQuery={searchQuery}
          handleInputChange={(e) => setSearchQuery(e.target.value)}
          handleClear={() => setSearchQuery("")}
          showFilter={false}
          table={table}
          isLoading={isLoadingAdmins}
          onFilterChange={() => undefined}
          searchPlaceholder="Search admins..."
        />
        <TableHeadAndBody
          table={table}
          isLoading={isLoadingAdmins}
          emptyState={{
            image: emptyUser,
            alt: "No Admins",
            message: adminsError
              ? "Failed to load admins. Please try again."
              : "No admin accounts found",
          }}
        />
        {hasData && (
          <Pagination
            currentPage={adminsMeta.pageNumber}
            totalPages={adminsMeta.totalPages}
            onPageChange={setPage}
            totalRecords={adminsMeta.totalRecords}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={Boolean(confirmAction.admin)}
        onClose={() => setConfirmAction({ type: "", admin: null })}
        onConfirm={() => {
          if (!confirmAction.admin) return;
          if (isCurrentAdmin(confirmAction.admin, currentUser)) {
            setConfirmAction({ type: "", admin: null });
            return;
          }
          if (confirmAction.type === "unblock") {
            unblockAdminAccount(confirmAction.admin.id, {
              onSuccess: () => setConfirmAction({ type: "", admin: null }),
              onError: () => setConfirmAction({ type: "", admin: null }),
            });
            return;
          }
          blockAdminAccount(confirmAction.admin.id, {
            onSuccess: () => setConfirmAction({ type: "", admin: null }),
            onError: () => setConfirmAction({ type: "", admin: null }),
          });
        }}
        message={
          confirmAction.type === "unblock"
            ? `Unblock ${confirmAction.admin?.firstName || "this admin"}?`
            : `Block ${confirmAction.admin?.firstName || "this admin"}?`
        }
        cancelMsg="Cancel"
        confirmMsg={
          isConfirmPending
            ? "Updating..."
            : confirmAction.type === "unblock"
              ? "Unblock"
              : "Block"
        }
        confirmButtonColor={confirmAction.type === "unblock" ? "green" : "red"}
        confirmDisabled={isConfirmPending}
      />
    </section>
  );
}
