"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import StatsCard from "@/components/ui/StatsCard";
import Pagination from "@/components/ui/Pagination";
import TableHeader from "@/components/ui/TableHeader";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
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
  const { openModal, closeModal } = useDrawerModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 400);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  const {
    facilityManagers,
    facilityManagersMeta,
    isLoadingFacilityManagers,
    facilityManagersError,
  } = useFacilityManagerAPI({
    page,
    limit: pageSize,
    search: debouncedSearchQuery,
    enableList: true,
  });

  const columns = [
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
      cell: (info) => <span className="text-primary-10 font-Raleway">{formatPhoneNumber(info.getValue())}</span>,
    }),
    columnHelper.accessor("createdAt", {
      header: "Date Added",
      cell: (info) => <span className="text-primary-10 font-Raleway">{formatDate(info.getValue())}</span>,
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <Link
          href={`/facility-admin/${info.row.original.id}`}
          className="border border-opacityClr-100 rounded px-4 py-1.5 font-Raleway font-normal text-opacityClr-100 text-sm cursor-pointer hover:bg-opacityClr-10 transition-colors"
        >
          View
        </Link>
      ),
    }),
  ];

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
          title="Approved Reports"
          count={0}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Starts from 06 Jan 2025"
        />
        <StatsCard
          title="Pending Approval Reports"
          count={0}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Starts from 06 Jan 2025"
        />
        <StatsCard
          title="Rejected Reports"
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
    </section>
  );
};

export default FacilityAdminPage;
