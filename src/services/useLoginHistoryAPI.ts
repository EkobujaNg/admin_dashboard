import { useQuery } from "@tanstack/react-query";
import { getLoginHistory } from "@/lib/auth/api";

type UseLoginHistoryAPIOptions = {
  enabled?: boolean;
  page?: number;
  limit?: number;
};

export default function useLoginHistoryAPI({
  enabled = true,
  page = 1,
  limit = 10,
}: UseLoginHistoryAPIOptions = {}) {
  const query = useQuery({
    queryKey: ["login-history", page, limit],
    queryFn: () => getLoginHistory(page, limit),
    enabled,
  });

  return {
    history: query.data,
    items: query.data?.items ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    page: query.data?.page ?? page,
    limit: query.data?.limit ?? limit,
    total: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    hasMore: query.data?.hasMore ?? false,
  };
}
