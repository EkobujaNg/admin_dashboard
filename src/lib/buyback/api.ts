import http from "@/lib/http";
import { normalizeBuybackRequest, normalizePaginatedBuybackRequests } from "./mappers";
import type {
  BuybackRequest,
  GetBuybackRequestsParams,
  PaginatedBuybackRequests,
} from "./types";

const ADMIN_BUYBACK_BASE = "/admin/buyback/requests";
const ADMIN_BUYBACK_TOP_UP = "/admin/buyback/top-up";

function unwrapData<T>(data: T | { data: T }): T {
  if (data && typeof data === "object" && "data" in data && (data as { data: T }).data) {
    return (data as { data: T }).data;
  }
  return data as T;
}

export function getBuybackErrorMessage(error: any, fallback: string) {
  return (
    error?.response?.data?.responseDescription ||
    error?.response?.data?.responseMessage ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

export async function topUpBuybackBalance(amount: number): Promise<{ message?: string }> {
  const { data } = await http.post(ADMIN_BUYBACK_TOP_UP, { amount });
  return unwrapData(data) as { message?: string };
}

export async function getBuybackRequests(
  params: GetBuybackRequestsParams = {}
): Promise<PaginatedBuybackRequests> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const { data } = await http.get<Record<string, unknown> | unknown[] | { data: Record<string, unknown> | unknown[] }>(
    ADMIN_BUYBACK_BASE,
    {
      params: {
        page,
        limit,
        ...(params.status ? { status: params.status } : {}),
      },
    }
  );

  return normalizePaginatedBuybackRequests(
    unwrapData(data) as Record<string, unknown> | unknown[],
    page,
    limit
  );
}

export async function getBuybackRequestById(id: string): Promise<BuybackRequest> {
  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    `${ADMIN_BUYBACK_BASE}/${id}`
  );
  return normalizeBuybackRequest(unwrapData(data) as Record<string, unknown>);
}

export async function approveBuybackRequest(id: string): Promise<{ message?: string }> {
  const { data } = await http.post(`${ADMIN_BUYBACK_BASE}/${id}/approve`);
  return unwrapData(data) as { message?: string };
}

export async function declineBuybackRequest(id: string): Promise<{ message?: string }> {
  const { data } = await http.post(`${ADMIN_BUYBACK_BASE}/${id}/decline`);
  return unwrapData(data) as { message?: string };
}
