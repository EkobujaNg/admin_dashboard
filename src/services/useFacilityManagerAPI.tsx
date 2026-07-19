import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  assignPropertyToFacilityManager,
  blockFacilityManager,
  createFacilityManager,
  getFacilityManagerAssistants,
  getFacilityManagerById,
  getFacilityManagerProperties,
  getFacilityManagers,
  getFacilityManagerErrorMessage,
  removePropertyFromFacilityManager,
  unblockFacilityManager,
} from "@/lib/facility-manager/api";
import type { CreateFacilityManagerPayload } from "@/lib/facility-manager/types";

type UseFacilityManagerAPIOptions = {
  page?: number;
  limit?: number;
  search?: string;
  managerId?: string;
  enableList?: boolean;
  enableDetail?: boolean;
  enableAssignedProperties?: boolean;
  enableAssistants?: boolean;
};

export default function useFacilityManagerAPI({
  page = 1,
  limit = 10,
  search = "",
  managerId = "",
  enableList = false,
  enableDetail = false,
  enableAssignedProperties = false,
  enableAssistants = false,
}: UseFacilityManagerAPIOptions = {}) {
  const queryClient = useQueryClient();
  const trimmedSearch = search.trim();
  const searchFilter = trimmedSearch.length > 0 ? trimmedSearch : undefined;

  const invalidateManagerProperties = (id: string) => {
    queryClient.invalidateQueries({ queryKey: ["facility-manager-properties", id] });
  };

  const facilityManagersQuery = useQuery({
    queryKey: ["facility-managers", page, limit, searchFilter],
    queryFn: () => getFacilityManagers({ page, limit, search: searchFilter }),
    enabled: enableList,
  });

  const facilityManagerDetailQuery = useQuery({
    queryKey: ["facility-manager", managerId],
    queryFn: () => getFacilityManagerById(managerId),
    enabled: enableDetail && Boolean(managerId),
  });

  const assignedPropertiesQuery = useQuery({
    queryKey: ["facility-manager-properties", managerId],
    queryFn: () => getFacilityManagerProperties(managerId),
    enabled: enableAssignedProperties && Boolean(managerId),
  });

  const assistantsQuery = useQuery({
    queryKey: ["facility-manager-assistants", managerId],
    queryFn: () => getFacilityManagerAssistants(managerId),
    enabled: enableAssistants && Boolean(managerId),
  });

  const createFacilityManagerMutation = useMutation({
    mutationFn: createFacilityManager,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facility-managers"] });
    },
  });

  const assignPropertyMutation = useMutation({
    mutationFn: ({ managerId, propertyId }: { managerId: string; propertyId: string }) =>
      assignPropertyToFacilityManager(managerId, propertyId),
    onSuccess: (_data, variables) => {
      invalidateManagerProperties(variables.managerId);
    },
  });

  const removePropertyMutation = useMutation({
    mutationFn: ({ managerId, propertyId }: { managerId: string; propertyId: string }) =>
      removePropertyFromFacilityManager(managerId, propertyId),
    onSuccess: (_data, variables) => {
      invalidateManagerProperties(variables.managerId);
    },
  });

  const blockMutation = useMutation({
    mutationFn: blockFacilityManager,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["facility-managers"] });
      queryClient.invalidateQueries({ queryKey: ["facility-manager", id] });
    },
  });

  const unblockMutation = useMutation({
    mutationFn: unblockFacilityManager,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["facility-managers"] });
      queryClient.invalidateQueries({ queryKey: ["facility-manager", id] });
    },
  });

  const createManager = (
    payload: CreateFacilityManagerPayload,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    createFacilityManagerMutation.mutate(payload, {
      onSuccess: (data) => {
        toast.success(
          data?.responseDescription ||
            data?.responseMessage ||
            data?.message ||
            "Facility manager created successfully!"
        );
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        toast.error(getFacilityManagerErrorMessage(error, "Failed to create facility manager."));
        options?.onError?.(error);
      },
    });
  };

  const assignProperty = (
    managerId: string,
    propertyId: string,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    assignPropertyMutation.mutate(
      { managerId, propertyId },
      {
        onSuccess: (data) => {
          toast.success(
            data?.responseDescription ||
              data?.responseMessage ||
              data?.message ||
              "Property assigned successfully!"
          );
          options?.onSuccess?.(data);
        },
        onError: (error) => {
          toast.error(getFacilityManagerErrorMessage(error, "Failed to assign property."));
          options?.onError?.(error);
        },
      }
    );
  };

  const removeProperty = (
    managerId: string,
    propertyId: string,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    removePropertyMutation.mutate(
      { managerId, propertyId },
      {
        onSuccess: (data) => {
          toast.success(
            data?.responseDescription ||
              data?.responseMessage ||
              data?.message ||
              "Property removed successfully!"
          );
          options?.onSuccess?.(data);
        },
        onError: (error) => {
          toast.error(getFacilityManagerErrorMessage(error, "Failed to remove property."));
          options?.onError?.(error);
        },
      }
    );
  };

  const blockManager = (
    id: string,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    blockMutation.mutate(id, {
      onSuccess: (data) => {
        toast.success(
          data?.responseDescription ||
            data?.responseMessage ||
            data?.message ||
            "Facility manager blocked."
        );
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        toast.error(getFacilityManagerErrorMessage(error, "Failed to block facility manager."));
        options?.onError?.(error);
      },
    });
  };

  const unblockManager = (
    id: string,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    unblockMutation.mutate(id, {
      onSuccess: (data) => {
        toast.success(
          data?.responseDescription ||
            data?.responseMessage ||
            data?.message ||
            "Facility manager unblocked."
        );
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        toast.error(getFacilityManagerErrorMessage(error, "Failed to unblock facility manager."));
        options?.onError?.(error);
      },
    });
  };

  const paginated = facilityManagersQuery.data;

  return {
    createManager,
    isCreatingManager: createFacilityManagerMutation.isPending,

    assignProperty,
    isAssigningProperty: assignPropertyMutation.isPending,

    removeProperty,
    isRemovingProperty: removePropertyMutation.isPending,

    blockManager,
    isBlockingManager: blockMutation.isPending,

    unblockManager,
    isUnblockingManager: unblockMutation.isPending,

    facilityManagers: paginated?.pageItems ?? [],
    facilityManagersMeta: {
      totalRecords: paginated?.totalItems ?? 0,
      totalPages: paginated?.numberOfPages ?? 1,
      pageNumber: paginated?.currentPage ?? page,
      pageSize: limit,
      hasMore: paginated?.hasMore ?? false,
    },
    isLoadingFacilityManagers: facilityManagersQuery.isLoading,
    facilityManagersError: facilityManagersQuery.error,
    refetchFacilityManagers: facilityManagersQuery.refetch,

    facilityManager: facilityManagerDetailQuery.data,
    isLoadingFacilityManager: facilityManagerDetailQuery.isLoading,
    facilityManagerError: facilityManagerDetailQuery.error,
    refetchFacilityManager: facilityManagerDetailQuery.refetch,

    assignedProperties: assignedPropertiesQuery.data ?? [],
    isLoadingAssignedProperties: assignedPropertiesQuery.isLoading,
    assignedPropertiesError: assignedPropertiesQuery.error,
    refetchAssignedProperties: assignedPropertiesQuery.refetch,

    assistants: assistantsQuery.data ?? [],
    isLoadingAssistants: assistantsQuery.isLoading,
    assistantsError: assistantsQuery.error,
    refetchAssistants: assistantsQuery.refetch,
  };
}
