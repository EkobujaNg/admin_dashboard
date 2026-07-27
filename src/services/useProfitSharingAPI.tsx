import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  distributeProfitShare,
  getProfitShareBreakdown,
  getProfitShareRecords,
  getProfitSharingErrorMessage,
  getProfitSharingStatuses,
  getPropertyProfitSharingStatus,
  getUnownedProfitHistory,
  initiateDistributeProfitShare,
  initiateLoadProfitShare,
  loadProfitShare,
  updateProfitSharingRate,
} from "@/lib/profit-sharing/api";
import type {
  ConfirmDistributeProfitSharePayload,
  InitiateLoadProfitSharePayload,
  LoadProfitSharePayload,
  UpdateProfitSharingRatePayload,
} from "@/lib/profit-sharing/types";

type UseProfitSharingAPIOptions = {
  page?: number;
  limit?: number;
  propertyName?: string;
  name?: string;
  propertyId?: string;
  year?: number;
  section?: number;
  enableUnownedHistory?: boolean;
  enableStatuses?: boolean;
  enablePropertyStatus?: boolean;
  enableRecords?: boolean;
  enableBreakdown?: boolean;
};

export default function useProfitSharingAPI({
  page = 1,
  limit = 10,
  propertyName = "",
  name = "",
  propertyId = "",
  year,
  section,
  enableUnownedHistory = false,
  enableStatuses = false,
  enablePropertyStatus = false,
  enableRecords = false,
  enableBreakdown = false,
}: UseProfitSharingAPIOptions = {}) {
  const queryClient = useQueryClient();

  const unownedHistoryQuery = useQuery({
    queryKey: ["admin-unowned-profit-history", page, limit, propertyName.trim() || "all"],
    queryFn: () =>
      getUnownedProfitHistory({
        page,
        limit,
        ...(propertyName.trim() ? { propertyName: propertyName.trim() } : {}),
      }),
    enabled: enableUnownedHistory,
  });

  const statusesQuery = useQuery({
    queryKey: ["admin-profit-sharing-statuses", page, limit, name.trim() || "all"],
    queryFn: () =>
      getProfitSharingStatuses({
        page,
        limit,
        ...(name.trim() ? { name: name.trim() } : {}),
      }),
    enabled: enableStatuses,
  });

  const propertyStatusQuery = useQuery({
    queryKey: ["admin-profit-sharing-property-status", propertyId],
    queryFn: () => getPropertyProfitSharingStatus(propertyId),
    enabled: enablePropertyStatus && Boolean(propertyId),
  });

  const recordsQuery = useQuery({
    queryKey: ["admin-profit-share-records", propertyId, page, limit, year ?? "all"],
    queryFn: () =>
      getProfitShareRecords({
        propertyId,
        page,
        limit,
        ...(year != null ? { year } : {}),
      }),
    enabled: enableRecords && Boolean(propertyId),
  });

  const breakdownQuery = useQuery({
    queryKey: [
      "admin-profit-share-breakdown",
      propertyId,
      page,
      limit,
      year ?? "all",
      section ?? "all",
    ],
    queryFn: () =>
      getProfitShareBreakdown({
        propertyId,
        page,
        limit,
        ...(year != null ? { year } : {}),
        ...(section != null ? { section } : {}),
      }),
    enabled: enableBreakdown && Boolean(propertyId),
  });

  const invalidatePropertyQueries = (id: string) => {
    queryClient.invalidateQueries({ queryKey: ["admin-profit-sharing-statuses"] });
    queryClient.invalidateQueries({ queryKey: ["admin-profit-sharing-property-status", id] });
    queryClient.invalidateQueries({ queryKey: ["admin-profit-share-records", id] });
    queryClient.invalidateQueries({ queryKey: ["admin-profit-share-breakdown", id] });
    queryClient.invalidateQueries({ queryKey: ["admin-app-wallet-balance"] });
    queryClient.invalidateQueries({ queryKey: ["admin-unowned-profit-history"] });
  };

  const initiateLoadMutation = useMutation({
    mutationFn: ({
      propertyId: id,
      payload,
    }: {
      propertyId: string;
      payload: InitiateLoadProfitSharePayload;
    }) => initiateLoadProfitShare(id, payload),
  });

  const loadMutation = useMutation({
    mutationFn: ({ propertyId: id, payload }: { propertyId: string; payload: LoadProfitSharePayload }) =>
      loadProfitShare(id, payload),
    onSuccess: (_data, variables) => invalidatePropertyQueries(variables.propertyId),
  });

  const initiateDistributeMutation = useMutation({
    mutationFn: (id: string) => initiateDistributeProfitShare(id),
  });

  const distributeMutation = useMutation({
    mutationFn: ({
      propertyId: id,
      payload,
    }: {
      propertyId: string;
      payload: ConfirmDistributeProfitSharePayload;
    }) => distributeProfitShare(id, payload),
    onSuccess: (_data, variables) => invalidatePropertyQueries(variables.propertyId),
  });

  const updateRateMutation = useMutation({
    mutationFn: ({
      propertyId: id,
      payload,
    }: {
      propertyId: string;
      payload: UpdateProfitSharingRatePayload;
    }) => updateProfitSharingRate(id, payload),
    onSuccess: (_data, variables) => invalidatePropertyQueries(variables.propertyId),
  });

  const statuses = statusesQuery.data;
  const unowned = unownedHistoryQuery.data;
  const records = recordsQuery.data;
  const breakdown = breakdownQuery.data;

  const initiateLoad = (
    id: string,
    payload: InitiateLoadProfitSharePayload,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    initiateLoadMutation.mutate(
      { propertyId: id, payload },
      {
        onSuccess: (data) => {
          toast.success("OTP sent to super admin email.");
          options?.onSuccess?.(data);
        },
        onError: (error) => {
          toast.error(getProfitSharingErrorMessage(error, "Failed to send OTP for profit share load."));
          options?.onError?.(error);
        },
      }
    );
  };

  const loadAmount = (
    id: string,
    payload: LoadProfitSharePayload,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    loadMutation.mutate(
      { propertyId: id, payload },
      {
        onSuccess: (data) => {
          toast.success("Profit share amount loaded.");
          options?.onSuccess?.(data);
        },
        onError: (error) => {
          toast.error(getProfitSharingErrorMessage(error, "Failed to load profit share amount."));
          options?.onError?.(error);
        },
      }
    );
  };

  const initiateDistribute = (
    id: string,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    initiateDistributeMutation.mutate(id, {
      onSuccess: (data) => {
        toast.success("OTP sent to super admin email.");
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        toast.error(getProfitSharingErrorMessage(error, "Failed to send OTP for profit share distribution."));
        options?.onError?.(error);
      },
    });
  };

  const distributeShare = (
    id: string,
    payload: ConfirmDistributeProfitSharePayload,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    distributeMutation.mutate(
      { propertyId: id, payload },
      {
        onSuccess: (data) => {
          toast.success("Profit share distributed to holders.");
          options?.onSuccess?.(data);
        },
        onError: (error) => {
          toast.error(getProfitSharingErrorMessage(error, "Failed to distribute profit share."));
          options?.onError?.(error);
        },
      }
    );
  };

  const updateRate = (
    id: string,
    payload: UpdateProfitSharingRatePayload,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    updateRateMutation.mutate(
      { propertyId: id, payload },
      {
        onSuccess: (data) => {
          toast.success("Profit sharing rate updated.");
          options?.onSuccess?.(data);
        },
        onError: (error) => {
          toast.error(getProfitSharingErrorMessage(error, "Failed to update profit sharing rate."));
          options?.onError?.(error);
        },
      }
    );
  };

  return {
    unownedHistory: unowned?.pageItems ?? [],
    unownedHistoryMeta: {
      totalRecords: unowned?.totalItems ?? 0,
      totalPages: unowned?.numberOfPages ?? 1,
      pageNumber: unowned?.currentPage ?? page,
      pageSize: unowned?.pageSize ?? limit,
      hasMore: unowned?.hasMore ?? false,
    },
    isLoadingUnownedHistory: unownedHistoryQuery.isLoading,
    unownedHistoryError: unownedHistoryQuery.error,
    refetchUnownedHistory: unownedHistoryQuery.refetch,

    statuses: statuses?.pageItems ?? [],
    statusesMeta: {
      totalRecords: statuses?.totalItems ?? 0,
      totalPages: statuses?.numberOfPages ?? 1,
      pageNumber: statuses?.currentPage ?? page,
      pageSize: statuses?.pageSize ?? limit,
      hasMore: statuses?.hasMore ?? false,
    },
    isLoadingStatuses: statusesQuery.isLoading,
    statusesError: statusesQuery.error,
    refetchStatuses: statusesQuery.refetch,

    propertyStatus: propertyStatusQuery.data,
    isLoadingPropertyStatus: propertyStatusQuery.isLoading,
    propertyStatusError: propertyStatusQuery.error,
    refetchPropertyStatus: propertyStatusQuery.refetch,

    records: records?.pageItems ?? [],
    recordsMeta: {
      totalRecords: records?.totalItems ?? 0,
      totalPages: records?.numberOfPages ?? 1,
      pageNumber: records?.currentPage ?? page,
      pageSize: records?.pageSize ?? limit,
      hasMore: records?.hasMore ?? false,
    },
    isLoadingRecords: recordsQuery.isLoading,
    recordsError: recordsQuery.error,

    breakdown: breakdown?.pageItems ?? [],
    breakdownMeta: {
      totalRecords: breakdown?.totalItems ?? 0,
      totalPages: breakdown?.numberOfPages ?? 1,
      pageNumber: breakdown?.currentPage ?? page,
      pageSize: breakdown?.pageSize ?? limit,
      hasMore: breakdown?.hasMore ?? false,
    },
    isLoadingBreakdown: breakdownQuery.isLoading,
    breakdownError: breakdownQuery.error,

    initiateLoad,
    isInitiatingLoad: initiateLoadMutation.isPending,
    loadAmount,
    isLoadingAmount: loadMutation.isPending,
    initiateDistribute,
    isInitiatingDistribute: initiateDistributeMutation.isPending,
    distributeShare,
    isDistributing: distributeMutation.isPending,
    updateRate,
    isUpdatingRate: updateRateMutation.isPending,
  };
}
