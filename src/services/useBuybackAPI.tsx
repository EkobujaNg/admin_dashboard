import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  approveBuybackRequest,
  declineBuybackRequest,
  getBuybackErrorMessage,
  getBuybackRequestById,
  getBuybackRequests,
} from "@/lib/buyback/api";
import type { BuybackStatusFilter } from "@/lib/buyback/types";

type UseBuybackAPIOptions = {
  page?: number;
  limit?: number;
  status?: BuybackStatusFilter;
  requestId?: string;
  enableList?: boolean;
  enableDetail?: boolean;
};

export const useBuybackAPI = ({
  page = 1,
  limit = 10,
  status = "all",
  requestId = "",
  enableList = false,
  enableDetail = false,
}: UseBuybackAPIOptions = {}) => {
  const queryClient = useQueryClient();
  const statusFilter = status !== "all" ? status : undefined;

  const requestsQuery = useQuery({
    queryKey: ["admin-buyback-requests", page, limit, statusFilter ?? "all"],
    queryFn: () =>
      getBuybackRequests({
        page,
        limit,
        status: statusFilter,
      }),
    enabled: enableList,
  });

  const detailQuery = useQuery({
    queryKey: ["admin-buyback-request", requestId],
    queryFn: () => getBuybackRequestById(requestId),
    enabled: enableDetail && Boolean(requestId),
  });

  const invalidateRequests = (id?: string) => {
    queryClient.invalidateQueries({ queryKey: ["admin-buyback-requests"] });
    queryClient.invalidateQueries({ queryKey: ["admin-app-wallet-balance"] });
    if (id) {
      queryClient.invalidateQueries({ queryKey: ["admin-buyback-request", id] });
    }
  };

  const approveMutation = useMutation({
    mutationFn: approveBuybackRequest,
    onSuccess: (_data, id) => invalidateRequests(id),
  });

  const declineMutation = useMutation({
    mutationFn: declineBuybackRequest,
    onSuccess: (_data, id) => invalidateRequests(id),
  });

  const approveRequest = (
    id: string,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    approveMutation.mutate(id, {
      onSuccess: (data) => {
        toast.success("Buyback request approved.");
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        toast.error(getBuybackErrorMessage(error, "Failed to approve buyback request."));
        options?.onError?.(error);
      },
    });
  };

  const declineRequest = (
    id: string,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    declineMutation.mutate(id, {
      onSuccess: (data) => {
        toast.success("Buyback request declined.");
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        toast.error(getBuybackErrorMessage(error, "Failed to decline buyback request."));
        options?.onError?.(error);
      },
    });
  };

  const paginated = requestsQuery.data;

  return {
    requests: paginated?.pageItems ?? [],
    requestsMeta: {
      totalRecords: paginated?.totalItems ?? 0,
      totalPages: paginated?.numberOfPages ?? 1,
      pageNumber: paginated?.currentPage ?? page,
      pageSize: paginated?.pageSize ?? limit,
      hasMore: paginated?.hasMore ?? false,
    },
    isLoadingRequests: requestsQuery.isLoading,
    requestsError: requestsQuery.error,

    requestDetail: detailQuery.data,
    isLoadingRequestDetail: detailQuery.isLoading,
    requestDetailError: detailQuery.error,

    approveRequest,
    declineRequest,
    isApprovingRequest: approveMutation.isPending,
    isDecliningRequest: declineMutation.isPending,
  };
};

export default useBuybackAPI;
