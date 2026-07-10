import http from "@/lib/http";
import { normalizePaginatedCommissions, normalizePaginatedWalletTransactions } from "./mappers";
import type {
  GetCommissionsParams,
  GetWalletTransactionsParams,
  PaginatedCommissions,
  PaginatedWalletTransactions,
} from "./types";

const ADMIN_TRANSACTIONS_BASE = "/admin/transactions";

function unwrapData<T>(data: T | { data: T }): T {
  if (data && typeof data === "object" && "data" in data && (data as { data: T }).data) {
    return (data as { data: T }).data;
  }
  return data as T;
}

export function getTransactionsErrorMessage(error: any, fallback: string) {
  return (
    error?.response?.data?.responseDescription ||
    error?.response?.data?.responseMessage ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

export async function getWalletTransactions(
  params: GetWalletTransactionsParams = {}
): Promise<PaginatedWalletTransactions> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    `${ADMIN_TRANSACTIONS_BASE}/wallet`,
    { params: { page, limit } }
  );

  return normalizePaginatedWalletTransactions(unwrapData(data) as Record<string, unknown>, page, limit);
}

export async function getCommissionRecords(
  params: GetCommissionsParams = {}
): Promise<PaginatedCommissions> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    `${ADMIN_TRANSACTIONS_BASE}/commissions`,
    {
      params: {
        page,
        limit,
        ...(params.propertyId ? { propertyId: params.propertyId } : {}),
      },
    }
  );

  return normalizePaginatedCommissions(unwrapData(data) as Record<string, unknown>, page, limit);
}
