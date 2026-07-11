import { useQuery } from "@tanstack/react-query";
import {
  getCommissionRecords,
  getPrimaryMarketPropertyTransactions,
  getSecondaryMarketPropertyTransactions,
  getWalletTransactions,
} from "@/lib/transactions/api";
import type { PropertyMarketType } from "@/lib/transactions/types";

type UseTransactionsAPIOptions = {
  page?: number;
  limit?: number;
  propertyId?: string;
  market?: PropertyMarketType;
  enableWalletTransactions?: boolean;
  enableCommissions?: boolean;
  enablePropertyMarketTransactions?: boolean;
};

export const useTransactionsAPI = ({
  page = 1,
  limit = 10,
  propertyId = "",
  market = "primary",
  enableWalletTransactions = false,
  enableCommissions = false,
  enablePropertyMarketTransactions = false,
}: UseTransactionsAPIOptions = {}) => {
  const walletQuery = useQuery({
    queryKey: ["admin-wallet-transactions", page, limit],
    queryFn: () => getWalletTransactions({ page, limit }),
    enabled: enableWalletTransactions,
  });

  const commissionsQuery = useQuery({
    queryKey: ["admin-commission-records", page, limit, propertyId || "all"],
    queryFn: () =>
      getCommissionRecords({
        page,
        limit,
        ...(propertyId ? { propertyId } : {}),
      }),
    enabled: enableCommissions,
  });

  const propertyMarketQuery = useQuery({
    queryKey: ["admin-property-market-transactions", market, propertyId, page, limit],
    queryFn: () =>
      market === "secondary"
        ? getSecondaryMarketPropertyTransactions({ propertyId, page, limit })
        : getPrimaryMarketPropertyTransactions({ propertyId, page, limit }),
    enabled: enablePropertyMarketTransactions && Boolean(propertyId),
  });

  const wallet = walletQuery.data;
  const commissions = commissionsQuery.data;
  const propertyMarket = propertyMarketQuery.data;

  return {
    walletTransactions: wallet?.pageItems ?? [],
    walletMeta: {
      totalRecords: wallet?.totalItems ?? 0,
      totalPages: wallet?.numberOfPages ?? 1,
      pageNumber: wallet?.currentPage ?? page,
      pageSize: wallet?.pageSize ?? limit,
      hasMore: wallet?.hasMore ?? false,
    },
    isLoadingWalletTransactions: walletQuery.isLoading,
    walletTransactionsError: walletQuery.error,

    commissions: commissions?.pageItems ?? [],
    commissionsMeta: {
      totalRecords: commissions?.totalItems ?? 0,
      totalPages: commissions?.numberOfPages ?? 1,
      pageNumber: commissions?.currentPage ?? page,
      pageSize: commissions?.pageSize ?? limit,
      hasMore: commissions?.hasMore ?? false,
    },
    isLoadingCommissions: commissionsQuery.isLoading,
    commissionsError: commissionsQuery.error,

    propertyMarketTransactions: propertyMarket?.pageItems ?? [],
    propertyMarketMeta: {
      totalRecords: propertyMarket?.totalItems ?? 0,
      totalPages: propertyMarket?.numberOfPages ?? 1,
      pageNumber: propertyMarket?.currentPage ?? page,
      pageSize: propertyMarket?.pageSize ?? limit,
      hasMore: propertyMarket?.hasMore ?? false,
    },
    isLoadingPropertyMarketTransactions: propertyMarketQuery.isLoading,
    propertyMarketTransactionsError: propertyMarketQuery.error,
  };
};

export default useTransactionsAPI;
