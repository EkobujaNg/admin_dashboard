export type WithdrawalStatus = "pending" | "completed" | "rejected";

export type WithdrawalStatusFilter = "all" | WithdrawalStatus;

export type WithdrawalRequest = {
  id: string;
  amount: number;
  currency: string;
  status: WithdrawalStatus | string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  rejectionReason: string | null;
  reviewedByAdminId: string | null;
  reviewedAt: string | null;
  createdAt: string | null;
  userId: string;
  userEmail: string;
  userName: string;
};

export type WithdrawalStats = {
  all: number;
  pending: number;
  completed: number;
  rejected: number;
};

export type PaginatedWithdrawalRequests = {
  pageItems: WithdrawalRequest[];
  currentPage: number;
  numberOfPages: number;
  totalItems: number;
  hasMore: boolean;
};

export type GetWithdrawalRequestsParams = {
  page?: number;
  limit?: number;
  status?: WithdrawalStatus;
};

export type RejectWithdrawalPayload = {
  reason: string;
};
