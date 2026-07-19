"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, ShieldCheck, UserX } from "lucide-react";
import StatsCard from "@/components/ui/StatsCard";
import Pagination from "@/components/ui/Pagination";
import TableHeader from "@/components/ui/TableHeader";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import ActionDropdown from "@/components/ui/ActionDropdown";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { emptyWallet } from "../../../../public/assets/images";
import { useDrawerModal } from "@/context/DrawerModalContext";
import CreateFacilityManagerDrawer from "@/components/views/CreateFacilityManagerDrawer";
import useFacilityManagerAPI from "@/services/useFacilityManagerAPI";
import type { FacilityManagerRecord } from "@/lib/facility-manager/types";
import { useDebounce } from "use-debounce";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper<FacilityManagerRecord>();

function formatPhoneNumber(phoneNumber?: { code?: string; number?: string }) {
  if (!phoneNumber?.number) return "—";
  return `${phoneNumber.code || ""} ${phoneNumber.number}`.trim();
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const FacilityAdminPage = () => {
  const router = useRouter();
  const { openModal, closeModal } = useDrawerModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 400);
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState<{
    type: "block" | "unblock" | "";
    manager: FacilityManagerRecord | null;
  }>({ type: "", manager: null });
  const pageSize = 10;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  const {
    facilityManagers,
    facilityManagersMeta,
    isLoadingFacilityManagers,
    facilityManagersError,
    blockManager,
    unblockManager,
    isBlockingManager,
    isUnblockingManager,
  } = useFacilityManagerAPI({
    page,
    limit: pageSize,
    search: debouncedSearchQuery,
    enableList: true,
  });

  const blockedCount = useMemo(
    () => facilityManagers.filter((manager) => manager.isBlocked).length,
    [facilityManagers]
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "name",
        header: "Name",
        cell: (info) => (
          <span className="font-semibold font-Raleway text-primary-10">
            {[info.row.original.firstName, info.row.original.lastName].filter(Boolean).join(" ") || "—"}
          </span>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => <span className="text-primary-10 font-Raleway">{info.getValue() || "—"}</span>,
      }),
      columnHelper.accessor("phoneNumber", {
        header: "Phone Number",
        cell: (info) => (
          <span className="text-primary-10 font-Raleway">{formatPhoneNumber(info.getValue())}</span>
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
        cell: (info) => (
          <span className="text-primary-10 font-Raleway">{formatDate(info.getValue())}</span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const manager = info.row.original;
          return (
            <ActionDropdown
              actions={[
                {
                  label: "View details",
                  icon: Eye,
                  onClick: () => router.push(`/facility-admin/${manager.id}`),
                },
                {
                  label: manager.isBlocked ? "Unblock manager" : "Block manager",
                  icon: manager.isBlocked ? ShieldCheck : UserX,
                  variant: (manager.isBlocked ? "success" : "danger") as "success" | "danger",
                  onClick: () =>
                    setConfirmAction({
                      type: manager.isBlocked ? "unblock" : "block",
                      manager,
                    }),
                },
              ]}
            />
          );
        },
      }),
    ],
    [router]
  );

  const table = useReactTable({
    data: facilityManagers,
    columns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: facilityManagersMeta.totalPages,
  });

  const hasData = facilityManagers.length > 0;
  const isConfirmPending = isBlockingManager || isUnblockingManager;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between w-full gap-4">
        <div>
          <h2 className="text-[28px] font-Raleway font-bold text-primary-10">
            Facility <span className="text-primary-20">Administration</span>
          </h2>
          <p className="text-sm font-Raleway font-medium text-primary-10">
            Manage all facility managers across the system
          </p>
        </div>
        <button
          className="flex items-center justify-center gap-3 px-5 py-3 bg-primary-10 rounded-lg border border-transparent transition hover:bg-transparent hover:border-primary-10 group cursor-pointer"
          onClick={() => openModal("Create Facility Manager", <CreateFacilityManagerDrawer closeModal={closeModal} />)}
        >
          <span className="text-white font-Raleway font-semibold text-base group-hover:text-primary-10">
            Create New Manager
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <StatsCard
          title="Total Facility Managers"
          count={isLoadingFacilityManagers ? "..." : facilityManagersMeta.totalRecords}
          textColor="#E8EBEB"
          FTextColor="#1d3638"
          bodyBg="#4E6E6E"
          footerBg="#E1E7E7"
          footerText="All registered facility managers"
        />
        <StatsCard
          title="Active Managers"
          count={isLoadingFacilityManagers ? "..." : Math.max(facilityManagers.length - blockedCount, 0)}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="On this page"
        />
        <StatsCard
          title="Blocked Managers"
          count={isLoadingFacilityManagers ? "..." : blockedCount}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="On this page"
        />
        <StatsCard
          title="Pending Approval Reports"
          count={0}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Starts from 06 Jan 2025"
        />
      </div>

      <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
        <TableHeader
          title={`Facility Managers (${facilityManagersMeta.totalRecords})`}
          searchQuery={searchQuery}
          handleInputChange={(e) => setSearchQuery(e.target.value)}
          handleClear={() => setSearchQuery("")}
        />
        <TableHeadAndBody
          table={table}
          isLoading={isLoadingFacilityManagers}
          emptyState={{
            image: emptyWallet,
            alt: "No facility managers",
            message: facilityManagersError
              ? "Failed to load facility managers. Please try again."
              : "No facility managers found.",
            action: !facilityManagersError
              ? {
                  label: "Create Facility Manager",
                  onClick: () =>
                    openModal("Create Facility Manager", <CreateFacilityManagerDrawer closeModal={closeModal} />),
                }
              : undefined,
          }}
        />
        {hasData && (
          <Pagination
            currentPage={facilityManagersMeta.pageNumber}
            totalPages={facilityManagersMeta.totalPages}
            onPageChange={setPage}
            totalRecords={facilityManagersMeta.totalRecords}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={Boolean(confirmAction.manager)}
        onClose={() => setConfirmAction({ type: "", manager: null })}
        onConfirm={() => {
          if (!confirmAction.manager) return;
          if (confirmAction.type === "unblock") {
            unblockManager(confirmAction.manager.id, {
              onSuccess: () => setConfirmAction({ type: "", manager: null }),
              onError: () => setConfirmAction({ type: "", manager: null }),
            });
            return;
          }
          blockManager(confirmAction.manager.id, {
            onSuccess: () => setConfirmAction({ type: "", manager: null }),
            onError: () => setConfirmAction({ type: "", manager: null }),
          });
        }}
        message={
          confirmAction.type === "unblock"
            ? `Unblock ${confirmAction.manager?.firstName || "this facility manager"}?`
            : `Block ${confirmAction.manager?.firstName || "this facility manager"}?`
        }
        cancelMsg="Cancel"
        confirmMsg={
          isConfirmPending ? "Updating..." : confirmAction.type === "unblock" ? "Unblock" : "Block"
        }
        confirmButtonColor={confirmAction.type === "unblock" ? "green" : "red"}
        confirmDisabled={isConfirmPending}
      />
    </section>
  );
};

export default FacilityAdminPage;
