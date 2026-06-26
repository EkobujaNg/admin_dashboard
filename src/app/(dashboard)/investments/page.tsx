"use client";

import React, { useState, useMemo, useCallback } from "react";
import StatsCard from "@/components/ui/StatsCard";
import TabButton from "@/components/ui/TabButton";
import Pagination from "@/components/ui/Pagination";
import TableHeader from "@/components/ui/TableHeader";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import { Info, EyeOff, Eye, ArrowUpRight } from "lucide-react";
import Tooltip from "@/components/ui/Tooltip";
import { emptyAssets } from "../../../../public/assets/images";
import useInvestmentAPI from "@/services/useInvestmentAPI";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const InvestmentPage = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("investments");
  const [searchQuery, setSearchQuery] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [reportsPage, setReportsPage] = useState(1);
  const pageSize = 10;

  // Fetch investment data
  const {
    // Summary
    summary,
    isLoadingSummary,
    summaryError,

    // Active Investments
    activeInvestments,
    activeMeta,
    isLoadingActiveInvestments,
    activeError,
    refetchActiveInvestments,

    // Earning Reports
    earningReports,
    reportsMeta,
    isLoadingReports,
    reportsError,
    refetchReports,
  } = useInvestmentAPI({
    enableSummary: true,
    enableActive: activeTab === "investments",
    enableReports: activeTab === "earnings",
    activePage,
    reportPage: reportsPage,
    activeSize: pageSize,
    reportSize: pageSize,
    activeSearch: activeTab === "investments" ? searchQuery : "",
    reportSearch: activeTab === "earnings" ? searchQuery : "",
  });

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
    setGlobalFilter("");
    if (tab === "investments") {
      setActivePage(1);
    } else {
      setReportsPage(1);
    }
  };

  // Handle page change for active investments
  const handleActivePageChange = (page) => {
    setActivePage(page);
  };

  // Handle page change for earning reports
  const handleReportsPageChange = (page) => {
    setReportsPage(page);
  };

  const columnHelper = createColumnHelper<any>();

  const investmentsColumns = [
    columnHelper.accessor("investmentId", {
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      header: "Investment ID",
    }),

    columnHelper.accessor("email", {
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-medium">{info.row.original.userName}</span>
          <span className="text-xs text-gray-500">{info.getValue()}</span>
        </div>
      ),
      header: "Investor",
    }),

    columnHelper.accessor("assetOwned", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Asset Owned",
    }),

    columnHelper.accessor("ownedPercentage", {
      cell: (info) => <span>{info.getValue()}%</span>,
      header: "Owned (%)",
    }),

    columnHelper.accessor("amount", {
      cell: (info) => <span className="font-medium">₦{info.getValue().toLocaleString()}</span>,
      header: "Amount",
    }),

    columnHelper.accessor("maturityDate", {
      cell: (info) => {
        const date = new Date(info.getValue());
        return (
          <div className="flex flex-col">
            <span>{date.toLocaleDateString("en-US", { day: "2-digit", month: "short" })}</span>
            <span className="text-xs text-gray-500">{date.getFullYear()}</span>
          </div>
        );
      },
      header: "Maturity Date",
    }),
  ];

  const earningsColumns = [
    columnHelper.accessor("serialNumber", {
      header: "S/N",
      cell: (info) => (
        <span className="text-gray-500">{String(info.row.index + 1 + (reportsMeta?.pageNumber - 1) * pageSize).padStart(2, "0")}</span>
      ),
      size: 20,
    }),

    columnHelper.accessor("email", {
      header: "Investor",
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-medium">{info.row.original.userName}</span>
          <span className="text-xs text-gray-500">{info.getValue()}</span>
        </div>
      ),
    }),

    columnHelper.accessor("investmentId", {
      header: "Investment ID",
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),

    columnHelper.accessor("propertyCode", {
      header: "Property",
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),

    columnHelper.accessor("roi", {
      header: "ROI",
      cell: (info) => <span className="px-2 py-1 text-sm font-medium rounded-full bg-green-50 text-green-700">{info.getValue()}%</span>,
    }),

    columnHelper.accessor("earnings", {
      header: "Earnings",
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-medium">₦{info.getValue().toLocaleString()}</span>
          <span className="text-xs text-gray-500">₦{info.row.original.distributedEarnings?.toLocaleString()} distributed</span>
        </div>
      ),
    }),
  ];

  const renderPagination = (table, meta, onPageChange) => {
    const hasData = table.getRowModel().rows.length > 0;
    if (!hasData) return null;

    return (
      <Pagination
        currentPage={meta?.pageNumber || 1}
        totalPages={meta?.totalPages || 1}
        totalRecords={meta?.totalRecords || 0}
        onPageChange={onPageChange}
      />
    );
  };

  const investmentsTable = useReactTable<any>({
    data: (activeInvestments || []) as any[],
    columns: investmentsColumns,
    state: { globalFilter: searchQuery },
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: activeMeta?.totalPages || 5,
  });

  const earningsTable = useReactTable<any>({
    data: (earningReports || []) as any[],
    columns: earningsColumns,
    state: { globalFilter: searchQuery },
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: reportsMeta?.totalPages || 0,
  });

  return (
    <section className="flex flex-col gap-4 md:gap-6 pt-4  px-2 sm:px-4">
      {/* header */}
      <div className="flex flex-col gap-1 items-start px-2 sm:px-0">
        <h2 className="text-primary-10 font-Raleway font-bold text-2xl sm:text-[28px]">
          Investment <span className="text-primary-20">Management</span>
        </h2>
        <p className="text-primary-10 font-Raleway text-xs sm:text-sm">Track and manage all investment activities</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
        <StatsCard
          title="Active Investments"
          count={isLoadingSummary ? "..." : summary?.activeInvestments ?? 0}
          textColor="#1d3638"
          bodyBg="#C2DF93"
          footerBg="#DAECBE"
          footerText="Total active investments"
        />
        <StatsCard
          title="Net Asset Value"
          count={isLoadingSummary ? "..." : `₦${(summary?.totalNetAssetValue ?? 0).toLocaleString()}`}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Total value of all assets"
        />
        <StatsCard
          title="Stocks on Market"
          count={isLoadingSummary ? "..." : summary?.totalStocksOnTradeMarket ?? 0}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Total stocks available for trade"
        />
      </div>

      {/* available balances */}
      <div className="flex flex-col md:flex-row items-stretch justify-between gap-3 sm:gap-4 w-full">
        {/* Available investment balance */}
        <div className="flex flex-col items-start justify-between gap-3 sm:gap-4 p-3 sm:px-4 sm:py-5 border border-opacityClr-30 rounded-2xl w-full">
          <div className="flex flex-col items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-primary-10 font-Raleway font-medium leading-normal">Available investment balance</p>
              <Tooltip text="This shows your available balance for investments.">
                <Info className="cursor-pointer text-gray-500 w-[18px] h-[18px]" />
              </Tooltip>
            </div>

            {/* Balance Display + Eye Toggle */}
            <div className="flex items-center justify-center gap-[14px]">
              <h2 className="font-Raleway font-bold text-xl sm:text-2xl md:text-[28px] text-[#1D3638] leading-[130%] break-all">
                {isVisible ? `₦${isLoadingSummary ? "..." : (summary?.availableInvestmentBalance ?? 0).toLocaleString()}` : "******"}
              </h2>

              {/* Eye Icon Toggle */}
              <button
                onClick={() => setIsVisible(!isVisible)}
                className="text-[#2B4242] transition-all duration-300"
                aria-label={isVisible ? "Hide balance" : "Show balance"}
              >
                {isVisible ? (
                  <EyeOff className="text-[#2B4242] cursor-pointer w-5 h-5" />
                ) : (
                  <Eye className="text-[#2B4242] cursor-pointer w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Go to Trade Market button */}
          <button
            type="button"
            className="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-lightGreen rounded-2xl w-full transition-all duration-300 ease-linear group hover:bg-opacity-90"
          >
            <ArrowUpRight className="text-primary-10 flex-shrink-0 w-[18px] h-[18px]" />
            <span className="font-Raleway font-semibold text-xs sm:text-sm text-primary-10 leading-normal whitespace-nowrap">
              Go to Trade Market
            </span>
          </button>
        </div>

        {/*  Total Net Asset Value & No. co-owned properties  */}
        <div className="flex flex-col gap-3 sm:gap-4 items-start justify-between w-full">
          {/* Total Net Asset Value */}
          <div className="flex flex-col items-start gap-2 sm:gap-3 p-3 sm:px-4 sm:py-5 border border-opacityClr-30 rounded-2xl w-full">
            <div className="flex items-center gap-2">
              <p className="text-sm text-primary-10 font-Raleway font-medium leading-normal">Total Net Asset Value</p>
              <Tooltip text="The total value of all assets under management">
                <Info className="cursor-pointer text-gray-500 w-[18px] h-[18px]" />
              </Tooltip>
            </div>
            <h2 className="font-Raleway font-bold text-[28px] text-[#1D3638] leading-[130%]">
              {isLoadingSummary ? "..." : `₦${(summary?.totalNetAssetValue ?? 0).toLocaleString()}`}
            </h2>
          </div>

          {/* No. co-owned properties */}
          <div className="flex flex-col items-start gap-2 sm:gap-3 p-3 sm:px-4 sm:py-5 border border-opacityClr-30 rounded-2xl w-full">
            <div className="flex items-center gap-2">
              <p className="text-sm text-primary-10 font-Raleway font-medium leading-normal">Co-owned Properties</p>
              <Tooltip text="Number of properties with multiple investors">
                <Info className="cursor-pointer text-gray-500 w-[18px] h-[18px]" />
              </Tooltip>
            </div>
            <h2 className="font-Raleway font-bold text-[28px] text-[#1D3638] leading-[130%]">
              {isLoadingSummary ? "..." : summary?.coOwnedProperties ?? 0}
            </h2>
          </div>
        </div>
      </div>

      {/* tab buttons */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 w-full bg-[#ECECEC] rounded-[100px] p-1">
        <TabButton label="Investments" isActive={activeTab === "investments"} onClick={() => handleTabChange("investments")} />
        <TabButton label="Earnings" isActive={activeTab === "earnings"} onClick={() => handleTabChange("earnings")} />
      </div>

      {/* table */}
      <div className="flex flex-col gap-3 sm:gap-4 w-full">
        {activeTab === "investments" && (
          <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white overflow-x-auto">
            <TableHeader
              title={`Active Investments (${activeMeta?.totalRecords || 0})`}
              searchQuery={searchQuery}
              handleInputChange={(e) => setSearchQuery(e.target.value)}
              handleClear={() => setSearchQuery("")}
            />
            <TableHeadAndBody
              table={investmentsTable}
              isLoading={isLoadingActiveInvestments}
              emptyState={{
                image: emptyAssets,
                alt: "No Investments",
                message: activeError ? "Failed to load investments. Please try again." : "No active investments found.",
              }}
            />
            {renderPagination(investmentsTable, activeMeta, handleActivePageChange)}
          </div>
        )}

        {activeTab === "earnings" && (
          <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white overflow-x-auto">
            <TableHeader
              title={`Earning Reports (${reportsMeta?.totalRecords || 0})`}
              searchQuery={searchQuery}
              handleInputChange={(e) => setSearchQuery(e.target.value)}
              handleClear={() => setSearchQuery("")}
            />
            <TableHeadAndBody
              table={earningsTable}
              isLoading={isLoadingReports}
              emptyState={{
                image: emptyAssets,
                alt: "No Reports",
                message: reportsError ? "Failed to load earning reports. Please try again." : "No earning reports found.",
              }}
            />
            {renderPagination(earningsTable, reportsMeta, handleReportsPageChange)}
          </div>
        )}
      </div>
    </section>
  );
};

export default InvestmentPage;
