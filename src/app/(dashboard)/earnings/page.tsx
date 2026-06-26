"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Pagination from "@/components/ui/Pagination";
import TableHeader from "@/components/ui/TableHeader";
import { emptyWallet } from "../../../../public/assets/images";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import ProfitSharing from "@/components/views/ProfitSharing";
import TabButton from "@/components/ui/TabButton";
import { ArrowUpRight, Ellipsis, CheckCheck } from "lucide-react";
import { transactionTableData, statCardConfig } from "@/data";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const InvestmentRevenueChart = dynamic(() => import("@/components/views/InvestmentRevenueChart"), {
  ssr: false,
  loading: () => <div className="spinner"></div>,
});

const EarningsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const columnHelper = createColumnHelper<any>();

  const transactionsColumns = [
    columnHelper.accessor("transactionID", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Transaction ID",
    }),

    columnHelper.accessor("user", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Email / User",
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
      header: "Date & Time",
    }),

    columnHelper.accessor("paymentMethod", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Payment Method",
    }),

    columnHelper.accessor("amount", {
      cell: (info) => <span>₦ {info.getValue().toLocaleString()}</span>,
      header: "Amount (₦)",
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        let statusStyles = "";
        let dotColor = "";
        if (status === "success") {
          statusStyles = "bg-[#CEDDB7] text-[#6D9F1B]";
          dotColor = "bg-[#6D9F1B]";
        } else if (status === "pending") {
          statusStyles = "bg-[#E3DAC1] text-[#C39830]";
          dotColor = "bg-[#C39830]";
        } else if (status === "failed") {
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
  ];

  const transactionTable = useReactTable<any>({
    data: transactionTableData as any[],
    columns: transactionsColumns,
    state: { globalFilter: searchQuery },
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <section className="flex flex-col gap-6  pb-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between w-full gap-4">
        <div>
          <h2 className="text-[28px] font-Raleway font-bold text-primary-10">
            Wallet <span className="text-primary-20">& Total Earnings</span>
          </h2>
          <p className="text-sm font-Raleway font-medium text-primary-10">Manage all earnings, revenue and cost of maintenance here.</p>
        </div>
        {/* <button
          onClick={() => openModal("Create Property Listing", <AddPropertyCardDrawer />)}
          className="flex items-center justify-center gap-3 w-[251px] h-14 bg-primary-10 rounded-[100px] border border-transparent transition hover:bg-transparent hover:border-primary-10 group"
        >
          <span className="text-white font-Raleway font-semibold text-base group-hover:text-primary-10">Add Property</span>
          <MdArrowOutward className="text-white group-hover:text-primary-10 w-5 h-5" />
        </button> */}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 w-full bg-[#ECECEC] rounded-[100px]">
        <TabButton label="Overview" isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
        <TabButton label="Profit Sharing" isActive={activeTab === "profitSharing"} onClick={() => setActiveTab("profitSharing")} />
      </div>

      {/* Tab Content */}
      {activeTab === "profitSharing" ? (
        <ProfitSharing />
      ) : (
        <>
          {/* Earnings stats */}
          <div className="flex items-center gap-6 snap-x snap-mandatory scroll-smooth overflow-x-auto w-full pb-2">
            {statCardConfig.map((card, index) => (
              <div key={index} className={`flex flex-col items-start gap-8 p-6 w-full rounded-2xl ${card.cardBgColor}`}>
                <div className="flex items-center justify-between w-full gap-6 text-white">
                  <p className={`font-Raleway text-base font-semibold leading-[125%] ${card.textColor}`}>{card.title}</p>
                  <span className={`flex items-center justify-center gap-2.5 w-5 h-5 ${card.dotBg} rounded-full`}>
                    <Ellipsis className={`w-5 h-5 ${card.textColor}`} />
                  </span>
                </div>

                <div className="flex flex-col items-start w-full gap-2">
                  <h2 className={`font-Raleway text-3xl font-bold leading-8 tracking-[-0.54px] ${card.textColor}`}>{card.amount}</h2>
                  <div className="flex items-center justify-between w-full gap-6">
                    <p className={`font-Raleway text-sm font-normal leading-[125%] ${card.textColor}`}>{card.fromLastWeek}</p>
                    <div className="flex items-center gap-2">
                      <span className={`flex w-4 h-4 ${card.dotBgColor} rounded-full`}>
                        <ArrowUpRight
                          className={`w-4 h-4 ${card.arrowColor} ${card.arrowDirection === "down" ? "rotate-225" : "rotate-45"}`}
                        />
                      </span>
                      <span className={`font-Raleway text-sm font-normal leading-8 tracking-[-0.252px] ${card.textColor}`}>
                        {card.percentage}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-4 h-full w-full">
            {/* InvestmentRevenue Chart */}
            <InvestmentRevenueChart />

            <div
              className="flex h-[300px] w-[30%] py-6 px-8 flex-col justify-between items-start rounded-2xl custom-gradient bg-no-repeat bg-contain bg-center bg-opacityClr-100 object-contain"
              style={{ backgroundImage: "url(/assets/images/map.svg)" }}
            >
              <div className="flex items-center justify-between w-full gap-6">
                <CheckCheck className="text-opacityClr-10 w-5 h-5" />
              </div>
              <p className="text-white font-Raleway text-sm font-semibold leading-[140%]">Current Balance</p>
              <h3 className="text-white font-Raleway text-3xl font-bold leading-normal tracking-[-0.648px]">₦0.00</h3>
              <div className="flex items-center justify-between w-full">
                <p className="text-white font-Raleway text-sm font-semibold leading-[140%]">MONIFY/EKOBUJA</p>
                <p className="text-white font-Raleway text-sm font-semibold leading-[140%]">6689904456</p>
              </div>
            </div>
          </div>

          {/* table */}
          <div className="">
            <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
              <TableHeader
                title={`Transactions History (${transactionTable.getRowModel().rows.length})`}
                searchQuery={searchQuery}
                handleInputChange={(e) => setSearchQuery(e.target.value)}
                handleClear={() => setSearchQuery("")}
              />
              <TableHeadAndBody
                table={transactionTable}
                emptyState={{
                  image: emptyWallet,
                  alt: "Empty User Data",
                  message: "You’ve not made any transactions yet",
                  action: {
                    label: "Fund Wallet",
                    onClick: () => {},
                  },
                }}
              />
              <Pagination
                currentPage={transactionTable.getState().pagination.pageIndex + 1}
                totalPages={transactionTable.getPageCount()}
                onPageChange={(page: number) => transactionTable.setPageIndex(page - 1)}
                totalRecords={transactionTable.getRowCount()}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default EarningsPage;
