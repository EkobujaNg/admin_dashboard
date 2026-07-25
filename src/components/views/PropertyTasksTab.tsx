"use client";

import React, { useMemo, useState } from "react";
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
import Pagination from "@/components/ui/Pagination";
import { useDrawerModal } from "@/context/DrawerModalContext";
import usePropertyTasksAPI from "@/services/usePropertyTasksAPI";
import AdminPropertyTaskDrawer from "@/components/views/AdminPropertyTaskDrawer";
import { emptyWallet } from "../../../public/assets/images";
import {
  formatPropertyImpact,
  getTaskCreatedByLabel,
  type PropertyTask,
  type PropertyTaskStatus,
} from "@/lib/property-tasks/types";

const columnHelper = createColumnHelper<PropertyTask>();

const STATUS_FILTER_OPTIONS: Array<{ value: "all" | PropertyTaskStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "pending", label: "Pending" },
  { value: "complete", label: "Complete" },
  { value: "rejected", label: "Rejected" },
];

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

function statusStyles(status: string) {
  const styles: Record<string, { badge: string; dot: string }> = {
    complete: { badge: "bg-[#CEDDB7] text-[#6D9F1B]", dot: "bg-[#6D9F1B]" },
    pending: { badge: "bg-[#E3DAC1] text-[#C39830]", dot: "bg-[#C39830]" },
    new: { badge: "bg-[#DBEAFE] text-[#1D4ED8]", dot: "bg-[#1D4ED8]" },
    rejected: { badge: "bg-[#DBC8C0] text-[#9F471B]", dot: "bg-[#9F471B]" },
  };
  return styles[status] ?? { badge: "bg-opacityClr-10 text-opacityClr-60", dot: "bg-opacityClr-40" };
}

type PropertyTasksTabProps = {
  propertyId: string;
};

export default function PropertyTasksTab({ propertyId }: PropertyTasksTabProps) {
  const { openModal } = useDrawerModal();
  const [statusFilter, setStatusFilter] = useState<"all" | PropertyTaskStatus>("all");

  const { tasks, isLoadingTasks, tasksError } = usePropertyTasksAPI({
    propertyId,
    enableList: true,
  });

  const filteredTasks = useMemo(() => {
    if (statusFilter === "all") return tasks;
    return tasks.filter((task) => task.status === statusFilter);
  }, [statusFilter, tasks]);

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.taskAction, {
        id: "taskAction",
        header: "Task",
        cell: (info) => <span className="font-semibold text-primary-10">{info.getValue() || "—"}</span>,
      }),
      columnHelper.accessor((row) => row.isAssistantReport, {
        id: "createdBy",
        header: "Created By",
        cell: (info) => <span>{getTaskCreatedByLabel(info.row.original.isAssistantReport)}</span>,
      }),
      columnHelper.display({
        id: "impact",
        header: "Property Impact",
        cell: (info) => {
          const row = info.row.original;
          return (
            <span>
              {formatPropertyImpact(row.affectProperty, row.affectPropertyBy, row.affectPropertyDirection)}
            </span>
          );
        },
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          const s = statusStyles(status);
          return (
            <span
              className={`inline-flex items-center gap-2 px-2 py-[6px] text-sm leading-5 rounded-lg capitalize ${s.badge}`}
            >
              <span className={`w-2 h-2 rounded-full ${s.dot}`} />
              {status}
            </span>
          );
        },
      }),
      columnHelper.accessor((row) => row.createdAt ?? "", {
        id: "createdAt",
        header: "Date / Time",
        cell: (info) => <span>{formatDate(info.getValue())}</span>,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const task = info.row.original;

          return (
            <button
              type="button"
              onClick={() =>
                openModal(
                  "Task details",
                  <AdminPropertyTaskDrawer taskId={task.id} propertyId={propertyId} />
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-opacityClr-30 text-sm font-Raleway font-semibold text-primary-10 hover:bg-opacityClr-10"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
          );
        },
      }),
    ],
    [openModal, propertyId]
  );

  const table = useReactTable({
    data: filteredTasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const hasData = filteredTasks.length > 0;
  const statusLabel = STATUS_FILTER_OPTIONS.find((option) => option.value === statusFilter)?.label ?? "All";

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
        <TableHeader
          title={`Tasks (${filteredTasks.length})`}
          isLoading={isLoadingTasks}
          table={table}
          showSearch={false}
          filterLabel={statusLabel}
          filterOptions={STATUS_FILTER_OPTIONS}
          filterValue={statusFilter}
          onFilterChange={(value) => setStatusFilter(value as "all" | PropertyTaskStatus)}
        />
        <TableHeadAndBody
          table={table}
          isLoading={isLoadingTasks}
          emptyState={{
            image: emptyWallet,
            alt: "No Tasks",
            message: tasksError
              ? "Failed to load tasks for this property. Please try again."
              : statusFilter === "all"
                ? "No tasks have been assigned to this property yet."
                : `No ${statusFilter} tasks for this property.`,
          }}
        />
        {hasData && (
          <Pagination
            currentPage={table.getState().pagination.pageIndex + 1}
            totalPages={Math.max(table.getPageCount(), 1)}
            onPageChange={(page: number) => table.setPageIndex(page - 1)}
            totalRecords={filteredTasks.length}
            pageSize={table.getState().pagination.pageSize}
            onPageSizeChange={(size) => {
              table.setPageSize(size);
              table.setPageIndex(0);
            }}
          />
        )}
      </div>
    </div>
  );
}
