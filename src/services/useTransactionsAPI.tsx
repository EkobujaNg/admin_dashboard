import { useQuery } from "@tanstack/react-query";
import { getCommissionRecords, getWalletTransactions } from "@/lib/transactions/api";

type UseTransactionsAPIOptions = {
  page?: number;
  limit?: number;
  propertyId?: string;
  enableWalletTransactions?: boolean;
  enableCommissions?: boolean;
};

export const useTransactionsAPI = ({
  page = 1,
  limit = 10,
  propertyId = "",
  enableWalletTransactions = false,
  enableCommissions = false,
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

  const wallet = walletQuery.data;
  const commissions = commissionsQuery.data;

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
  };
};

export default useTransactionsAPI;
