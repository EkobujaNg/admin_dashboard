import http from "@/lib/http";
import {
  normalizeAdminUserDetail,
  normalizeAdminUserStats,
  normalizePaginatedAdminUsers,
} from "./mappers";
import type {
  AdminUserDetail,
  AdminUserStats,
  GetAdminUsersParams,
  PaginatedAdminUsers,
} from "./types";

const ADMIN_USERS_BASE = "/admin/users";

function unwrapData<T>(data: T | { data: T }): T {
  if (data && typeof data === "object" && "data" in data && (data as { data: T }).data) {
    return (data as { data: T }).data;
  }
  return data as T;
}

export function getAdminUserErrorMessage(error: any, fallback: string) {
  return (
    error?.response?.data?.responseDescription ||
    error?.response?.data?.responseMessage ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

export async function getAdminUsers(params: GetAdminUsersParams = {}): Promise<PaginatedAdminUsers> {
  const q = params.q?.trim();
  const filter = params.filter && params.filter !== "all" ? params.filter : undefined;

  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(ADMIN_USERS_BASE, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      ...(q ? { q } : {}),
      ...(filter ? { filter } : { filter: "all" }),
    },
  });

  return normalizePaginatedAdminUsers(unwrapData(data) as Record<string, unknown>);
}

export async function getAdminUserStats(): Promise<AdminUserStats> {
  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    `${ADMIN_USERS_BASE}/stats`
  );
  return normalizeAdminUserStats(unwrapData(data) as Record<string, unknown>);
}

export async function getAdminUserById(id: string): Promise<AdminUserDetail> {
  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    `${ADMIN_USERS_BASE}/${id}`
  );
  return normalizeAdminUserDetail(unwrapData(data) as Record<string, unknown>);
}

export async function blockAdminUser(id: string): Promise<{ message?: string }> {
  const { data } = await http.post(`${ADMIN_USERS_BASE}/${id}/block`);
  return unwrapData(data) as { message?: string };
}

export async function unblockAdminUser(id: string): Promise<{ message?: string }> {
  const { data } = await http.post(`${ADMIN_USERS_BASE}/${id}/unblock`);
  return unwrapData(data) as { message?: string };
}

export async function verifyUtilityBill(userId: string): Promise<{ message?: string }> {
  const { data } = await http.post(`/admin/kyc/utility-bills/${userId}/verify`);
  return unwrapData(data) as { message?: string };
}
