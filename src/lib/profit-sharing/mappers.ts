import type {
  PaginatedProfitShareBreakdown,
  PaginatedProfitShareRecords,
  PaginatedProfitSharingStatuses,
  PaginatedUnownedProfitHistory,
  PendingLoadedShare,
  ProfitShareBreakdownEntry,
  ProfitShareRecord,
  ProfitSharingPropertyStatus,
  UnownedProfitHistoryEntry,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function normalizePaginationMeta(
  record: Record<string, unknown>,
  itemCount: number,
  fallbackPage: number,
  fallbackLimit: number
) {
  const currentPage = Number(record.page ?? record.currentPage ?? fallbackPage) || fallbackPage;
  const pageSize = Number(record.limit ?? record.pageSize ?? fallbackLimit) || fallbackLimit;
  const totalItems = Number(record.total ?? record.totalItems ?? itemCount) || itemCount;
  const numberOfPages =
    Number(record.totalPages ?? record.numberOfPages ?? Math.max(1, Math.ceil(totalItems / Math.max(pageSize, 1)))) ||
    1;

  return {
    currentPage,
    pageSize,
    totalItems,
    numberOfPages,
    hasMore: Boolean(record.hasMore ?? currentPage < numberOfPages),
  };
}

function extractItems(data: Record<string, unknown> | unknown[]): unknown[] {
  if (Array.isArray(data)) return data;
  const record = asRecord(data);
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.pageItems)) return record.pageItems;
  if (Array.isArray(record.data)) return record.data;
  return [];
}

export function normalizeUnownedProfitHistoryEntry(
  raw: Record<string, unknown>,
  index = 0
): UnownedProfitHistoryEntry {
  return {
    id: String(raw.profitShareId ?? raw.id ?? `unowned-history-${index}`),
    propertyId: raw.propertyId ? String(raw.propertyId) : null,
    propertyName: String(raw.propertyName ?? raw.property ?? "—"),
    section: raw.section != null && raw.section !== "" ? Number(raw.section) : null,
    year: raw.year != null && raw.year !== "" ? Number(raw.year) : null,
    loadedAmount: Number(raw.loadedAmount ?? raw.amount ?? 0),
    amountToProfitBalance: Number(
      raw.amountToProfitBalance ?? raw.unownedAmount ?? raw.creditedAmount ?? raw.amount ?? 0
    ),
    currency: String(raw.currency ?? "NGN"),
    distributedAt: raw.distributedAt
      ? String(raw.distributedAt)
      : raw.createdAt
        ? String(raw.createdAt)
        : raw.creditedAt
          ? String(raw.creditedAt)
          : null,
  };
}

export function normalizePaginatedUnownedProfitHistory(
  data: Record<string, unknown> | unknown[],
  fallbackPage = 1,
  fallbackLimit = 10
): PaginatedUnownedProfitHistory {
  if (Array.isArray(data)) {
    const pageItems = data.map((item, index) =>
      normalizeUnownedProfitHistoryEntry(asRecord(item), index)
    );
    return {
      pageItems,
      currentPage: fallbackPage,
      numberOfPages: 1,
      totalItems: pageItems.length,
      hasMore: false,
      pageSize: fallbackLimit,
    };
  }

  const record = asRecord(data);
  const rawItems = Array.isArray(record.items)
    ? record.items
    : Array.isArray(record.pageItems)
      ? record.pageItems
      : Array.isArray(record.data)
        ? record.data
        : [];

  const pageItems = rawItems.map((item, index) =>
    normalizeUnownedProfitHistoryEntry(asRecord(item), index)
  );
  const currentPage = Number(record.page ?? record.currentPage ?? fallbackPage) || fallbackPage;
  const pageSize = Number(record.limit ?? record.pageSize ?? fallbackLimit) || fallbackLimit;
  const totalItems = Number(record.total ?? record.totalItems ?? pageItems.length) || pageItems.length;
  const numberOfPages =
    Number(record.totalPages ?? record.numberOfPages ?? Math.max(1, Math.ceil(totalItems / Math.max(pageSize, 1)))) ||
    1;

  return {
    pageItems,
    currentPage,
    numberOfPages,
    totalItems,
    hasMore: Boolean(record.hasMore ?? currentPage < numberOfPages),
    pageSize,
  };
}

function normalizePendingLoadedShare(raw: unknown): PendingLoadedShare {
  if (!raw || typeof raw !== "object") return null;
  const data = asRecord(raw);
  return {
    id: data.id ? String(data.id) : null,
    propertyId: data.propertyId ? String(data.propertyId) : null,
    year: data.year != null && data.year !== "" ? Number(data.year) : null,
    section: data.section != null && data.section !== "" ? Number(data.section) : null,
    rate: data.rate != null && data.rate !== "" ? Number(data.rate) : null,
    amount: Number(data.amount ?? 0),
    status: data.status ? String(data.status) : null,
    loadedAt: data.loadedAt ? String(data.loadedAt) : null,
    distributedAt: data.distributedAt ? String(data.distributedAt) : null,
    amountDistributedToHolders:
      data.amountDistributedToHolders != null ? Number(data.amountDistributedToHolders) : null,
    amountToPlatformProfit:
      data.amountToPlatformProfit != null ? Number(data.amountToPlatformProfit) : null,
  };
}

