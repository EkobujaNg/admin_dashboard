export type UnownedProfitHistoryEntry = {
  id: string;
  propertyId: string | null;
  propertyName: string;
  section: number | null;
  year: number | null;
  loadedAmount: number;
  amountToProfitBalance: number;
  currency: string;
  distributedAt: string | null;
};

export type PaginatedUnownedProfitHistory = {
  pageItems: UnownedProfitHistoryEntry[];
  currentPage: number;
  numberOfPages: number;
  totalItems: number;
  hasMore: boolean;
  pageSize: number;
};

export type GetUnownedProfitHistoryParams = {
  page?: number;
  limit?: number;
  propertyName?: string;
};

export type PendingLoadedShare = {
  id: string | null;
  propertyId: string | null;
  year: number | null;
  section: number | null;
  rate: number | null;
  amount: number;
  status: string | null;
  loadedAt: string | null;
  distributedAt: string | null;
  amountDistributedToHolders: number | null;
  amountToPlatformProfit: number | null;
} | null;

export type ProfitSharingPropertyStatus = {
  propertyId: string;
  propertyName: string;
  profitSharingRate: number;
  year: number;
  currentSection: number;
  nextSectionToLoad: number | null;
  canLoadNextSection: boolean;
  canChangeRate: boolean;
  pendingLoadedShare: PendingLoadedShare;
};

export type PaginatedProfitSharingStatuses = {
  pageItems: ProfitSharingPropertyStatus[];
  currentPage: number;
  numberOfPages: number;
  totalItems: number;
  hasMore: boolean;
  pageSize: number;
};

export type GetProfitSharingStatusesParams = {
  page?: number;
  limit?: number;
  name?: string;
};

export type LoadProfitSharePayload = {
  amount: number;
};

export type UpdateProfitSharingRatePayload = {
  profitSharingRate: 1 | 2 | 3 | 4 | 6 | 12;
};

export const PROFIT_SHARING_RATE_OPTIONS: Array<{
  value: UpdateProfitSharingRatePayload["profitSharingRate"];
  label: string;
}> = [
  { value: 1, label: "1 — Once a year" },
  { value: 2, label: "2 — Every 6 months" },
  { value: 3, label: "3 — Every 4 months" },
  { value: 4, label: "4 — Quarterly" },
  { value: 6, label: "6 — Every 2 months" },
  { value: 12, label: "12 — Monthly" },
];

export type ProfitShareRecord = {
  id: string;
  propertyId: string | null;
  year: number | null;
  section: number | null;
  rate: number | null;
  amount: number;
  status: string;
  loadedAt: string | null;
  distributedAt: string | null;
  amountDistributedToHolders: number | null;
  amountToPlatformProfit: number | null;
};

export type PaginatedProfitShareRecords = {
  pageItems: ProfitShareRecord[];
  currentPage: number;
  numberOfPages: number;
  totalItems: number;
  hasMore: boolean;
  pageSize: number;
};

export type GetProfitShareRecordsParams = {
  propertyId: string;
  page?: number;
  limit?: number;
  year?: number;
};

export type ProfitShareBreakdownEntry = {
  id: string;
  profitShareId: string | null;
  propertyId: string | null;
  userId: string | null;
  holderName: string;
  holderEmail: string | null;
  isPlatformAccount: boolean;
  isUnownedRemainder: boolean;
  year: number | null;
  section: number | null;
  units: number | null;
  amount: number;
  distributedAt: string | null;
};

export type PaginatedProfitShareBreakdown = {
  pageItems: ProfitShareBreakdownEntry[];
  currentPage: number;
  numberOfPages: number;
  totalItems: number;
  hasMore: boolean;
  pageSize: number;
};

export type GetProfitShareBreakdownParams = {
  propertyId: string;
  page?: number;
  limit?: number;
  year?: number;
  section?: number;
};
