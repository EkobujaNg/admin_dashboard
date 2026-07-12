import type {
  CommissionRecord,
  PaginatedCommissions,
  PaginatedPropertyMarketTransactions,
  PaginatedWalletTransactions,
  PropertyMarketTransaction,
  PropertyMarketType,
  WalletTransaction,
} from "./types";

function normalizeWalletTransaction(raw: Record<string, unknown>): WalletTransaction {
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

function normalizeCommissionRecord(raw: Record<string, unknown>): CommissionRecord {
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

function normalizePropertyMarketTransaction(
  raw: Record<string, unknown>,
  market: PropertyMarketType
): PropertyMarketTransaction {
  const metadata =
    raw.metadata && typeof raw.metadata === "object" ? (raw.metadata as Record<string, unknown>) : {};

  const units = Number(raw.units ?? metadata.units ?? raw.quantity ?? raw.numberOfShares ?? 0);
  const pricePerUnit = Number(
    raw.pricePerUnit ??
      metadata.pricePerUnit ??
      metadata.sharePrice ??
      raw.sharePrice ??
      raw.shareValue ??
      0
  );
  const amount = Number(
    raw.amount ??
      raw.totalAmount ??
      raw.totalPayable ??
      metadata.sharesAmount ??
      (units > 0 && pricePerUnit > 0 ? units * pricePerUnit : 0)
  );

  return {
    id: String(raw.id ?? raw.transactionId ?? ""),
    propertyId: String(raw.propertyId ?? metadata.propertyId ?? ""),
    propertyName: String(raw.propertyName ?? metadata.propertyName ?? raw.name ?? ""),
    userId: String(raw.userId ?? ""),
    userName: String(raw.userName ?? raw.fullName ?? ""),
    userEmail: String(raw.userEmail ?? raw.email ?? ""),
    units,
    amount,
    pricePerUnit,
    currency: String(raw.currency ?? "NGN"),
    status: String(raw.status ?? ""),
    type: String(raw.type ?? raw.transactionType ?? market),
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    action: String(raw.action ?? ""),
    provider: String(raw.provider ?? ""),
    reference: String(raw.reference ?? raw.txRef ?? raw.transactionId ?? ""),
    providerReference: raw.providerReference ? String(raw.providerReference) : null,
    listingId: metadata.listingId ? String(metadata.listingId) : null,
    listerId: metadata.listerId ? String(metadata.listerId) : null,
    sharesAmount: Number(metadata.sharesAmount ?? 0) || null,
    commissionAmount: Number(metadata.commissionAmount ?? 0) || null,
    commissionPercent: Number(metadata.commissionPercent ?? 0) || null,
    createdAt: raw.createdAt ? String(raw.createdAt) : raw.date ? String(raw.date) : null,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : null,
    market,
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

export function normalizePaginatedPropertyMarketTransactions(
  data: Record<string, unknown>,
  market: PropertyMarketType,
  fallbackPage = 1,
  fallbackLimit = 10
): PaginatedPropertyMarketTransactions {
  const rawItems = data.items || data.pageItems || data.data || [];
  const pageItems = Array.isArray(rawItems)
    ? rawItems.map((item) =>
        normalizePropertyMarketTransaction(item as Record<string, unknown>, market)
      )
    : [];

  const currentPage = Number(data.page ?? data.currentPage ?? fallbackPage);
  const pageSize = Number(data.limit ?? data.pageSize ?? fallbackLimit);
  const totalItems = Number(data.total ?? data.totalItems ?? data.totalCount ?? pageItems.length);
  const numberOfPages = Number(
    data.totalPages ?? data.numberOfPages ?? Math.max(1, Math.ceil(totalItems / Math.max(pageSize, 1)))
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
