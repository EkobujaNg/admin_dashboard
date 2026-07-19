import type {
  FacilityManagerAssistant,
  FacilityManagerRecord,
  PaginatedFacilityManagers,
} from "./types";

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
    isBlocked: Boolean(raw.isBlocked ?? raw.blocked),
    blockedAt: raw.blockedAt ? String(raw.blockedAt) : null,
    createdAt: String(raw.createdAt ?? ""),
  };
}

export function normalizeFacilityManagerAssistant(raw: Record<string, unknown>): FacilityManagerAssistant {
  const phoneNumber = (raw.phoneNumber as Record<string, unknown>) || {};
  const isBlocked = Boolean(raw.isBlocked ?? raw.blocked);

  return {
    id: String(raw.id ?? ""),
    firstName: String(raw.firstName ?? ""),
    lastName: String(raw.lastName ?? ""),
    email: String(raw.email ?? ""),
    phoneNumber: {
      code: String(phoneNumber.code ?? ""),
      number: String(phoneNumber.number ?? ""),
    },
    assignedPropertyCount: Number(
      raw.assignedPropertyCount ?? raw.propertyCount ?? raw.propertiesCount ?? 0
    ),
    isBlocked,
    status: String(raw.status ?? (isBlocked ? "blocked" : "active")).toLowerCase(),
    createdAt: raw.createdAt ? String(raw.createdAt) : null,
  };
}

export function normalizeFacilityManagerAssistants(
  data: Record<string, unknown> | unknown[]
): FacilityManagerAssistant[] {
  if (Array.isArray(data)) {
    return data.map((item) => normalizeFacilityManagerAssistant(item as Record<string, unknown>));
  }

  const rawItems = data.items || data.pageItems || data.assistants || data.data || [];
  if (!Array.isArray(rawItems)) return [];

  return rawItems.map((item) => normalizeFacilityManagerAssistant(item as Record<string, unknown>));
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
