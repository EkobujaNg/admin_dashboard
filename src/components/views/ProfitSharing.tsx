"use client";

import React, { useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import Pagination from "@/components/ui/Pagination";
import TabButton from "@/components/ui/TabButton";
import Dropdown from "@/components/ui/Dropdown";
import { ArrowUpRight, Ellipsis, Calendar } from "lucide-react";
import { profitSharingStats, upcomingDistributionsData, pastDistributionsData } from "@/data";

const ProfitSharing = () => {
  const [distributionTab, setDistributionTab] = useState("upcoming");
  const columnHelper = createColumnHelper<any>();

  // Upcoming Distributions Columns
  const upcomingColumns = [
    columnHelper.accessor("property", {
      cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
      header: "Property",
    }),
    columnHelper.accessor("quarter", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Quarter",
    }),
    columnHelper.accessor("grossProfit", {
      cell: (info) => <span>₦{info.getValue().toLocaleString()}</span>,
      header: "Gross Profit",
    }),
    columnHelper.accessor("expense", {
      cell: (info) => <span>₦{info.getValue().toLocaleString()}</span>,
      header: "Expense",
    }),
    columnHelper.accessor("amountToDistribute", {
      cell: (info) => <span>₦{info.getValue().toLocaleString()}</span>,
      header: "Amount to Distribute",
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        const statusType = info.row.original.statusType;

        let statusStyles = "";
        let dotColor = "";
        let statusText = status;
        let icon = null;

        if (statusType === "ready") {
          statusStyles = "bg-[#CEDDB7] text-[#6D9F1B]";
          dotColor = "bg-[#6D9F1B]";
        } else if (statusType === "scheduled") {
          statusStyles = "bg-[#C4D9E8] text-[#2E7DB2]";
          dotColor = "bg-[#2E7DB2]";
          icon = <Calendar className="w-3 h-3" />;
        } else if (statusType === "pending") {
          statusStyles = "bg-[#E3DAC1] text-[#C39830]";
          dotColor = "bg-[#C39830]";
        }

        return (
          <span className={`inline-flex items-center gap-2 px-2 py-[6px] text-sm leading-5 rounded-lg ${statusStyles}`}>
            <span className={`w-2 h-2 rounded-full ${dotColor}`} />
            {icon}
            <span>{statusText}</span>
          </span>
        );
      },
    }),
    columnHelper.accessor("action", {
      header: "Action",
      cell: () => (
        <button className="px-4 py-2 bg-primary-10 text-white font-Raleway font-semibold text-sm rounded-lg hover:bg-primary-10/90 transition-colors">
          Run Distribution
        </button>
      ),
    }),
  ];

  // Past Distributions Columns
  const pastColumns = [
    columnHelper.accessor("property", {
      cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
      header: "Property",
    }),
    columnHelper.accessor("date", {
      cell: (info) => (
        <span>
          {new Date(info.getValue()).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      ),
      header: "Date",
    }),
    columnHelper.accessor("amountDistributed", {
      cell: (info) => <span>₦{info.getValue().toLocaleString()}</span>,
      header: "Amount Distributed",
    }),
    columnHelper.accessor("investors", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Investors",
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: () => {
        return (
          <span className="inline-flex items-center gap-2 px-2 py-[6px] text-sm leading-5 rounded-lg bg-[#CEDDB7] text-[#6D9F1B]">
            <span className="w-2 h-2 rounded-full bg-[#6D9F1B]" />
            <span>Distributed</span>
          </span>
        );
      },
    }),
    columnHelper.accessor("action", {
      header: "Action",
      cell: () => (
        <button className="px-4 py-2 text-primary-10 font-Raleway font-semibold text-sm rounded-lg border border-primary-10 hover:bg-primary-10 hover:text-white transition-colors">
          View Details
        </button>
      ),
    }),
  ];

  const upcomingTable = useReactTable<any>({
    data: upcomingDistributionsData as any[],
    columns: upcomingColumns,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pastTable = useReactTable<any>({
    data: pastDistributionsData as any[],
    columns: pastColumns,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Profit Sharing Stats Cards */}
      <div className="flex items-center gap-6 snap-x snap-mandatory scroll-smooth overflow-x-auto w-full pb-2">
        {profitSharingStats.map((card, index) => (
          <div key={index} className={`flex flex-col items-start gap-8 p-6 w-full rounded-2xl ${card.cardBgColor} min-w-[280px]`}>
            <div className="flex items-center justify-between w-full gap-6">
              <p className={`font-Raleway text-base font-semibold leading-[125%] ${card.textColor}`}>{card.title}</p>
              <span className={`flex items-center justify-center gap-2.5 w-5 h-5 ${card.dotBg} rounded-full`}>
                <Ellipsis className={`w-5 h-5 ${card.textColor}`} />
              </span>
            </div>

            <div className="flex flex-col items-start w-full gap-2">
              <h2 className={`font-Raleway text-3xl font-bold leading-8 tracking-[-0.54px] ${card.textColor}`}>{card.amount}</h2>
              <div className="flex items-center justify-between w-full gap-6">
                <p className={`font-Raleway text-sm font-normal leading-[125%] ${card.textColor}`}>{card.description}</p>
                <div className="flex items-center gap-2">
                  <ArrowUpRight
                    className={`w-4 h-4 ${card.arrowColor} ${card.arrowDirection === "down" ? "rotate-225" : "rotate-45"}`}
                  />
                  <span className={`font-Raleway text-sm font-normal leading-8 tracking-[-0.252px] ${card.textColor}`}>
                    {card.percentage}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Distribution Tabs, Dropdown, and Button - All Aligned */}
      <div className="flex items-center justify-between w-full gap-4">
        <div className="flex items-center justify-center gap-2 bg-[#ECECEC] rounded-[100px]">
          <TabButton
            label="Upcoming Distributions"
            isActive={distributionTab === "upcoming"}
            onClick={() => setDistributionTab("upcoming")}
          />
          <TabButton label="Past Distributions" isActive={distributionTab === "past"} onClick={() => setDistributionTab("past")} />
        </div>
        <div className="flex items-center gap-4">
          <Dropdown
            label="All Status"
            options={["All Status", "Ready", "Scheduled", "Pending", "Distributed"]}
            onSelect={() => {}}
          />
          <button className="px-6 py-3 bg-primary-10 text-white font-Raleway font-semibold text-base rounded-[100px] hover:bg-primary-10/90 transition-colors whitespace-nowrap">
            Run Profit Distribution
          </button>
        </div>
      </div>

      {/* Distribution Tables */}
      <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
        {distributionTab === "upcoming" ? (
          <>
            <div className="w-full px-6 py-4 border-b border-opacityClr-30">
              <h3 className="text-primary-10 font-Raleway font-bold text-lg">Upcoming Distributions</h3>
            </div>
            <TableHeadAndBody
              table={upcomingTable}
              emptyState={{
                message: "No upcoming distributions found",
              }}
            />
            <Pagination
              currentPage={upcomingTable.getState().pagination.pageIndex + 1}
              totalPages={upcomingTable.getPageCount()}
              onPageChange={(page: number) => upcomingTable.setPageIndex(page - 1)}
              totalRecords={upcomingTable.getRowCount()}
            />
          </>
        ) : (
          <>
            <div className="w-full px-6 py-4 border-b border-opacityClr-30">
              <h3 className="text-primary-10 font-Raleway font-bold text-lg">Past Distributions</h3>
            </div>
            <TableHeadAndBody
              table={pastTable}
              emptyState={{
                message: "No past distributions found",
              }}
            />
            <Pagination
              currentPage={pastTable.getState().pagination.pageIndex + 1}
              totalPages={pastTable.getPageCount()}
              onPageChange={(page: number) => pastTable.setPageIndex(page - 1)}
              totalRecords={pastTable.getRowCount()}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProfitSharing;
