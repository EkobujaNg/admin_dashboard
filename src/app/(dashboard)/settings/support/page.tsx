"use client";

import React, { useMemo, useState } from "react";
import { Eye, X } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Pagination from "@/components/ui/Pagination";
import TabButton from "@/components/ui/TabButton";
import TableHeadAndBody from "@/components/ui/TableHeadAndBody";
import TableHeader from "@/components/ui/TableHeader";
import { emptyWallet } from "../../../../../public/assets/images";
import useSupportAPI from "@/services/useSupportAPI";
import type { ContactSubmission, SupportTicket, SupportTicketStatus } from "@/lib/support/types";
import { createColumnHelper, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

const PAGE_SIZE = 10;
const contactColumnHelper = createColumnHelper<ContactSubmission>();
const ticketColumnHelper = createColumnHelper<SupportTicket>();

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
}

function StatusBadge({ status }: { status: SupportTicketStatus }) {
  const normalised = status.replace(/_/g, " ");
  const color =
    status === "resolved"
      ? "bg-green-100 text-green-700"
      : status === "closed"
        ? "bg-gray-200 text-gray-700"
        : "bg-amber-100 text-amber-700";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${color}`}>{normalised}</span>;
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="h-6 w-24 rounded bg-gray-200" />
      <div className="h-7 w-3/4 rounded bg-gray-200" />
      <div className="h-4 w-1/2 rounded bg-gray-200" />
      <div className="flex gap-3"><div className="h-10 w-20 rounded-md bg-gray-200" /><div className="h-10 w-28 rounded-md bg-gray-200" /></div>
      <div className="border-t border-opacityClr-20 pt-5"><div className="mb-3 h-5 w-32 rounded bg-gray-200" /><div className="h-28 rounded-xl bg-gray-200" /></div>
      <div className="border-t border-opacityClr-20 pt-5"><div className="mb-2 h-4 w-28 rounded bg-gray-200" /><div className="h-28 rounded-lg bg-gray-200" /><div className="mt-3 h-10 w-28 rounded-md bg-gray-200" /></div>
    </div>
  );
}

const SupportSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<"contact" | "support">("contact");
  const [contactPage, setContactPage] = useState(1);
  const [ticketPage, setTicketPage] = useState(1);
  const [selectedContactId, setSelectedContactId] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [reply, setReply] = useState("");
  const {
    contacts,
    contactsMeta,
    isLoadingContacts,
    contactsError,
    contact,
    isLoadingContact,
    tickets,
    ticketsMeta,
    isLoadingTickets,
    ticketsError,
    ticket,
    isLoadingTicket,
    updateStatus,
    isUpdatingStatus,
    reply: sendReply,
    isReplying,
  } = useSupportAPI({
    page: activeTab === "contact" ? contactPage : ticketPage,
    limit: PAGE_SIZE,
    ticketId: selectedTicketId,
    contactId: selectedContactId,
    enableContacts: activeTab === "contact",
    enableTickets: activeTab === "support",
  });

  const activeMeta = activeTab === "contact" ? contactsMeta : ticketsMeta;
  const activePage = activeTab === "contact" ? contactPage : ticketPage;
  const setActivePage = activeTab === "contact" ? setContactPage : setTicketPage;

  const closeDetail = () => {
    setSelectedContactId("");
    setSelectedTicketId("");
    setReply("");
  };
  const submitReply = () => {
    if (!selectedTicketId || !reply.trim()) return;
    sendReply(selectedTicketId, reply.trim());
    setReply("");
  };

  const contactColumns = useMemo(
    () => [
      contactColumnHelper.accessor("name", {
        header: "User",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium text-primary-10">{info.getValue() ?? "—"}</span>
            <span className="text-xs font-normal text-gray-500">{info.row.original.email ?? "—"}</span>
          </div>
        ),
      }),
      contactColumnHelper.accessor("subject", {
        header: "Subject",
        cell: (info) => <span className="text-primary-10">{info.getValue() ?? "No subject"}</span>,
      }),
      contactColumnHelper.accessor("createdAt", {
        header: "Date",
        cell: (info) => <span className="font-normal text-gray-600">{formatDate(info.getValue())}</span>,
      }),
      contactColumnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <button
            type="button"
            onClick={() => setSelectedContactId(info.row.original.id)}
            className="inline-flex rounded-md p-2 text-primary-10 transition-colors hover:bg-neutral-100"
            aria-label="View contact request"
          >
            <Eye className="h-4 w-4" />
          </button>
        ),
      }),
    ],
    [],
  );

  const ticketColumns = useMemo(
    () => [
      ticketColumnHelper.accessor("subject", {
        header: "Ticket",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium text-primary-10">{info.getValue()}</span>
            <span className="text-xs font-normal text-gray-500">{info.row.original.category ?? "General"}</span>
          </div>
        ),
      }),
      ticketColumnHelper.accessor("userName", {
        header: "Customer",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="text-xs font-normal text-gray-500">{info.row.original.userEmail ?? "—"}</span>
          </div>
        ),
      }),
      ticketColumnHelper.accessor("status", { header: "Status", cell: (info) => <StatusBadge status={info.getValue()} /> }),
      ticketColumnHelper.accessor("updatedAt", {
        header: "Date",
        cell: (info) => <span className="font-normal text-gray-600">{formatDate(info.getValue())}</span>,
      }),
      ticketColumnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <button
            type="button"
            onClick={() => setSelectedTicketId(info.row.original.id)}
            className="inline-flex rounded-md p-2 text-primary-10 transition-colors hover:bg-neutral-100"
            aria-label="View support ticket"
          >
            <Eye className="h-4 w-4" />
          </button>
        ),
      }),
    ],
    [],
  );

  const contactsTable = useReactTable({
    data: contacts,
    columns: contactColumns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: contactsMeta?.totalPages ?? 1,
  });
  const ticketsTable = useReactTable({
    data: tickets,
    columns: ticketColumns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: ticketsMeta?.totalPages ?? 1,
  });
  const activeTable = activeTab === "contact" ? contactsTable : ticketsTable;
  const isLoading = activeTab === "contact" ? isLoadingContacts : isLoadingTickets;
  const activeError = activeTab === "contact" ? contactsError : ticketsError;
  const activeItems = activeTab === "contact" ? contacts : tickets;

  return (
    <section className="flex w-full flex-col gap-5 pt-4 md:pt-0">
      <Breadcrumb items={[{ label: "Settings", href: "/settings" }, { label: "Support" }]} />
      <div>
        <h1 className="font-Raleway text-2xl font-bold text-primary-10">Support</h1>
        <p className="mt-1 font-Raleway text-sm text-opacityClr-80">Manage website contact requests and customer support tickets.</p>
      </div>

      <div className="flex w-full items-center justify-center gap-2 rounded-[100px] bg-[#ECECEC]">
        <TabButton
          label="Contact"
          isActive={activeTab === "contact"}
          onClick={() => {
            setActiveTab("contact");
            closeDetail();
          }}
        />
        <TabButton
          label="Help & Support"
          isActive={activeTab === "support"}
          onClick={() => {
            setActiveTab("support");
            closeDetail();
          }}
        />
      </div>

      <div className="flex flex-col items-start justify-center overflow-hidden rounded-2xl border border-opacityClr-30 bg-white">
        <TableHeader
          title={`${activeTab === "contact" ? "Contact requests" : "Support tickets"} (${activeMeta?.total ?? 0})`}
          isLoading={isLoading}
          table={activeTable}
          showExport={false}
          showFilter={false}
          showSearch={false}
        />
        <TableHeadAndBody
          table={activeTable}
          isLoading={isLoading}
          emptyState={{
            image: emptyWallet,
            alt: "No records",
            message: activeError
              ? `Failed to load ${activeTab === "contact" ? "contact requests" : "support tickets"}. Please try again.`
              : `No ${activeTab === "contact" ? "contact requests" : "support tickets"} found.`,
          }}
        />
        {activeItems.length > 0 && (
          <Pagination
            currentPage={activeMeta?.page ?? activePage}
            totalPages={activeMeta?.totalPages ?? 1}
            onPageChange={setActivePage}
            totalRecords={activeMeta?.total ?? 0}
          />
        )}
      </div>

      {(selectedContactId || selectedTicketId) && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={closeDetail}>
          <aside className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-Raleway text-xl font-bold text-primary-10">
                  {selectedTicketId ? "Support ticket" : "Contact request"}
                </h2>
              </div>
              <button type="button" onClick={closeDetail} aria-label="Close">
                <X />
              </button>
            </div>
            {(selectedTicketId && isLoadingTicket) || (selectedContactId && isLoadingContact) ? (
              <DetailSkeleton />
            ) : selectedTicketId && ticket ? (
              <div className="flex flex-col gap-5">
                <div>
                  <StatusBadge status={ticket.status} />
                  <h3 className="mt-3 font-Raleway text-lg font-bold text-primary-10">{ticket.subject}</h3>
                  <p className="mt-1 text-sm text-opacityClr-80">
                    {ticket.userEmail ?? "—"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => updateStatus(ticket.id, { status: "resolved" })}
                    className="rounded-md bg-[#C2DF93] px-3 py-2 text-sm font-semibold text-primary-10 disabled:opacity-50"
                  >
                    Resolve
                  </button>
                  <button
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => updateStatus(ticket.id, { status: "closed" })}
                    className="rounded-md border border-[#F5C2C0] bg-[#FDE8E7] px-3 py-2 text-sm font-semibold text-[#B42318] transition-colors hover:bg-[#FBD5D2] disabled:opacity-50"
                  >
                    Close ticket
                  </button>
                </div>
                <div className="border-t border-opacityClr-20 pt-5">
                  <h3 className="mb-3 font-Raleway font-bold text-primary-10">Conversation</h3>
                  {ticket.messages.length ? (
                    <div className="flex flex-col gap-3">
                      {ticket.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`rounded-xl border p-3 ${message.author === "support" ? "border-[#C2DF93] bg-[#F3F8E9]" : "border-opacityClr-20 bg-[#F3F4F4]"}`}
                        >
                          <p className="mb-1 text-xs font-semibold text-primary-10">{message.authorName ?? (message.author === "support" ? "Support" : "User")}</p>
                          <p className="whitespace-pre-wrap text-sm text-opacityClr-80">{message.body}</p>
                          <p className="mt-2 text-xs text-opacityClr-60">{formatDate(message.createdAt)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-opacityClr-80">No messages available.</p>
                  )}
                </div>
                <div className="border-t border-opacityClr-20 pt-5">
                  <label htmlFor="support-reply" className="mb-2 block text-sm font-semibold text-primary-10">
                    Reply as support
                  </label>
                  <textarea
                    id="support-reply"
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-opacityClr-20 p-3 text-sm outline-none focus:border-primary-20"
                    placeholder="Write a reply..."
                  />
                  <button
                    type="button"
                    disabled={!reply.trim() || isReplying}
                    onClick={submitReply}
                    className="mt-3 rounded-md bg-primary-10 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {isReplying ? "Sending..." : "Send reply"}
                  </button>
                </div>
              </div>
            ) : selectedContactId && contact ? (
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="font-Raleway text-lg font-bold text-primary-10">{contact.subject ?? "No subject"}</h3>
                  <p className="mt-2 text-sm text-opacityClr-80">
                    From: {contact.name ?? "—"} · {contact.email ?? "—"}
                  </p>
                  <p className="mt-1 text-xs text-opacityClr-60">Received {formatDate(contact.createdAt)}</p>
                </div>
                <div className="rounded-xl bg-[#F3F4F4] p-4 whitespace-pre-wrap text-sm text-primary-10">
                  {contact.message ?? "No message provided."}
                </div>
              </div>
            ) : (
              <p className="text-sm text-opacityClr-80">Unable to load this item.</p>
            )}
          </aside>
        </div>
      )}
    </section>
  );
};

export default SupportSettingsPage;
