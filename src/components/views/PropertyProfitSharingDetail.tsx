"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import TabButton from "@/components/ui/TabButton";
import TableHeader from "@/components/ui/TableHeader";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import Pagination from "@/components/ui/Pagination";
import Dropdown from "@/components/ui/Dropdown";
import { useDrawerModal } from "@/context/DrawerModalContext";
import LoadProfitShareDrawer from "@/components/views/LoadProfitShareDrawer";
import UpdateProfitSharingRateDrawer from "@/components/views/UpdateProfitSharingRateDrawer";
import useProfitSharingAPI from "@/services/useProfitSharingAPI";
import type { ProfitShareBreakdownEntry, ProfitShareRecord } from "@/lib/profit-sharing/types";

type PropertyProfitSharingDetailProps = {
  propertyId: string;
};

type DetailTab = "records" | "breakdown";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_START = 2025;

const YEAR_OPTIONS = Array.from(
  { length: Math.max(0, CURRENT_YEAR - YEAR_START) + 1 },
  (_, index) => {
    const year = String(CURRENT_YEAR - index);
    return { value: year, label: year };
  }
);

const SECTION_OPTIONS = [
  { value: "", label: "All sections" },
  ...[1, 2, 3, 4, 6, 12].map((section) => ({
    value: String(section),
    label: String(section),
  })),
];

const recordColumnHelper = createColumnHelper<ProfitShareRecord>();
const breakdownColumnHelper = createColumnHelper<ProfitShareBreakdownEntry>();

