"use client";

import React, { useState, useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import StatsCard from "@/components/ui/StatsCard";
import TabButton from "@/components/ui/TabButton";
import Pagination from "@/components/ui/Pagination";
import TableHeader from "@/components/ui/TableHeader";
import { useDrawerModal } from "@/context/DrawerModalContext";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import { emptyUser } from "../../../../public/assets/images";
import { reportTableData } from "@/data";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const ReportManagementPage = () => {
  const { openModal } = useDrawerModal();
  const [activeTab, setActiveTab] = useState("allReport");
  const [searchQuery, setSearchQuery] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");

  const columnHelper = createColumnHelper<any>();

  const reportColumns = [
    columnHelper.accessor("user", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "User / Email",
    }),

    columnHelper.accessor("property", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Property  / Assets Name",
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        let statusStyles = "";
        let dotColor = "";
        if (status === "approved") {
          statusStyles = "bg-[#CEDDB7] text-[#6D9F1B]";
          dotColor = "bg-[#6D9F1B]";
        } else if (status === "pending") {
          statusStyles = "bg-[#E3DAC1] text-[#C39830]";
          dotColor = "bg-[#C39830]";
        } else if (status === "suspended") {
          statusStyles = "bg-[#DBC8C0] text-[#9F471B]";
          dotColor = "bg-[#9F471B]";
        }
        return (
          <span className={`inline-flex items-center gap-2 px-2 py-[6px] text-sm leading-5 rounded-lg capitalize  ${statusStyles}`}>
            <span className={`w-2 h-2 rounded-full ${dotColor}`} />
            {status}
          </span>
        );
      },
    }),

    columnHelper.accessor("date", {
      cell: (info) => (
        <span>
          {new Date(info.getValue()).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </span>
      ),
      header: "Date / Time",
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <button
          onClick={() => {}}
          className="py-2 px-4 border border-primary-10 rounded text-primary-10 hover:bg-primary-10 hover:text-white"
        >
          View Details
        </button>
      ),
    }),
  ];

  const filteredData = useMemo(() => {
    if (activeTab === "allReport") return reportTableData;
    if (activeTab === "approvedReports") return reportTableData.filter((r) => r.status === "approved");
    if (activeTab === "pendingApproval") return reportTableData.filter((r) => r.status === "pending");
    return reportTableData;
  }, [activeTab]);

  const reportTable = useReactTable<any>({
    data: filteredData as any[],
    columns: reportColumns,
    state: { globalFilter: searchQuery },
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const renderPagination = (tableInstance: any) => {
    const hasData = tableInstance.getFilteredRowModel().rows.length > 0;
    return hasData ? (
      <Pagination
        currentPage={tableInstance.getState().pagination.pageIndex + 1}
        totalPages={Math.max(tableInstance.getPageCount(), 1)}
        onPageChange={(page: number) => tableInstance.setPageIndex(page - 1)}
        totalRecords={tableInstance.getFilteredRowModel().rows.length}
        pageSize={tableInstance.getState().pagination.pageSize}
        onPageSizeChange={(size: number) => {
          tableInstance.setPageSize(size);
          tableInstance.setPageIndex(0);
        }}
      />
    ) : null;
  };

  return (
    <section className="flex flex-col gap-6 pt-[100px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between w-full gap-4">
        <div>
          <h2 className="text-[28px] font-Raleway font-bold text-primary-10">
            Reports <span className="text-primary-20">Management</span>
          </h2>
          <p className="text-sm font-Raleway font-medium text-primary-10">Manage all reports and facility managers across the system</p>
        </div>
        {/* Button to open modal for adding new property */}
        <div className="flex items-center gap-4">
          <Link
            href="/task-lists"
            className="flex items-center justify-center gap-3 px-5 py-3 bg-primary-10 rounded-[100px] border border-transparent transition hover:bg-transparent hover:border-primary-10 group cursor-pointer"
          >
            <span className="text-white font-Raleway font-semibold text-base group-hover:text-primary-10">View Task List</span>
            <ArrowUpRight className="text-white group-hover:text-primary-10 w-5 h-5" />
          </Link>

          <Link
            href="/facility-manager"
            className="flex items-center justify-center gap-3 px-5 py-3 bg-primary-10 rounded-[100px] border border-transparent transition hover:bg-transparent hover:border-primary-10 group cursor-pointer"
          >
            <span className="text-white font-Raleway font-semibold text-base group-hover:text-primary-10">View Facility Managers</span>
            <ArrowUpRight className="text-white group-hover:text-primary-10 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* stats card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <StatsCard
          title="Total Facility Managers"
          count="18"
          textColor="#E8EBEB"
          FTextColor="#1d3638"
          bodyBg="#4E6E6E"
          footerBg="#E1E7E7"
          footerText="Starts from 06 Jan 2025"
        />
        <StatsCard
          title="Approved Reports"
          count="32"
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Starts from 06 Jan 2025"
        />
        <StatsCard
          title="Pending Approval Reports"
          count="15"
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Starts from 06 Jan 2025"
        />
        <StatsCard
          title="Rejected Reports"
          count="6"
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Starts from 06 Jan 2025"
        />
      </div>

      {/* tab buttons */}
      <div className="flex items-center justify-center gap-2 w-full bg-[#ECECEC] rounded-[100px]">
        <TabButton label="Facilities" isActive={activeTab === "allReport"} onClick={() => setActiveTab("allReport")} />
        <TabButton label="Approved Reports" isActive={activeTab === "approvedReports"} onClick={() => setActiveTab("approvedReports")} />
        <TabButton label="Pending Approval" isActive={activeTab === "pendingApproval"} onClick={() => setActiveTab("pendingApproval")} />
      </div>

      {/* table */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
          <TableHeader
            title={`All Inspection Reports (${reportTable.getFilteredRowModel().rows.length})`}
            searchQuery={searchQuery}
            handleInputChange={(e) => setSearchQuery(e.target.value)}
            handleClear={() => setSearchQuery("")}
            table={reportTable}
          />
          <TableHeadAndBody
            table={reportTable}
            emptyState={{
              image: emptyUser,
              alt: "Empty Reports",
              message: "No reports available for this tab!",
            }}
          />
          {renderPagination(reportTable)}
        </div>
      </div>
    </section>
  );
};

export default ReportManagementPage;
