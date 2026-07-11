export type WalletTransactionStatus = string;

export type WalletTransaction = {
  id: string;
  type: string;
  status: WalletTransactionStatus;
  title: string;
  description: string;
  amount: number;
  currency: string;
  action: string;
  provider: string;
  reference: string;
  providerReference: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  userId: string;
  userEmail: string;
  userName: string;
  propertyId: string | null;
  propertyName: string | null;
  metadata: Record<string, unknown>;
};

export type CommissionRecord = {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  propertyId: string;
  propertyName: string;
  amount: number;
  units: number;
  pricePerUnit: number;
  transactionId: string;
  createdAt: string | null;
};

export type PaginatedWalletTransactions = {
  pageItems: WalletTransaction[];
  currentPage: number;
  numberOfPages: number;
  totalItems: number;
  hasMore: boolean;
  pageSize: number;
};

export type PaginatedCommissions = {
  pageItems: CommissionRecord[];
  currentPage: number;
  numberOfPages: number;
  totalItems: number;
  hasMore: boolean;
  pageSize: number;
};

export type GetWalletTransactionsParams = {
  page?: number;
  limit?: number;
};

export type GetCommissionsParams = {
  page?: number;
  limit?: number;
  propertyId?: string;
};

export type PropertyMarketType = "primary" | "secondary";

export type PropertyMarketTransaction = {
  id: string;
  propertyId: string;
  propertyName: string;
  userId: string;
  userName: string;
  userEmail: string;
  units: number;
  amount: number;
  pricePerUnit: number;
  currency: string;
  status: string;
  type: string;
  title: string;
  description: string;
  action: string;
  provider: string;
  reference: string;
  providerReference: string | null;
  listingId: string | null;
  listerId: string | null;
  sharesAmount: number | null;
  commissionAmount: number | null;
  commissionPercent: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  market: PropertyMarketType;
};

export type PaginatedPropertyMarketTransactions = {
  pageItems: PropertyMarketTransaction[];
  currentPage: number;
  numberOfPages: number;
  totalItems: number;
  hasMore: boolean;
  pageSize: number;
};

export type GetPropertyMarketTransactionsParams = {
  propertyId: string;
  page?: number;
  limit?: number;
};
