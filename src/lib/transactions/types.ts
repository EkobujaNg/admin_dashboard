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
