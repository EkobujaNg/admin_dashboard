export type BuybackStatus = "pending" | "approved" | "declined";

export type BuybackStatusFilter = "all" | BuybackStatus;

export type BuybackRequest = {
  id: string;
  holdingId: string;
  propertyId: string;
  propertyName: string;
  units: number;
  shareValue: number;
  ekobujaBuyBackPercent: number;
  buybackRatePerUnit: number;
  totalAmount: number;
  availableUnits: number;
  status: BuybackStatus | string;
  createdAt: string | null;
  userId?: string;
  userEmail?: string;
  userName?: string;
};

export type PaginatedBuybackRequests = {
  pageItems: BuybackRequest[];
  currentPage: number;
  numberOfPages: number;
  totalItems: number;
  hasMore: boolean;
  pageSize: number;
};

export type GetBuybackRequestsParams = {
  page?: number;
  limit?: number;
  status?: BuybackStatus;
};
