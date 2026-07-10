import type {
  CommissionRecord,
  PaginatedCommissions,
  PaginatedWalletTransactions,
  WalletTransaction,
} from "./types";

export function normalizeWalletTransaction(raw: Record<string, unknown>): WalletTransaction {
  const metadata =
    raw.metadata && typeof raw.metadata === "object" ? (raw.metadata as Record<string, unknown>) : {};

  return {
    id: String(raw.id ?? ""),
    type: String(raw.type ?? ""),
    status: String(raw.status ?? ""),
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    amount: Number(raw.amount ?? 0),
    currency: String(raw.currency ?? "NGN"),
    action: String(raw.action ?? ""),
    provider: String(raw.provider ?? ""),
    reference: String(raw.reference ?? ""),
    providerReference: raw.providerReference ? String(raw.providerReference) : null,
    createdAt: raw.createdAt ? String(raw.createdAt) : null,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : null,
    userId: String(raw.userId ?? ""),
    userEmail: String(raw.userEmail ?? ""),
    userName: String(raw.userName ?? ""),
    propertyId: raw.propertyId ? String(raw.propertyId) : null,
    propertyName: raw.propertyName ? String(raw.propertyName) : null,
    metadata,
  };
}

export function normalizeCommissionRecord(raw: Record<string, unknown>): CommissionRecord {
  return {
    id: String(raw.id ?? ""),
    userId: String(raw.userId ?? ""),
    userEmail: String(raw.userEmail ?? ""),
    userName: String(raw.userName ?? ""),
    propertyId: String(raw.propertyId ?? ""),
    propertyName: String(raw.propertyName ?? ""),
    amount: Number(raw.amount ?? 0),
    units: Number(raw.units ?? 0),
    pricePerUnit: Number(raw.pricePerUnit ?? 0),
    transactionId: String(raw.transactionId ?? ""),
    createdAt: raw.createdAt ? String(raw.createdAt) : null,
  };
}

export function normalizePaginatedWalletTransactions(
  data: Record<string, unknown>,
  fallbackPage = 1,
  fallbackLimit = 10
): PaginatedWalletTransactions {
  const rawItems = data.items || data.pageItems || data.data || [];
  const pageItems = Array.isArray(rawItems)
    ? rawItems.map((item) => normalizeWalletTransaction(item as Record<string, unknown>))
    : [];

  const currentPage = Number(data.page ?? data.currentPage ?? fallbackPage);
  const pageSize = Number(data.limit ?? data.pageSize ?? fallbackLimit);
  const totalItems = Number(data.total ?? data.totalItems ?? pageItems.length);
  const numberOfPages = Number(data.totalPages ?? data.numberOfPages ?? Math.max(1, Math.ceil(totalItems / pageSize)));

  return {
    pageItems,
    currentPage,
    numberOfPages,
    totalItems,
    pageSize,
    hasMore: Boolean(data.hasMore ?? currentPage < numberOfPages),
  };
}

export function normalizePaginatedCommissions(
  data: Record<string, unknown>,
  fallbackPage = 1,
  fallbackLimit = 10
): PaginatedCommissions {
  const rawItems = data.items || data.pageItems || data.data || [];
  const pageItems = Array.isArray(rawItems)
    ? rawItems.map((item) => normalizeCommissionRecord(item as Record<string, unknown>))
    : [];

  const currentPage = Number(data.page ?? data.currentPage ?? fallbackPage);
  const pageSize = Number(data.limit ?? data.pageSize ?? fallbackLimit);
  const totalItems = Number(data.total ?? data.totalItems ?? pageItems.length);
  const numberOfPages = Number(data.totalPages ?? data.numberOfPages ?? Math.max(1, Math.ceil(totalItems / pageSize)));

  return {
    pageItems,
    currentPage,
    numberOfPages,
    totalItems,
    pageSize,
    hasMore: Boolean(data.hasMore ?? currentPage < numberOfPages),
  };
}