function formatMoney(amount?: number | null) {
  return `₦${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusStyles(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "distributed") return "bg-[#CEDDB7] text-[#6D9F1B]";
  if (normalized === "loaded") return "bg-[#C4D9E8] text-[#2E7DB2]";
  return "bg-[#E3DAC1] text-[#C39830]";
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-3 border-b border-gray-100 last:border-b-0">
      <p className="text-xs font-medium text-gray-500 font-Raleway">{label}</p>
      <div className="text-sm font-semibold text-primary-10 font-Raleway break-words">{value ?? "—"}</div>
    </div>
  );
}

const PropertyProfitSharingDetail = ({ propertyId }: PropertyProfitSharingDetailProps) => {
  const { openModal } = useDrawerModal();
  const [showDistributeConfirm, setShowDistributeConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>("records");
  const [tablePage, setTablePage] = useState(1);
  const [yearFilter, setYearFilter] = useState<number | undefined>(CURRENT_YEAR);
  const [sectionFilter, setSectionFilter] = useState<number | undefined>(undefined);
  const [pageSize, setPageSize] = useState(10);

  const {
    propertyStatus,
    isLoadingPropertyStatus,
    propertyStatusError,
    refetchPropertyStatus,
    distributeShare,
    isDistributing,
  } = useProfitSharingAPI({
    propertyId,
    enablePropertyStatus: true,
  });

  const {
    records,
    recordsMeta,
    isLoadingRecords,
    recordsError,
    breakdown,
    breakdownMeta,
    isLoadingBreakdown,
    breakdownError,
  } = useProfitSharingAPI({
    propertyId,
    page: tablePage,
    limit: pageSize,
    year: yearFilter,
    section: activeTab === "breakdown" ? sectionFilter : undefined,
    enableRecords: activeTab === "records",
    enableBreakdown: activeTab === "breakdown",
  });

  useEffect(() => {
    setTablePage(1);
  }, [activeTab, yearFilter, sectionFilter]);

  const status = propertyStatus;
  const canLoad = Boolean(status?.canLoadNextSection);
  const canChangeRate = Boolean(status?.canChangeRate);
  const pendingShare = status?.pendingLoadedShare ?? null;
  const canDistribute = Boolean(pendingShare && pendingShare.status === "loaded");

  const handleOpenLoadDrawer = () => {
    if (!canLoad || isDistributing) return;
    openModal(
      "Load amount",
      <LoadProfitShareDrawer
        propertyId={propertyId}
        propertyName={status?.propertyName}
        nextSectionToLoad={status?.nextSectionToLoad}
        onSuccess={() => refetchPropertyStatus()}
      />
    );
  };

  const handleOpenUpdateRateDrawer = () => {
    if (!canChangeRate || isDistributing) return;
    openModal(
      "Update rate",
      <UpdateProfitSharingRateDrawer
        propertyId={propertyId}
        propertyName={status?.propertyName}
        currentRate={status?.profitSharingRate}
        onSuccess={() => refetchPropertyStatus()}
      />
    );
  };

  const handleDistribute = () => {
    if (!canDistribute || isDistributing) return;
    distributeShare(propertyId, {
      onSuccess: () => {
        setShowDistributeConfirm(false);
        refetchPropertyStatus();
      },
      onError: () => setShowDistributeConfirm(false),
    });
  };

  const recordColumns = useMemo(
    () => [
      recordColumnHelper.accessor("section", {
        header: "Section",
        cell: (info) => <span className="text-gray-600">{info.getValue() ?? "—"}</span>,
      }),
      recordColumnHelper.accessor("year", {
        header: "Year",
        cell: (info) => <span className="text-gray-600">{info.getValue() ?? "—"}</span>,
      }),
      recordColumnHelper.accessor("rate", {
        header: "Rate",
        cell: (info) => (
          <span className="text-primary-10">
            {info.getValue() != null ? `${info.getValue()}×` : "—"}
          </span>
        ),
      }),
      recordColumnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => <span className="font-semibold text-primary-10">{formatMoney(info.getValue())}</span>,
      }),
      recordColumnHelper.accessor("amountDistributedToHolders", {
        header: "To holders",
        cell: (info) => <span className="text-gray-600">{formatMoney(info.getValue())}</span>,
      }),
      recordColumnHelper.accessor("amountToPlatformProfit", {
        header: "To profit balance",
        cell: (info) => <span className="text-gray-600">{formatMoney(info.getValue())}</span>,
      }),
      recordColumnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const value = String(info.getValue() || "—");
          return (
            <span
              className={`inline-flex items-center gap-2 px-2 py-[6px] text-sm leading-5 rounded-lg capitalize ${statusStyles(value)}`}
            >
              {value}
            </span>
          );
        },
      }),
      recordColumnHelper.accessor("loadedAt", {
        header: "Loaded at",
        cell: (info) => <span className="text-gray-600">{formatDate(info.getValue())}</span>,
      }),
      recordColumnHelper.accessor("distributedAt", {
        header: "Distributed at",
        cell: (info) => <span className="text-gray-600">{formatDate(info.getValue())}</span>,
      }),
    ],
    []
  );

  const breakdownColumns = useMemo(
    () => [
      breakdownColumnHelper.display({
        id: "holder",
        header: "Holder",
        cell: (info) => (
          <div className="flex flex-col gap-1">
            <span className="font-medium text-primary-10">{info.row.original.holderName || "—"}</span>
            {info.row.original.holderEmail ? (
              <span className="text-xs text-gray-500">{info.row.original.holderEmail}</span>
            ) : null}
            {info.row.original.isUnownedRemainder || info.row.original.isPlatformAccount ? (
              <span className="inline-flex w-fit items-center px-2 py-0.5 text-xs rounded-md bg-[#E3DAC1] text-[#C39830]">
                {info.row.original.isUnownedRemainder ? "Unowned remainder" : "Platform"}
              </span>
            ) : null}
          </div>
        ),
      }),
      breakdownColumnHelper.accessor("section", {
        header: "Section",
        cell: (info) => <span className="text-gray-600">{info.getValue() ?? "—"}</span>,
      }),
      breakdownColumnHelper.accessor("year", {
        header: "Year",
        cell: (info) => <span className="text-gray-600">{info.getValue() ?? "—"}</span>,
      }),
      breakdownColumnHelper.accessor("units", {
        header: "Units",
        cell: (info) => <span className="text-gray-600">{info.getValue() ?? "—"}</span>,
      }),
      breakdownColumnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => <span className="font-semibold text-primary-10">{formatMoney(info.getValue())}</span>,
      }),
      breakdownColumnHelper.accessor("distributedAt", {
        header: "Distributed at",
        cell: (info) => <span className="text-gray-600">{formatDate(info.getValue())}</span>,
      }),
    ],
    []
  );

  const recordsTable = useReactTable({
    data: records,
    columns: recordColumns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: recordsMeta.totalPages,
  });

  const breakdownTable = useReactTable({
    data: breakdown,
    columns: breakdownColumns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: breakdownMeta.totalPages,
  });

  if (isLoadingPropertyStatus) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 rounded-2xl border border-opacityClr-30 bg-white">
        <Loader2 className="w-5 h-5 animate-spin text-primary-10" />
        <p className="text-sm text-primary-10 font-Raleway">Loading property status...</p>
      </div>
    );
  }

  if (propertyStatusError || !status) {
    return (
      <div className="flex flex-col gap-3 py-10 px-6 rounded-2xl border border-opacityClr-30 bg-white">
        <p className="text-sm text-red-600 font-Raleway">Failed to load profit sharing status.</p>
        <button
          type="button"
          onClick={() => refetchPropertyStatus()}
          className="self-start px-4 py-2 rounded-md bg-neutral-lightGreen text-primary-10 font-semibold text-sm cursor-pointer"
        >
          Try again
        </button>
      </div>
    );
  }

  const isRecordsTab = activeTab === "records";
  const activeTable = isRecordsTab ? recordsTable : breakdownTable;
  const activeMeta = isRecordsTab ? recordsMeta : breakdownMeta;
  const isLoadingTable = isRecordsTab ? isLoadingRecords : isLoadingBreakdown;
  const tableError = isRecordsTab ? recordsError : breakdownError;
  const hasTableData = isRecordsTab ? records.length > 0 : breakdown.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        {canDistribute ? (
          <button
            type="button"
            disabled={isDistributing}
            onClick={() => setShowDistributeConfirm(true)}
            className="px-6 py-3 rounded-md bg-primary-10 text-white font-semibold text-sm cursor-pointer disabled:opacity-40"
          >
            {isDistributing ? "Distributing..." : "Distribute"}
          </button>
        ) : null}

        <button
          type="button"
          disabled={!canLoad || isDistributing}
          onClick={handleOpenLoadDrawer}
          className={`px-6 py-3 rounded-md font-semibold text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            canDistribute
              ? "border border-primary-10 text-primary-10 bg-white"
              : "bg-primary-10 text-white"
          }`}
        >
          {canLoad ? "Load amount" : "Cannot load next section"}
        </button>

        {canChangeRate ? (
          <button
            type="button"
            disabled={isDistributing}
            onClick={handleOpenUpdateRateDrawer}
            className="px-6 py-3 rounded-md border border-primary-10 text-primary-10 bg-white font-semibold text-sm cursor-pointer disabled:opacity-40"
          >
            Update rate
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-opacityClr-30 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary-10/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary-10 font-Raleway">{status.propertyName}</h3>
              <p className="text-sm text-opacityClr-60 font-Raleway">Property status</p>
            </div>
          </div>

          <DetailRow label="Year" value={status.year} />
          <DetailRow label="Profit sharing rate" value={`${status.profitSharingRate}× / year`} />
          <DetailRow label="Current section" value={status.currentSection} />
          <DetailRow label="Next section to load" value={status.nextSectionToLoad ?? "—"} />
          <DetailRow label="Can load next section" value={status.canLoadNextSection ? "Yes" : "No"} />
          <DetailRow label="Can change rate" value={status.canChangeRate ? "Yes" : "No"} />
        </div>

        <div className="rounded-2xl border border-opacityClr-30 bg-white p-6">
          <h3 className="text-lg font-bold text-primary-10 font-Raleway mb-4">Pending loaded share</h3>
          {pendingShare ? (
            <>
              <DetailRow label="Amount" value={formatMoney(pendingShare.amount)} />
              <DetailRow label="Section" value={pendingShare.section ?? "—"} />
              <DetailRow label="Year" value={pendingShare.year ?? "—"} />
              <DetailRow label="Rate" value={pendingShare.rate != null ? `${pendingShare.rate}×` : "—"} />
              <DetailRow
                label="Status"
                value={<span className="capitalize">{pendingShare.status || "—"}</span>}
              />
              <DetailRow label="Loaded at" value={formatDate(pendingShare.loadedAt)} />
            </>
          ) : (
            <p className="text-sm text-opacityClr-80 font-Raleway py-4">No pending loaded share.</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 w-full bg-[#ECECEC] rounded-[100px]">
        <TabButton
          label="Records"
          isActive={isRecordsTab}
          onClick={() => setActiveTab("records")}
        />
        <TabButton
          label="Breakdown"
          isActive={!isRecordsTab}
          onClick={() => setActiveTab("breakdown")}
        />
      </div>

      <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
        <TableHeader
          title={
            isRecordsTab
              ? `Records (${activeMeta.totalRecords})`
              : `Breakdown (${activeMeta.totalRecords})`
          }
          isLoading={isLoadingTable}
          table={activeTable}
          showSearch={false}
          showFilter={false}
          headerActions={
            <>
              <Dropdown
                label="Year"
                options={YEAR_OPTIONS}
                value={yearFilter != null ? String(yearFilter) : String(CURRENT_YEAR)}
                onSelect={(value) => setYearFilter(value ? Number(value) : CURRENT_YEAR)}
              />
              {!isRecordsTab ? (
                <Dropdown
                  label="Section"
                  options={SECTION_OPTIONS}
                  value={sectionFilter != null ? String(sectionFilter) : ""}
                  onSelect={(value) => setSectionFilter(value ? Number(value) : undefined)}
                />
              ) : null}
            </>
          }
        />
        <TableHeadAndBody
          table={activeTable}
          isLoading={isLoadingTable}
          emptyState={{
            message: tableError
              ? `Failed to load ${isRecordsTab ? "records" : "breakdown"}. Please try again.`
              : isRecordsTab
                ? "No profit share records found"
                : "No holder breakdown found",
          }}
        />
        {hasTableData && (
          <Pagination
            currentPage={activeMeta.pageNumber}
            totalPages={activeMeta.totalPages}
            onPageChange={setTablePage}
            totalRecords={activeMeta.totalRecords}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setTablePage(1);
            }}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={showDistributeConfirm}
        onClose={() => !isDistributing && setShowDistributeConfirm(false)}
        onConfirm={handleDistribute}
        message={`Distribute ${formatMoney(pendingShare?.amount)} to holders for section ${
          pendingShare?.section ?? "—"
        }? Unowned remainder goes to profit balance.`}
        confirmMsg={isDistributing ? "Distributing..." : "Distribute"}
        cancelMsg="Cancel"
        confirmButtonColor="green"
        confirmDisabled={isDistributing}
      />
    </div>
  );
};

export default PropertyProfitSharingDetail;
