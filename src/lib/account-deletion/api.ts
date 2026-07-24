import http from "@/lib/http";
import { normalizePaginated } from "@/lib/support/mappers";

type RecordValue = Record<string, unknown>;

function record(value: unknown): RecordValue {
  return value && typeof value === "object" ? (value as RecordValue) : {};
}

function string(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function id(value: unknown): string {
  return string(value) ?? "";
}

export type AccountDeletionRequest = {
  id: string;
  email: string | null;
  reason: string | null;
  status?: string | null;
  createdAt?: string | null;
};

export async function getAccountDeletionRequests(page = 1, limit = 10) {
  const res = await http.get<any>("/admin/account-deletion-requests", { params: { page, limit } });
  const data = res.data;
  const source = record(data?.data ?? data ?? {});
  const itemsValue = source.items ?? source.results ?? source.data ?? data;
  const items = Array.isArray(itemsValue) ? itemsValue.map((item) => normalizeAccountDeletionRequest(item)) : [];

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

export async function getAccountDeletionRequest(id: string) {
  const res = await http.get<any>(`/admin/account-deletion-requests/${id}`);
  const data = res.data;
  return normalizeAccountDeletionRequest(data?.data ?? data);
}

function normalizeAccountDeletionRequest(value: unknown): AccountDeletionRequest {
  const item = record(value);
  return {
    id: id(item.id ?? item._id),
    email:
      string((item["email"] ?? item["userEmail"] ?? (item["user"] && (item["user"] as Record<string, unknown>)["email"])) as unknown) ??
      null,
    reason: string((item["reason"] ?? item["message"] ?? item["description"]) as unknown) ?? null,
    status: string((item["status"] ?? null) as unknown) ?? null,
    createdAt: string((item["createdAt"] ?? item["created_at"]) as unknown) ?? null,
  };
}
