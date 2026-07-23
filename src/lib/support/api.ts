import http from "@/lib/http";
import { normalizeContactSubmission, normalizePaginated, normalizeSupportTicket } from "./mappers";
import type { ContactSubmission, PaginatedResult, SupportTicket, UpdateTicketStatusPayload } from "./types";

const TICKETS_BASE = "/admin/support/tickets";
const CONTACT_BASE = "/admin/contact-us";

function unwrapData(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  const source = value as Record<string, unknown>;
  if ("data" in source && source.data != null && !Array.isArray(source.items)) return source.data;
  return value;
}

export function getSupportErrorMessage(error: any, fallback: string) {
  const message = error?.response?.data?.message;
  return Array.isArray(message)
    ? message.join(", ")
    : error?.response?.data?.responseDescription || error?.response?.data?.responseMessage || message || error?.message || fallback;
}

export async function getSupportTickets(page = 1, limit = 10): Promise<PaginatedResult<SupportTicket>> {
  const { data } = await http.get<unknown>(TICKETS_BASE, { params: { page, limit } });
  return normalizePaginated(unwrapData(data), page, limit, normalizeSupportTicket);
}

export async function getSupportTicket(id: string): Promise<SupportTicket> {
  const { data } = await http.get<unknown>(`${TICKETS_BASE}/${id}`);
  return normalizeSupportTicket(unwrapData(data));
}

export async function updateSupportTicketStatus(id: string, payload: UpdateTicketStatusPayload): Promise<SupportTicket> {
  const { data } = await http.patch<unknown>(`${TICKETS_BASE}/${id}`, payload);
  return normalizeSupportTicket(unwrapData(data));
}

export async function replyToSupportTicket(id: string, body: string): Promise<SupportTicket> {
  const { data } = await http.post<unknown>(`${TICKETS_BASE}/${id}/messages`, { body });
  return normalizeSupportTicket(unwrapData(data));
}

export async function getContactSubmissions(page = 1, limit = 10): Promise<PaginatedResult<ContactSubmission>> {
  const { data } = await http.get<unknown>(CONTACT_BASE, { params: { page, limit } });
  return normalizePaginated(unwrapData(data), page, limit, normalizeContactSubmission);
}

export async function getContactSubmission(id: string): Promise<ContactSubmission> {
  const { data } = await http.get<unknown>(`${CONTACT_BASE}/${id}`);
  return normalizeContactSubmission(unwrapData(data));
}
