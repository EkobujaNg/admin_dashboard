"use client";

import React, { useState } from "react";
import Pagination from "@/components/ui/Pagination";
import TableHeader from "@/components/ui/TableHeader";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import { emptyWallet } from "../../../../public/assets/images";
import CustomCheckbox from "@/components/ui/CustomCheckBox";
import { useDrawerModal } from "@/context/DrawerModalContext";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import EditTaskDrawerContent from "@/components/views/EditTaskDrawerContent";
import CreateTaskDrawer from "@/components/views/CreateTaskDrawer";
import { taskTableData } from "@/data";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const TaskLists = () => {
  const { openModal, closeModal } = useDrawerModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const columnHelper = createColumnHelper<any>();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Helper for selection
  const isAllSelected = selectedTaskIds.length > 0 && selectedTaskIds.length === taskTableData.length;
  const isIndeterminate = selectedTaskIds.length > 0 && selectedTaskIds.length < taskTableData.length;

  const handleDeleteSelected = () => {
    // Implement your delete logic here (e.g., API call)
    setShowConfirmModal(false);

    setSelectedTaskIds([]);
  };

  const selectAllTasks = () => setSelectedTaskIds(taskTableData.map((task) => task.id));
  const clearAllTasks = () => setSelectedTaskIds([]);
  const toggleTaskSelection = (id, checked) => {
    setSelectedTaskIds((prev) => (checked ? [...prev, id] : prev.filter((taskId) => taskId !== id)));
  };

  const taskColumns = [
    columnHelper.display({
      id: "select",
      header: () => (
        <CustomCheckbox
          checked={isAllSelected}
          onChange={() => {
            if (isAllSelected || isIndeterminate) {
              clearAllTasks();
            } else {
              selectAllTasks();
            }
          }}
        />
      ),
      cell: (info) => (
        <CustomCheckbox
          checked={selectedTaskIds.includes(info.row.original.id)}
          onChange={(checked) => toggleTaskSelection(info.row.original.id, checked)}
        />
      ),
    }),

    columnHelper.accessor("taskName", {
      cell: (info) => (
        <div>
          <div className="font-semibold">{info.getValue()}</div>
        </div>
      ),
      header: "Task Name",
    }),

    columnHelper.accessor("assignedTo", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Manager assigned to",
    }),

    columnHelper.accessor("assignedProperties", {
      cell: (info) => <span>{info.getValue().join(" || ")}</span>,
      header: "Assigned Properties",
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
      id: "edit",
      header: "Actions",
      cell: (info) => (
        <button
          className="border-1 border-opacityClr-100 rounded px-4 py-1.5 font-Raleway font-normal text-opacityClr-100 text-sm cursor-pointer"
          onClick={() => openModal("Edit Task", <EditTaskDrawerContent task={info.row.original} />)}
        >
          Edit
        </button>
      ),
    }),
  ];

  const taskTable = useReactTable<any>({
    data: taskTableData as any[],
    columns: taskColumns,
    state: { globalFilter: searchQuery },
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <section className="flex flex-col gap-6 pt-[100px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between w-full gap-4">
        <div>
          <h2 className="text-[28px] font-Raleway font-bold text-primary-10">
            Task <span className="text-primary-20">Lists</span>
          </h2>
          <p className="text-sm font-Raleway font-medium text-primary-10">
            Manage all the tasks assigned to facility managers in the system
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center justify-center gap-3 px-5 py-3 bg-primary-10 rounded-lg border border-transparent transition hover:bg-transparent hover:border-primary-10 group cursor-pointer"
            onClick={() => openModal("Create New Task", <CreateTaskDrawer closeModal={closeModal} />)}
          >
            <span className="text-white font-Raleway font-semibold text-base group-hover:text-primary-10">Create New Task</span>
          </button>

          {selectedTaskIds.length > 0 && (
            <button
              className="flex items-center justify-center gap-3 px-5 py-3 rounded-lg border bg-transparent transition hover:bg-transparent border-[#9F1B1B] group cursor-pointer"
              onClick={() => setShowConfirmModal(true)}
            >
              <span className="text-[#9F1B1B] font-Raleway font-semibold text-base group-hover:text-[#9F1B1B]">
                {selectedTaskIds.length > 1 ? "Bulk Delete" : "Delete Task"}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
        <TableHeader
          title={`Task (${taskTable.getFilteredRowModel().rows.length})`}
          searchQuery={searchQuery}
          handleInputChange={(e) => setSearchQuery(e.target.value)}
          handleClear={() => setSearchQuery("")}
          table={taskTable}
        />
        <TableHeadAndBody
          table={taskTable}
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
          currentPage={taskTable.getState().pagination.pageIndex + 1}
          totalPages={Math.max(taskTable.getPageCount(), 1)}
          onPageChange={(page: number) => taskTable.setPageIndex(page - 1)}
          totalRecords={taskTable.getFilteredRowModel().rows.length}
          pageSize={taskTable.getState().pagination.pageSize}
          onPageSizeChange={(size) => {
            taskTable.setPageSize(size);
            taskTable.setPageIndex(0);
          }}
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

export default TaskLists;
