"use client";

import React, { useState, useMemo } from "react";
import Pagination from "@/components/ui/Pagination";
import TableHeader from "@/components/ui/TableHeader";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import { emptyWallet } from "../../../../../public/assets/images";
import CustomCheckbox from "@/components/ui/CustomCheckBox";
import { useDrawerModal } from "@/context/DrawerModalContext";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import EditTaskDrawerContent from "@/components/views/EditTaskDrawerContent";
import CreateTaskDrawer from "@/components/views/CreateTaskDrawer";
import { useParams, useRouter, usePathname } from "next/navigation";
import { facilities } from "@/data/facilities";
import { location } from "../../../../../public/assets/icons";
import TabButton from "@/components/ui/TabButton";
import Breadcrumb from "@/components/ui/Breadcrumb";

import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const FacilityDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { openModal, closeModal } = useDrawerModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const columnHelper = createColumnHelper<any>();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const facility = facilities.find((f) => String(f.id) === String(id));

  if (!facility) {
    return <div className="pt-[100px] p-6 text-xl font-bold">Facility not found</div>;
  }

  // Filter tasks by tab
  let filteredTasks = facility.tasks || [];

  const filteredData = useMemo(() => {
    if (activeTab === "approved") return filteredTasks.filter((t) => t.status === "approved");
    if (activeTab === "pending") return filteredTasks.filter((t) => t.status === "pending");
    if (activeTab === "rejected") return filteredTasks.filter((t) => t.status === "rejected");
    return filteredTasks; // for 'all' and any other case
  }, [activeTab, filteredTasks]);

  // Helper for selection
  const isAllSelected = selectedTaskIds.length > 0 && selectedTaskIds.length === filteredTasks.length;
  const isIndeterminate = selectedTaskIds.length > 0 && selectedTaskIds.length < filteredTasks.length;

  const handleDeleteSelected = () => {
    // Implement your delete logic here (e.g., API call)
    setShowConfirmModal(false);
    setSelectedTaskIds([]);
  };

  const selectAllTasks = () => setSelectedTaskIds(filteredTasks.map((task) => task.id));
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
        } else if (status === "rejected") {
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
    data: filteredData as any[],
    columns: taskColumns,
    state: { globalFilter: searchQuery },
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <section className="flex flex-col gap-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Facility Admin", href: "/facility-admin" },
          { label: facility?.name || "Facility Details" },
        ]}
      />
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between w-full gap-4">
        <div className="flex items-center gap-4">
          <img src={facility.image.src} alt={facility.name} className="w-16 h-16 rounded-xl object-cover" />
          <div>
            <h2 className="text-[28px] font-Raleway font-bold text-primary-10">{facility.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <img src={location.src} alt="location" className="w-4 h-4" />
              <span className="text-sm font-Raleway font-medium text-primary-10">{facility.location}</span>
            </div>
          </div>
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

      {/* tab buttons */}
      <div className="flex items-center justify-center gap-2 w-full bg-[#ECECEC] rounded-[100px]">
        <TabButton label="Facility Report" isActive={activeTab === "all"} onClick={() => setActiveTab("all")} />
        <TabButton label="Approved" isActive={activeTab === "approved"} onClick={() => setActiveTab("approved")} />
        <TabButton label="Pending" isActive={activeTab === "pending"} onClick={() => setActiveTab("pending")} />
        <TabButton label="Rejected" isActive={activeTab === "rejected"} onClick={() => setActiveTab("rejected")} />
      </div>

      <div className="flex flex-col items-start justify-center rounded-2xl border border-opacityClr-30 bg-white">
        <TableHeader
          title={`Tasks (${taskTable.getRowModel().rows.length})`}
          searchQuery={searchQuery}
          handleInputChange={(e) => setSearchQuery(e.target.value)}
          handleClear={() => setSearchQuery("")}
        />
        <TableHeadAndBody
          table={taskTable}
          emptyState={{
            image: emptyWallet,
            alt: "Empty User Data",
            message: activeTab === "all" ? "No tasks assigned to this facility yet" : `No ${activeTab} tasks for this facility`,
            ...(activeTab === "all"
              ? {
                  action: {
                    label: "Create Task",
                    onClick: () => openModal("Create New Task", <CreateTaskDrawer closeModal={closeModal} />),
                  },
                }
              : {}),
          }}
        />
        <Pagination
          currentPage={taskTable.getState().pagination.pageIndex + 1}
          totalPages={taskTable.getPageCount()}
          onPageChange={(page: number) => taskTable.setPageIndex(page - 1)}
          totalRecords={taskTable.getRowCount()}
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

export default FacilityDetailsPage;
