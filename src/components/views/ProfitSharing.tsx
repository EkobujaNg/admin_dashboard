"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import TableHeader from "@/components/ui/TableHeader";
import Pagination from "@/components/ui/Pagination";
import useProfitSharingAPI from "@/services/useProfitSharingAPI";
import type { ProfitSharingPropertyStatus } from "@/lib/profit-sharing/types";
import { Eye } from "lucide-react";

const columnHelper = createColumnHelper<ProfitSharingPropertyStatus>();

function yesNoBadge(value: boolean) {
  return value ? (
    <span className="inline-flex items-center gap-2 px-2 py-[6px] text-sm leading-5 rounded-lg bg-[#CEDDB7] text-[#6D9F1B]">
      <span className="w-2 h-2 rounded-full bg-[#6D9F1B]" />
      Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 px-2 py-[6px] text-sm leading-5 rounded-lg bg-[#E3DAC1] text-[#C39830]">
      <span className="w-2 h-2 rounded-full bg-[#C39830]" />
      No
    </span>
  );
}

const ProfitSharing = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [nameSearch, setNameSearch] = useState("");
  const [debouncedName, setDebouncedName] = useState("");
  const pageSize = 10;

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedName(nameSearch.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [nameSearch]);

  useEffect(() => {
    setPage(1);
  }, [debouncedName]);

  const { statuses, statusesMeta, isLoadingStatuses, statusesError } = useProfitSharingAPI({
    page,
    limit: pageSize,
    name: debouncedName,
    enableStatuses: true,
  });

  const handleOpenProperty = useCallback(
    (row: ProfitSharingPropertyStatus) => {
      router.push(`/profit-sharing/${row.propertyId}`);
    },
    [router]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("propertyName", {
        header: "Property",
        cell: (info) => (
          <button
            type="button"
            onClick={() => handleOpenProperty(info.row.original)}
            className="font-semibold text-primary-10 text-left hover:underline cursor-pointer"
          >
            {info.getValue() || "—"}
          </button>
        ),
      }),
      columnHelper.accessor("year", {
        header: "Year",
        cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
      }),
      columnHelper.accessor("profitSharingRate", {
        header: "Rate",
        cell: (info) => <span className="text-primary-10">{info.getValue()}× / year</span>,
      }),
      columnHelper.accessor("currentSection", {
        header: "Current section",
        cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
      }),
      columnHelper.accessor("nextSectionToLoad", {
        header: "Next to load",
        cell: (info) => <span className="text-gray-600">{info.getValue() ?? "—"}</span>,
      }),
      columnHelper.accessor("canLoadNextSection", {
        header: "Can load",
        cell: (info) => yesNoBadge(Boolean(info.getValue())),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <button
            type="button"
            onClick={() => handleOpenProperty(info.row.original)}
            className="inline-flex items-center justify-center p-2 rounded-md text-primary-10 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="View profit sharing status"
          >
            <Eye className="w-4 h-4" />
          </button>
        ),
      }),
    ],
    [handleOpenProperty]
  );

  const table = useReactTable({
    data: statuses,
    columns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: statusesMeta.totalPages,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
        <TableHeader
          title={`Properties (${statusesMeta.totalRecords})`}
          isLoading={isLoadingStatuses}
          table={table}
          showExport={false}
          showFilter={false}
          showSearch
          searchQuery={nameSearch}
          handleInputChange={(e) => setNameSearch(e.target.value)}
          handleClear={() => setNameSearch("")}
          searchPlaceholder="Filter by property name..."
        />
        <TableHeadAndBody
          table={table}
          isLoading={isLoadingStatuses}
          emptyState={{
            message: statusesError
              ? "Failed to load profit sharing status. Please try again."
              : "No properties found",
          }}
        />
        {statuses.length > 0 && (
          <Pagination
            currentPage={statusesMeta.pageNumber}
            totalPages={statusesMeta.totalPages}
            onPageChange={setPage}
            totalRecords={statusesMeta.totalRecords}
          />
        )}
      </div>
    </div>
  );
};

export default ProfitSharing;
