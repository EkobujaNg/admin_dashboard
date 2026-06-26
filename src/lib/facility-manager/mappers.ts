import type { FacilityManagerRecord, PaginatedFacilityManagers } from "./types";

export function normalizeFacilityManager(raw: Record<string, unknown>): FacilityManagerRecord {
  const phoneNumber = (raw.phoneNumber as Record<string, unknown>) || {};

  return {
    id: String(raw.id ?? ""),
    userId: String(raw.userId ?? ""),
    firstName: String(raw.firstName ?? ""),
    lastName: String(raw.lastName ?? ""),
    email: String(raw.email ?? ""),
    phoneNumber: {
      code: String(phoneNumber.code ?? ""),
      number: String(phoneNumber.number ?? ""),
    },
    idCard: String(raw.idCard ?? ""),
    createdAt: String(raw.createdAt ?? ""),
  };
}

export function normalizePaginatedFacilityManagers(data: Record<string, unknown>): PaginatedFacilityManagers {
  const rawItems = data.pageItems || data.items || data.data || [];
  const pageItems = Array.isArray(rawItems)
    ? rawItems.map((item) => normalizeFacilityManager(item as Record<string, unknown>))
    : [];

  return {
    pageItems,
    currentPage: Number(data.currentPage ?? data.pageNumber ?? data.page ?? 1),
    numberOfPages: Number(data.numberOfPages ?? data.totalPages ?? 1),
    totalItems: Number(data.totalItems ?? data.totalCount ?? data.total ?? pageItems.length),
    hasMore: Boolean(data.hasMore),
  };
}
