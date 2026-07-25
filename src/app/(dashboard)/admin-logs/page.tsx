"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, ScrollText } from "lucide-react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import StatsCard from "@/components/ui/StatsCard";
import Pagination from "@/components/ui/Pagination";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import ActionDropdown from "@/components/ui/ActionDropdown";
import Dropdown from "@/components/ui/Dropdown";
import { useDrawerModal } from "@/context/DrawerModalContext";
import { emptyUser } from "../../../../public/assets/images";
import useAdminLogsAPI from "@/services/useAdminLogsAPI";
import ViewAdminLogDrawer from "@/components/views/ViewAdminLogDrawer";
import { exportFromTable } from "@/lib/export/table-export";
import {
  ADMIN_LOG_ACTION_OPTIONS,
  ADMIN_LOG_RESOURCE_OPTIONS,
  formatAdminLogAction,
  formatAdminLogResourceType,
  type AdminLog,
} from "@/lib/admin-logs/types";

const columnHelper = createColumnHelper<AdminLog>();

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminLogsPage() {
  const { openModal } = useDrawerModal();
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("all");
  const [resourceType, setResourceType] = useState("all");
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [action, resourceType, pageSize]);

  const { logs, logsMeta, isLoadingLogs, logsError } = useAdminLogsAPI({
    enableList: true,
    page,
    limit: pageSize,
    action,
    resourceType,
  });

  const handleViewLog = useCallback(
    (log: AdminLog) => {
      openModal("Log details", <ViewAdminLogDrawer logId={log.id} initialLog={log} />);
    },
    [openModal]
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "action",
        header: "Action",
        cell: (info) => (
          <span className="font-semibold font-Raleway text-primary-10 capitalize">
            {formatAdminLogAction(info.row.original.action)}
          </span>
        ),
      }),
      columnHelper.display({
        id: "resource",
        header: "Resource",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-Raleway text-primary-10">
              {formatAdminLogResourceType(info.row.original.resourceType)}
            </span>
            <span className="text-xs text-gray-500 font-Raleway truncate max-w-[180px]">
              {info.row.original.resourceId || "—"}
            </span>
          </div>
        ),
      }),
      columnHelper.display({
        id: "admin",
        header: "Admin",
        cell: (info) => {
          const log = info.row.original;
          return (
            <div className="flex flex-col">
              <span className="font-medium font-Raleway text-primary-10">
                {log.adminName || "—"}
              </span>
              <span className="text-xs text-gray-500 font-Raleway">{log.adminEmail || "—"}</span>
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "description",
        header: "Description",
        cell: (info) => (
          <span className="font-Raleway text-primary-10 line-clamp-2 max-w-[260px]">
            {info.row.original.description || info.row.original.remark || "—"}
          </span>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: "Date",
        cell: (info) => (
          <span className="font-Raleway text-primary-10">{formatDateTime(info.getValue())}</span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <ActionDropdown
            actions={[
              {
                label: "View details",
                icon: Eye,
                onClick: () => handleViewLog(info.row.original),
              },
            ]}
          />
        ),
      }),
    ],
    [handleViewLog]
  );

  const table = useReactTable({
    data: logs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: logsMeta.totalPages,
  });

  const hasData = logs.length > 0;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between w-full gap-4">
        <div>
          <h2 className="text-[28px] font-Raleway font-bold text-primary-10">
            Admin <span className="text-primary-20">Logs</span>
          </h2>
          <p className="text-sm font-Raleway font-medium text-primary-10">
            Track admin activity across the platform
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        <StatsCard
          title="Total Logs"
          count={isLoadingLogs ? "..." : logsMeta.totalRecords}
          textColor="#E8EBEB"
          FTextColor="#1d3638"
          bodyBg="#4E6E6E"
          footerBg="#E1E7E7"
          footerText="Matching current filters"
        />
        <StatsCard
          title="This Page"
          count={isLoadingLogs ? "..." : logs.length}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Visible on current page"
        />
        <StatsCard
          title="Filters"
          count={
            [action !== "all", resourceType !== "all"].filter(Boolean).length || "None"
          }
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Active action / resource filters"
        />
      </div>

      <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 w-full">
          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-primary-10" />
            <h3 className="text-xl text-primary-10 font-Raleway font-bold leading-8 tracking-[-0.36px]">
              Activity logs ({logsMeta.totalRecords})
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Dropdown
              label="All actions"
              options={ADMIN_LOG_ACTION_OPTIONS}
              value={action}
              onSelect={setAction}
            />
            <Dropdown
              label="All resources"
              options={ADMIN_LOG_RESOURCE_OPTIONS}
              value={resourceType}
              onSelect={setResourceType}
            />
            <Dropdown
              label="Export as"
              options={["CSV", "PDF", "Excel"]}
              onSelect={(format) =>
                exportFromTable(format, table, {
                  title: "Activity logs",
                  filename: "activity-logs",
                })
              }
            />
          </div>
        </div>

        <TableHeadAndBody
          table={table}
          isLoading={isLoadingLogs}
          emptyState={{
            image: emptyUser,
            alt: "No Logs",
            message: logsError
              ? "Failed to load admin logs. Please try again."
              : "No admin activity logs found",
          }}
        />

        {hasData && (
          <Pagination
            currentPage={logsMeta.pageNumber}
            totalPages={logsMeta.totalPages}
            onPageChange={setPage}
            totalRecords={logsMeta.totalRecords}
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
}
