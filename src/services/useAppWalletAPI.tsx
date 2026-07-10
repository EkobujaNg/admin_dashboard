import { useQuery } from "@tanstack/react-query";
import { getAppWalletBalance } from "@/lib/app-wallet/api";

type UseAppWalletAPIOptions = {
  enableBalance?: boolean;
};

export const useAppWalletAPI = ({ enableBalance = false }: UseAppWalletAPIOptions = {}) => {
  const balanceQuery = useQuery({
    queryKey: ["admin-app-wallet-balance"],
    queryFn: getAppWalletBalance,
    enabled: enableBalance,
  });

  return {
    balance: balanceQuery.data,
    isLoadingBalance: balanceQuery.isLoading,
    balanceError: balanceQuery.error,
    refetchBalance: balanceQuery.refetch,
  };
};

export default useAppWalletAPI;
