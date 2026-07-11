import type { AdminAccount, AdminRole, PaginatedAdmins } from "./types";

const VALID_ROLES = new Set<AdminRole>(["super_admin", "admin", "moderator", "finance"]);

function normalizeRoles(raw: unknown): AdminRole[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(String)
    .filter((role): role is AdminRole => VALID_ROLES.has(role as AdminRole));
}

export function normalizeAdminAccount(raw: Record<string, unknown>): AdminAccount {
  const phoneNumber = (raw.phoneNumber as Record<string, unknown>) || {};

  return {
    id: String(raw.id ?? ""),
    firstName: String(raw.firstName ?? ""),
    lastName: String(raw.lastName ?? ""),
    email: String(raw.email ?? ""),
    phoneNumber: {
      code: String(phoneNumber.code ?? ""),
      number: String(phoneNumber.number ?? ""),
    },
    roles: normalizeRoles(raw.roles),
    isBlocked: Boolean(raw.isBlocked ?? raw.blocked),
    createdAt: raw.createdAt ? String(raw.createdAt) : null,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : null,
  };
}

export function normalizePaginatedAdmins(
  data: Record<string, unknown>,
  fallbackPage = 1,
  fallbackLimit = 10
): PaginatedAdmins {
  const rawItems = data.pageItems || data.items || data.data || data.admins || [];
  const pageItems = Array.isArray(rawItems)
    ? rawItems.map((item) => normalizeAdminAccount(item as Record<string, unknown>))
    : [];

  const currentPage = Number(data.currentPage ?? data.pageNumber ?? data.page ?? fallbackPage);
  const pageSize = Number(data.limit ?? data.pageSize ?? fallbackLimit);
  const totalItems = Number(data.totalItems ?? data.totalCount ?? data.total ?? pageItems.length);
  const numberOfPages = Number(
    data.numberOfPages ?? data.totalPages ?? Math.max(1, Math.ceil(totalItems / Math.max(pageSize, 1)))
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
