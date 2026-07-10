import type {
  PaginatedWithdrawalRequests,
  WithdrawalRequest,
  WithdrawalStats,
  WithdrawalStatus,
} from "./types";

function normalizeStatus(raw: unknown): WithdrawalStatus | string {
  const status = String(raw ?? "pending").toLowerCase();
  if (status === "pending" || status === "completed" || status === "rejected") {
    return status;
  }
  return status || "pending";
}

export function normalizeWithdrawalRequest(raw: Record<string, unknown>): WithdrawalRequest {
  return {
    id: String(raw.id ?? ""),
    amount: Number(raw.amount ?? 0),
    currency: String(raw.currency ?? "NGN"),
    status: normalizeStatus(raw.status),
    bankName: String(raw.bankName ?? ""),
    accountName: String(raw.accountName ?? ""),
    accountNumber: String(raw.accountNumber ?? ""),
    rejectionReason: raw.rejectionReason ? String(raw.rejectionReason) : null,
    reviewedByAdminId: raw.reviewedByAdminId ? String(raw.reviewedByAdminId) : null,
    reviewedAt: raw.reviewedAt ? String(raw.reviewedAt) : null,
    createdAt: raw.createdAt ? String(raw.createdAt) : null,
    userId: String(raw.userId ?? ""),
    userEmail: String(raw.userEmail ?? ""),
    userName: String(raw.userName ?? ""),
  };
}

export function normalizeWithdrawalStats(raw: Record<string, unknown>): WithdrawalStats {
  return {
    all: Number(raw.all ?? raw.total ?? raw.allRequests ?? 0),
    pending: Number(raw.pending ?? raw.pendingRequests ?? 0),
    completed: Number(raw.completed ?? raw.completedRequests ?? 0),
    rejected: Number(raw.rejected ?? raw.rejectedRequests ?? 0),
  };
}

export function normalizePaginatedWithdrawalRequests(
  data: Record<string, unknown> | unknown[],
  fallbackPage = 1,
  fallbackLimit = 10
): PaginatedWithdrawalRequests {
  if (Array.isArray(data)) {
    const pageItems = data.map((item) => normalizeWithdrawalRequest(item as Record<string, unknown>));
    return {
      pageItems,
      currentPage: fallbackPage,
      numberOfPages: 1,
      totalItems: pageItems.length,
      hasMore: false,
    };
  }

  const rawItems = data.pageItems || data.items || data.data || data.requests || [];
  const pageItems = Array.isArray(rawItems)
    ? rawItems.map((item) => normalizeWithdrawalRequest(item as Record<string, unknown>))
    : [];

  const currentPage = Number(data.page ?? data.currentPage ?? data.pageNumber ?? fallbackPage);
  const totalItems = Number(data.total ?? data.totalItems ?? data.totalCount ?? pageItems.length);
  const numberOfPages = Number(
    data.totalPages ?? data.numberOfPages ?? Math.max(1, Math.ceil(totalItems / fallbackLimit))
  );

  return {
    pageItems,
    currentPage,
    numberOfPages,
    totalItems,
    hasMore: Boolean(data.hasMore ?? currentPage < numberOfPages),
  };
}
