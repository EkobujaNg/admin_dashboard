import http from "@/lib/http";
import {
  normalizePaginatedWithdrawalRequests,
  normalizeWithdrawalRequest,
  normalizeWithdrawalStats,
} from "./mappers";
import type {
  GetWithdrawalRequestsParams,
  PaginatedWithdrawalRequests,
  RejectWithdrawalPayload,
  WithdrawalRequest,
  WithdrawalStats,
} from "./types";

const ADMIN_WITHDRAWALS_BASE = "/admin/withdrawals/requests";

function unwrapData<T>(data: T | { data: T }): T {
  if (data && typeof data === "object" && "data" in data && (data as { data: T }).data) {
    return (data as { data: T }).data;
  }
  return data as T;
}

export function getWithdrawalErrorMessage(error: any, fallback: string) {
  return (
    error?.response?.data?.responseDescription ||
    error?.response?.data?.responseMessage ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

export async function getWithdrawalRequests(
  params: GetWithdrawalRequestsParams = {}
): Promise<PaginatedWithdrawalRequests> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const { data } = await http.get<Record<string, unknown> | unknown[] | { data: Record<string, unknown> | unknown[] }>(
    ADMIN_WITHDRAWALS_BASE,
    {
      params: {
        page,
        limit,
        ...(params.status ? { status: params.status } : {}),
      },
    }
  );

  return normalizePaginatedWithdrawalRequests(
    unwrapData(data) as Record<string, unknown> | unknown[],
    page,
    limit
  );
}

export async function getWithdrawalStats(): Promise<WithdrawalStats> {
  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    `${ADMIN_WITHDRAWALS_BASE}/stats`
  );
  return normalizeWithdrawalStats(unwrapData(data) as Record<string, unknown>);
}

export async function getWithdrawalRequestById(id: string): Promise<WithdrawalRequest> {
  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    `${ADMIN_WITHDRAWALS_BASE}/${id}`
  );
  return normalizeWithdrawalRequest(unwrapData(data) as Record<string, unknown>);
}

export async function completeWithdrawalRequest(id: string): Promise<{ message?: string }> {
  const { data } = await http.post(`${ADMIN_WITHDRAWALS_BASE}/${id}/complete`);
  return unwrapData(data) as { message?: string };
}

export async function rejectWithdrawalRequest(
  id: string,
  payload: RejectWithdrawalPayload
): Promise<{ message?: string }> {
  const { data } = await http.post(`${ADMIN_WITHDRAWALS_BASE}/${id}/reject`, payload);
  return unwrapData(data) as { message?: string };
}
