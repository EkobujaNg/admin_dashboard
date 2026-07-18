import http from "@/lib/http";
import {
  normalizePaginatedProfitShareBreakdown,
  normalizePaginatedProfitShareRecords,
  normalizePaginatedProfitSharingStatuses,
  normalizePaginatedUnownedProfitHistory,
  normalizeProfitSharingPropertyStatus,
} from "./mappers";
import type {
  GetProfitShareBreakdownParams,
  GetProfitShareRecordsParams,
  GetProfitSharingStatusesParams,
  GetUnownedProfitHistoryParams,
  LoadProfitSharePayload,
  PaginatedProfitShareBreakdown,
  PaginatedProfitShareRecords,
  PaginatedProfitSharingStatuses,
  PaginatedUnownedProfitHistory,
  ProfitSharingPropertyStatus,
  UpdateProfitSharingRatePayload,
} from "./types";

const PROFIT_SHARING_BASE = "/admin/profit-sharing";
const UNOWNED_HISTORY_BASE = `${PROFIT_SHARING_BASE}/unowned-balance/history`;

function unwrapData<T>(data: T | { data: T }): T {
  if (!data || typeof data !== "object") return data as T;
  const record = data as Record<string, unknown>;
  if (
    Array.isArray(record.items) ||
    Array.isArray(record.pageItems) ||
    record.total != null ||
    record.page != null ||
    record.propertyId != null
  ) {
    return data as T;
  }
  if ("data" in record && record.data) {
    return record.data as T;
  }
  return data as T;
}

export function getProfitSharingErrorMessage(error: any, fallback: string) {
  const message = error?.response?.data?.message;
  if (Array.isArray(message)) return message.join(", ");
  return (
    error?.response?.data?.responseDescription ||
    error?.response?.data?.responseMessage ||
    message ||
    error?.message ||
    fallback
  );
}

export async function getUnownedProfitHistory(
  params: GetUnownedProfitHistoryParams = {}
): Promise<PaginatedUnownedProfitHistory> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const { data } = await http.get<Record<string, unknown> | unknown[] | { data: Record<string, unknown> | unknown[] }>(
    UNOWNED_HISTORY_BASE,
    {
      params: {
        page,
        limit,
        ...(params.propertyName?.trim() ? { propertyName: params.propertyName.trim() } : {}),
      },
    }
  );

  return normalizePaginatedUnownedProfitHistory(
    unwrapData(data) as Record<string, unknown> | unknown[],
    page,
    limit
  );
}

export async function getProfitSharingStatuses(
  params: GetProfitSharingStatusesParams = {}
): Promise<PaginatedProfitSharingStatuses> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const { data } = await http.get<Record<string, unknown> | unknown[] | { data: Record<string, unknown> | unknown[] }>(
    `${PROFIT_SHARING_BASE}/status`,
    {
      params: {
        page,
        limit,
        ...(params.name?.trim() ? { name: params.name.trim() } : {}),
      },
    }
  );

  return normalizePaginatedProfitSharingStatuses(
    unwrapData(data) as Record<string, unknown> | unknown[],
    page,
    limit
  );
}

export async function getPropertyProfitSharingStatus(
  propertyId: string
): Promise<ProfitSharingPropertyStatus> {
  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    `${PROFIT_SHARING_BASE}/${propertyId}/status`
  );
  return normalizeProfitSharingPropertyStatus(unwrapData(data) as Record<string, unknown>);
}

export async function getProfitShareRecords(
  params: GetProfitShareRecordsParams
): Promise<PaginatedProfitShareRecords> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const { data } = await http.get<Record<string, unknown> | unknown[] | { data: Record<string, unknown> | unknown[] }>(
    `${PROFIT_SHARING_BASE}/${params.propertyId}`,
    {
      params: {
        page,
        limit,
        ...(params.year != null ? { year: params.year } : {}),
      },
    }
  );

  return normalizePaginatedProfitShareRecords(
    unwrapData(data) as Record<string, unknown> | unknown[],
    page,
    limit
  );
}

export async function getProfitShareBreakdown(
  params: GetProfitShareBreakdownParams
): Promise<PaginatedProfitShareBreakdown> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const { data } = await http.get<Record<string, unknown> | unknown[] | { data: Record<string, unknown> | unknown[] }>(
    `${PROFIT_SHARING_BASE}/${params.propertyId}/breakdown`,
    {
      params: {
        page,
        limit,
        ...(params.year != null ? { year: params.year } : {}),
        ...(params.section != null ? { section: params.section } : {}),
      },
    }
  );

  return normalizePaginatedProfitShareBreakdown(
    unwrapData(data) as Record<string, unknown> | unknown[],
    page,
    limit
  );
}

export async function loadProfitShare(
  propertyId: string,
  payload: LoadProfitSharePayload
): Promise<unknown> {
  const { data } = await http.post(`${PROFIT_SHARING_BASE}/${propertyId}/load`, payload);
  return unwrapData(data);
}

export async function distributeProfitShare(propertyId: string): Promise<unknown> {
  const { data } = await http.post(`${PROFIT_SHARING_BASE}/${propertyId}/distribute`);
  return unwrapData(data);
}

export async function updateProfitSharingRate(
  propertyId: string,
  payload: UpdateProfitSharingRatePayload
): Promise<unknown> {
  const { data } = await http.patch(`${PROFIT_SHARING_BASE}/${propertyId}/rate`, payload);
  return unwrapData(data);
}
