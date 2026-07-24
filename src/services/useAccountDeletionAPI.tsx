import { useQuery } from "@tanstack/react-query";
import { getAccountDeletionRequests, getAccountDeletionRequest, AccountDeletionRequest } from "@/lib/account-deletion/api";

type Options = { page?: number; limit?: number; enable?: boolean; requestId?: string; enableDetail?: boolean };

export default function useAccountDeletionAPI({ page = 1, limit = 10, enable = false, requestId, enableDetail = false }: Options = {}) {
  const listQuery = useQuery({
    queryKey: ["admin-account-deletion-requests", page, limit],
    queryFn: () => getAccountDeletionRequests(page, limit),
    enabled: enable,
  });

  const detailQuery = useQuery({
    queryKey: ["admin-account-deletion-request", requestId],
    queryFn: () => getAccountDeletionRequest(requestId ?? ""),
    enabled: enableDetail && !!requestId,
  });

  return {
    items: listQuery.data?.items ?? [],
    meta: listQuery.data,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    refetch: listQuery.refetch,
    // detail
    detail: detailQuery.data as AccountDeletionRequest | undefined,
    isLoadingDetail: detailQuery.isLoading,
    refetchDetail: detailQuery.refetch,
  };
}
