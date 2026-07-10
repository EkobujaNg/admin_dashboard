import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  completeWithdrawalRequest,
  getWithdrawalErrorMessage,
  getWithdrawalRequestById,
  getWithdrawalRequests,
  getWithdrawalStats,
  rejectWithdrawalRequest,
} from "@/lib/withdrawals/api";
import type { RejectWithdrawalPayload, WithdrawalStatusFilter } from "@/lib/withdrawals/types";

type UseWithdrawalsAPIOptions = {
  page?: number;
  limit?: number;
  status?: WithdrawalStatusFilter;
  requestId?: string;
  enableList?: boolean;
  enableStats?: boolean;
  enableDetail?: boolean;
};

export const useWithdrawalsAPI = ({
  page = 1,
  limit = 10,
  status = "all",
  requestId = "",
  enableList = false,
  enableStats = false,
  enableDetail = false,
}: UseWithdrawalsAPIOptions = {}) => {
  const queryClient = useQueryClient();
  const statusFilter = status !== "all" ? status : undefined;

  const requestsQuery = useQuery({
    queryKey: ["admin-withdrawal-requests", page, limit, statusFilter ?? "all"],
    queryFn: () =>
      getWithdrawalRequests({
        page,
        limit,
        status: statusFilter,
      }),
    enabled: enableList,
  });

  const statsQuery = useQuery({
    queryKey: ["admin-withdrawal-stats"],
    queryFn: getWithdrawalStats,
    enabled: enableStats,
  });

  const detailQuery = useQuery({
    queryKey: ["admin-withdrawal-request", requestId],
    queryFn: () => getWithdrawalRequestById(requestId),
    enabled: enableDetail && Boolean(requestId),
  });

  const invalidateRequests = (id?: string) => {
    queryClient.invalidateQueries({ queryKey: ["admin-withdrawal-requests"] });
    queryClient.invalidateQueries({ queryKey: ["admin-withdrawal-stats"] });
    if (id) {
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawal-request", id] });
    }
  };

  const completeMutation = useMutation({
    mutationFn: completeWithdrawalRequest,
    onSuccess: (_data, id) => invalidateRequests(id),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RejectWithdrawalPayload }) =>
      rejectWithdrawalRequest(id, payload),
    onSuccess: (_data, variables) => invalidateRequests(variables.id),
  });

  const completeRequest = (
    id: string,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    completeMutation.mutate(id, {
      onSuccess: (data) => {
        toast.success("Withdrawal marked as completed.");
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        toast.error(getWithdrawalErrorMessage(error, "Failed to complete withdrawal."));
        options?.onError?.(error);
      },
    });
  };

  const rejectRequest = (
    id: string,
    payload: RejectWithdrawalPayload,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    rejectMutation.mutate(
      { id, payload },
      {
        onSuccess: (data) => {
          toast.success("Withdrawal rejected.");
          options?.onSuccess?.(data);
        },
        onError: (error) => {
          toast.error(getWithdrawalErrorMessage(error, "Failed to reject withdrawal."));
          options?.onError?.(error);
        },
      }
    );
  };

  const paginated = requestsQuery.data;

  return {
    requests: paginated?.pageItems ?? [],
    requestsMeta: {
      totalRecords: paginated?.totalItems ?? 0,
      totalPages: paginated?.numberOfPages ?? 1,
      pageNumber: paginated?.currentPage ?? page,
      pageSize: limit,
      hasMore: paginated?.hasMore ?? false,
    },
    isLoadingRequests: requestsQuery.isLoading,
    requestsError: requestsQuery.error,
    refetchRequests: requestsQuery.refetch,

    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,
    statsError: statsQuery.error,

    requestDetail: detailQuery.data,
    isLoadingRequestDetail: detailQuery.isLoading,
    requestDetailError: detailQuery.error,

    completeRequest,
    rejectRequest,
    isCompletingRequest: completeMutation.isPending,
    isRejectingRequest: rejectMutation.isPending,
  };
};

export default useWithdrawalsAPI;
