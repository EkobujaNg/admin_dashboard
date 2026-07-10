import type { BuybackRequest, BuybackStatus, PaginatedBuybackRequests } from "./types";

function normalizeStatus(raw: unknown): BuybackStatus | string {
  const status = String(raw ?? "pending").toLowerCase();
  if (status === "pending" || status === "approved" || status === "declined") {
    return status;
  }
  return status || "pending";
}

export function normalizeBuybackRequest(raw: Record<string, unknown>): BuybackRequest {
  return {
    id: String(raw.id ?? ""),
    holdingId: String(raw.holdingId ?? ""),
    propertyId: String(raw.propertyId ?? ""),
    propertyName: String(raw.propertyName ?? ""),
    units: Number(raw.units ?? 0),
    shareValue: Number(raw.shareValue ?? 0),
    ekobujaBuyBackPercent: Number(raw.ekobujaBuyBackPercent ?? 0),
    buybackRatePerUnit: Number(raw.buybackRatePerUnit ?? 0),
    totalAmount: Number(raw.totalAmount ?? raw.amount ?? 0),
    availableUnits: Number(raw.availableUnits ?? 0),
    status: normalizeStatus(raw.status),
    createdAt: raw.createdAt ? String(raw.createdAt) : null,
    userId: raw.userId ? String(raw.userId) : undefined,
    userEmail: raw.userEmail ? String(raw.userEmail) : undefined,
    userName: raw.userName ? String(raw.userName) : undefined,
  };
}

export function normalizePaginatedBuybackRequests(
  data: Record<string, unknown> | unknown[],
  fallbackPage = 1,
  fallbackLimit = 10
): PaginatedBuybackRequests {
  if (Array.isArray(data)) {
    const pageItems = data.map((item) => normalizeBuybackRequest(item as Record<string, unknown>));
    return {
      pageItems,
      currentPage: fallbackPage,
      numberOfPages: 1,
      totalItems: pageItems.length,
      pageSize: fallbackLimit,
      hasMore: false,
    };
  }

  const rawItems = data.items || data.pageItems || data.data || data.requests || [];
  const pageItems = Array.isArray(rawItems)
    ? rawItems.map((item) => normalizeBuybackRequest(item as Record<string, unknown>))
    : [];

  const currentPage = Number(data.page ?? data.currentPage ?? data.pageNumber ?? fallbackPage);
  const pageSize = Number(data.limit ?? data.pageSize ?? fallbackLimit);
  const totalItems = Number(data.total ?? data.totalItems ?? data.totalCount ?? pageItems.length);
  const numberOfPages = Number(
    data.totalPages ?? data.numberOfPages ?? Math.max(1, Math.ceil(totalItems / pageSize))
  );

  return {
    pageItems,
    currentPage,
    numberOfPages,
    totalItems,
    pageSize,
    hasMore: Boolean(data.hasMore ?? currentPage < numberOfPages),
  };
}
