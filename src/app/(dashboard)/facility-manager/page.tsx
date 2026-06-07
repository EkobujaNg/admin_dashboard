"use client";

import React, { useState } from "react";
import Pagination from "@/components/ui/Pagination";
import TableHeader from "@/components/ui/TableHeader";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import { emptyWallet } from "../../../../public/assets/images";
import CustomCheckbox from "@/components/ui/CustomCheckBox";
import { useDrawerModal } from "@/context/DrawerModalContext";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import EditFacilityManagerDrawer from "@/components/views/EditFacilityManagerDrawer";
import CreateFacilityManagerDrawer from "@/components/views/CreateFacilityManagerDrawer";
import { facilityManagerTableData } from "@/data";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const FacilityManager = () => {
  const { openModal, closeModal } = useDrawerModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedManagerIds, setSelectedManagerIds] = useState([]);
  const columnHelper = createColumnHelper<any>();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Helper for selection
  const isAllSelected = selectedManagerIds.length > 0 && selectedManagerIds.length === facilityManagerTableData.length;
  const isIndeterminate = selectedManagerIds.length > 0 && selectedManagerIds.length < facilityManagerTableData.length;

  const handleDeleteSelected = () => {
    // Implement your delete logic here (e.g., API call)
    setShowConfirmModal(false);

    setSelectedManagerIds([]);
  };

  const selectAllManagers = () => setSelectedManagerIds(facilityManagerTableData.map((manager) => manager.id));
  const clearAllManager = () => setSelectedManagerIds([]);
  const toggleManagerSelection = (id, checked) => {
    setSelectedManagerIds((prev) => (checked ? [...prev, id] : prev.filter((managerId) => managerId !== id)));
  };

  const managerColumns = [
    columnHelper.display({
      id: "select",
      header: () => (
        <CustomCheckbox
          checked={isAllSelected}
          onChange={() => {
            if (isAllSelected || isIndeterminate) {
              clearAllManager();
            } else {
              selectAllManagers();
            }
          }}
        />
      ),
      cell: (info) => (
        <CustomCheckbox
          checked={selectedManagerIds.includes(info.row.original.id)}
          onChange={(checked) => toggleManagerSelection(info.row.original.id, checked)}
        />
      ),
    }),

    columnHelper.accessor("name", {
      cell: (info) => (
        <div>
          <div className="font-semibold">{info.getValue()}</div>
        </div>
      ),
      header: "Name",
    }),

    columnHelper.accessor("email", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Email",
    }),

    columnHelper.accessor("phoneNumber", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Phone Number",
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        let statusStyles = "";
        if (status === "active") {
          statusStyles = "bg-[#CEDDB7] text-[#6D9F1B]";
        } else if (status === "inactive") {
          statusStyles = "bg-[#DBC8C0] text-[#9F471B]";
        }
        return (
          <span className={`inline-flex items-center gap-2 px-2 py-[6px] text-sm leading-5 rounded-lg capitalize  ${statusStyles}`}>
            {status}
          </span>
        );
      },
    }),

    columnHelper.display({
      id: "edit",
      header: "Actions",
      cell: (info) => (
        <button
          className="border-1 border-opacityClr-100 rounded px-4 py-1.5 font-Raleway font-normal text-opacityClr-100 text-sm cursor-pointer"
          onClick={() => openModal("Edit Manager", <EditFacilityManagerDrawer manager={info.row.original} />)}
        >
          Edit
        </button>
      ),
    }),
  ];

  const managerTable = useReactTable<any>({
    data: facilityManagerTableData as any[],
    columns: managerColumns,
    state: { globalFilter: searchQuery },
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between w-full gap-4">
        <div>
          <h2 className="text-[28px] font-Raleway font-bold text-primary-10">
            Facility <span className="text-primary-20">Manager</span>
          </h2>
          <p className="text-sm font-Raleway font-medium text-primary-10">
            Manage all facility managers and their reports across the system
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center justify-center gap-3 px-5 py-3 bg-primary-10 rounded-lg border border-transparent transition hover:bg-transparent hover:border-primary-10 group cursor-pointer"
            onClick={() => openModal("Create Manager Access", <CreateFacilityManagerDrawer closeModal={closeModal} />)}
          >
            <span className="text-white font-Raleway font-semibold text-base group-hover:text-primary-10">Create New Manager</span>
          </button>

          {selectedManagerIds.length > 0 && (
            <button
              className="flex items-center justify-center gap-3 px-5 py-3 rounded-lg border bg-transparent transition hover:bg-transparent border-[#9F1B1B] group cursor-pointer"
              onClick={() => setShowConfirmModal(true)}
            >
              <span className="text-[#9F1B1B] font-Raleway font-semibold text-base group-hover:text-[#9F1B1B]">
                {selectedManagerIds.length > 1 ? "Bulk Delete" : "Deactivate Manager"}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
        <TableHeader
          title={`Users (${managerTable.getRowModel().rows.length})`}
          searchQuery={searchQuery}
          handleInputChange={(e) => setSearchQuery(e.target.value)}
          handleClear={() => setSearchQuery("")}
        />
        <TableHeadAndBody
          table={managerTable}
          emptyState={{
            image: emptyWallet,
            alt: "Empty User Data",
            message: "You've not made any transactions yet",
            action: {
              label: "Fund Wallet",
              onClick: () => {},
            },
          }}
        />
        <Pagination
          currentPage={managerTable.getState().pagination.pageIndex + 1}
          totalPages={managerTable.getPageCount()}
          onPageChange={(page: number) => managerTable.setPageIndex(page - 1)}
          totalRecords={managerTable.getRowCount()}
        />
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDeleteSelected}
        message="Are you sure you want to delete task record?"
        confirmMsg="Yes, Delete"
        cancelMsg="No, Cancel"
      />
    </section>
  );
};

export default FacilityManager;
