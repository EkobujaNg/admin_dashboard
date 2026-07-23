import type { ContactSubmission, PaginatedResult, SupportTicket, SupportTicketMessage } from "./types";

type RecordValue = Record<string, unknown>;

function record(value: unknown): RecordValue {
  return value && typeof value === "object" ? (value as RecordValue) : {};
}

function string(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function id(value: unknown): string {
  return string(value) ?? "—";
}

export function normalizeTicketMessage(value: unknown): SupportTicketMessage {
  const item = record(value);
  const sender = record(item.author ?? item.sender ?? item.user);
  const rawAuthor = string(item.authorType ?? item.authorRole ?? item.author) ??
    (item.isSupport === true ? "support" : "user");
  const authorValue = ["admin", "support"].includes(rawAuthor.toLowerCase()) ? "support" : "user";

  return {
    id: id(item.id ?? item._id),
    body: string(item.body ?? item.message ?? item.content) ?? "",
    author: authorValue.toLowerCase(),
    createdAt: string(item.createdAt ?? item.created_at),
    authorName: string(item.authorLabel ?? item.authorName ?? sender.name ?? sender.fullName),
  };
}

export function normalizeSupportTicket(value: unknown): SupportTicket {
  const item = record(value);
  const user = record(item.user ?? item.customer ?? item.createdBy);
  const messagesValue = item.messages ?? item.ticketMessages;

  return {
    id: id(item.id ?? item._id),
    subject: string(item.subject ?? item.title) ?? "Untitled ticket",
    category: string(item.category),
    status: string(item.status) ?? "open",
    userName: string(item.userName ?? item.name ?? user.name ?? user.fullName),
    userEmail: string(item.email ?? item.userEmail ?? user.email),
    createdAt: string(item.createdAt ?? item.created_at),
    updatedAt: string(item.updatedAt ?? item.updated_at),
    messages: Array.isArray(messagesValue) ? messagesValue.map(normalizeTicketMessage) : [],
  };
}

export function normalizeContactSubmission(value: unknown): ContactSubmission {
  const item = record(value);
  return {
    id: id(item.id ?? item._id),
    name: string(item.name ?? item.fullName),
    email: string(item.email),
    subject: string(item.subject),
    message: string(item.message ?? item.description),
    createdAt: string(item.createdAt ?? item.created_at),
  };
}

export function normalizePaginated<T>(
  value: unknown,
  page: number,
  limit: number,
  mapper: (item: unknown) => T
): PaginatedResult<T> {
  const source = record(value);
  const itemsValue = source.items ?? source.results ?? source.data ?? value;
  const items = Array.isArray(itemsValue) ? itemsValue.map(mapper) : [];
  const total = Number(source.total ?? source.count ?? source.totalItems ?? items.length);
  const responsePage = Number(source.page ?? source.currentPage ?? page);
  const responseLimit = Number(source.limit ?? source.pageSize ?? limit);
  const totalPages = Number(source.totalPages ?? source.numberOfPages ?? Math.max(1, Math.ceil(total / responseLimit)));

  return {
    items,
    page: Number.isFinite(responsePage) ? responsePage : page,
    limit: Number.isFinite(responseLimit) ? responseLimit : limit,
    total: Number.isFinite(total) ? total : items.length,
    totalPages: Number.isFinite(totalPages) ? totalPages : 1,
  };
}