export function normalizeProfitSharingPropertyStatus(
  raw: Record<string, unknown>
): ProfitSharingPropertyStatus {
  return {
    propertyId: String(raw.propertyId ?? ""),
    propertyName: String(raw.propertyName ?? "—"),
    profitSharingRate: Number(raw.profitSharingRate ?? 0),
    year: Number(raw.year ?? new Date().getFullYear()),
    currentSection: Number(raw.currentSection ?? 0),
    nextSectionToLoad:
      raw.nextSectionToLoad != null && raw.nextSectionToLoad !== ""
        ? Number(raw.nextSectionToLoad)
        : null,
    canLoadNextSection: Boolean(raw.canLoadNextSection),
    canChangeRate: Boolean(raw.canChangeRate),
    pendingLoadedShare: normalizePendingLoadedShare(raw.pendingLoadedShare),
  };
}

export function normalizePaginatedProfitSharingStatuses(
  data: Record<string, unknown> | unknown[],
  fallbackPage = 1,
  fallbackLimit = 10
): PaginatedProfitSharingStatuses {
  if (Array.isArray(data)) {
    const pageItems = data.map((item) => normalizeProfitSharingPropertyStatus(asRecord(item)));
    return {
      pageItems,
      currentPage: fallbackPage,
      numberOfPages: 1,
      totalItems: pageItems.length,
      hasMore: false,
      pageSize: fallbackLimit,
    };
  }

  const record = asRecord(data);
  const rawItems = Array.isArray(record.items)
    ? record.items
    : Array.isArray(record.pageItems)
      ? record.pageItems
      : Array.isArray(record.data)
        ? record.data
        : [];

  const pageItems = rawItems.map((item) => normalizeProfitSharingPropertyStatus(asRecord(item)));
  const currentPage = Number(record.page ?? record.currentPage ?? fallbackPage) || fallbackPage;
  const pageSize = Number(record.limit ?? record.pageSize ?? fallbackLimit) || fallbackLimit;
  const totalItems = Number(record.total ?? record.totalItems ?? pageItems.length) || pageItems.length;
  const numberOfPages =
    Number(record.totalPages ?? record.numberOfPages ?? Math.max(1, Math.ceil(totalItems / Math.max(pageSize, 1)))) ||
    1;

  return {
    pageItems,
    currentPage,
    numberOfPages,
    totalItems,
    hasMore: Boolean(record.hasMore ?? currentPage < numberOfPages),
    pageSize,
  };
}

export function normalizeProfitShareRecord(
  raw: Record<string, unknown>,
  index = 0
): ProfitShareRecord {
  return {
    id: String(raw.id ?? `profit-share-${index}`),
    propertyId: raw.propertyId ? String(raw.propertyId) : null,
    year: raw.year != null && raw.year !== "" ? Number(raw.year) : null,
    section: raw.section != null && raw.section !== "" ? Number(raw.section) : null,
    rate: raw.rate != null && raw.rate !== "" ? Number(raw.rate) : null,
    amount: Number(raw.amount ?? 0),
    status: String(raw.status ?? "—"),
    loadedAt: raw.loadedAt ? String(raw.loadedAt) : null,
    distributedAt: raw.distributedAt ? String(raw.distributedAt) : null,
    amountDistributedToHolders:
      raw.amountDistributedToHolders != null ? Number(raw.amountDistributedToHolders) : null,
    amountToPlatformProfit:
      raw.amountToPlatformProfit != null ? Number(raw.amountToPlatformProfit) : null,
  };
}

export function normalizePaginatedProfitShareRecords(
  data: Record<string, unknown> | unknown[],
  fallbackPage = 1,
  fallbackLimit = 10
): PaginatedProfitShareRecords {
  const rawItems = extractItems(data);
  const pageItems = rawItems.map((item, index) => normalizeProfitShareRecord(asRecord(item), index));
  const meta = normalizePaginationMeta(asRecord(data), pageItems.length, fallbackPage, fallbackLimit);
  return { pageItems, ...meta };
}

export function normalizeProfitShareBreakdownEntry(
  raw: Record<string, unknown>,
  index = 0
): ProfitShareBreakdownEntry {
  return {
    id: String(raw.id ?? raw.profitShareId ?? `breakdown-${index}`),
    profitShareId: raw.profitShareId ? String(raw.profitShareId) : null,
    propertyId: raw.propertyId ? String(raw.propertyId) : null,
    userId: raw.userId ? String(raw.userId) : null,
    holderName: String(raw.holderName ?? raw.userName ?? raw.fullName ?? raw.name ?? "—"),
    holderEmail: raw.holderEmail
      ? String(raw.holderEmail)
      : raw.userEmail
        ? String(raw.userEmail)
        : raw.email
          ? String(raw.email)
          : null,
    isPlatformAccount: Boolean(raw.isPlatformAccount),
    isUnownedRemainder: Boolean(raw.isUnownedRemainder),
    year: raw.year != null && raw.year !== "" ? Number(raw.year) : null,
    section: raw.section != null && raw.section !== "" ? Number(raw.section) : null,
    units: raw.units != null && raw.units !== "" ? Number(raw.units) : null,
    amount: Number(raw.amount ?? raw.amountReceived ?? 0),
    distributedAt: raw.distributedAt
      ? String(raw.distributedAt)
      : raw.createdAt
        ? String(raw.createdAt)
        : null,
  };
}

export function normalizePaginatedProfitShareBreakdown(
  data: Record<string, unknown> | unknown[],
  fallbackPage = 1,
  fallbackLimit = 10
): PaginatedProfitShareBreakdown {
  const rawItems = extractItems(data);
  const pageItems = rawItems.map((item, index) =>
    normalizeProfitShareBreakdownEntry(asRecord(item), index)
  );
  const meta = normalizePaginationMeta(asRecord(data), pageItems.length, fallbackPage, fallbackLimit);
  return { pageItems, ...meta };
}
