import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createProperty,
  getProperties,
  getPropertyById,
  getPropertyStatistics,
  getPropertyErrorMessage,
  updateProperty as updatePropertyRequest,
  setPropertyVisibility as setPropertyVisibilityRequest,
  updatePropertyCommission as updatePropertyCommissionRequest,
} from "@/lib/property/api";
import type { CreatePropertyPayload } from "@/lib/property/types";

type UsePropertyAPIOptions = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  propertyId?: string;
  enableProperties?: boolean;
  enableStatistics?: boolean;
  enablePropertyDetail?: boolean;
};

export const usePropertyAPI = ({
  page = 1,
  limit = 10,
  searchTerm = "",
  propertyId = "",
  enableProperties = false,
  enableStatistics = false,
  enablePropertyDetail = false,
}: UsePropertyAPIOptions = {}) => {
  const queryClient = useQueryClient();
  const trimmedSearch = searchTerm.trim();
  const nameFilter = trimmedSearch.length >= 2 ? trimmedSearch : undefined;

  const propertiesQuery = useQuery({
    queryKey: ["properties", page, limit, nameFilter],
    queryFn: () => getProperties({ page, limit, name: nameFilter }),
    enabled: enableProperties,
  });

  const statisticsQuery = useQuery({
    queryKey: ["property-statistics"],
    queryFn: () => getPropertyStatistics({ limit: 50 }),
    enabled: enableStatistics,
  });

  const propertyDetailQuery = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => getPropertyById(propertyId),
    enabled: enablePropertyDetail && Boolean(propertyId),
  });

  const addPropertyMutation = useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property-statistics"] });
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreatePropertyPayload }) => updatePropertyRequest(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property-statistics"] });
      queryClient.invalidateQueries({ queryKey: ["property", variables.id] });
    },
  });

  const setPropertyVisibilityMutation = useMutation({
    mutationFn: ({ id, isHidden }: { id: string; isHidden: boolean }) => setPropertyVisibilityRequest(id, isHidden),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property-statistics"] });
      queryClient.invalidateQueries({ queryKey: ["property", variables.id] });
    },
  });

  const updateCommissionMutation = useMutation({
    mutationFn: ({ id, commission }: { id: string; commission: number }) =>
      updatePropertyCommissionRequest(id, commission),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property", variables.id] });
    },
  });

  const addProperty = (
    payload: CreatePropertyPayload | Record<string, unknown>,
    options?: { onSuccess?: (data?: any) => void; onError?: (error?: any) => void }
  ) => {
    addPropertyMutation.mutate(payload as CreatePropertyPayload, {
      onSuccess: (data) => {
        toast.success(
          data?.responseDescription ||
            data?.responseMessage ||
            data?.message ||
            "Property created successfully!"
        );
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        toast.error(getPropertyErrorMessage(error, "Failed to create property."));
        options?.onError?.(error);
      },
    });
  };

  const updateProperty = (
    id: string,
    payload: CreatePropertyPayload | Record<string, unknown>,
    options?: { onSuccess?: (data?: any) => void; onError?: (error?: any) => void }
  ) => {
    updatePropertyMutation.mutate(
      { id, payload: payload as CreatePropertyPayload },
      {
        onSuccess: (data) => {
          toast.success(
            data?.responseDescription ||
              data?.responseMessage ||
              data?.message ||
              "Property updated successfully!"
          );
          options?.onSuccess?.(data);
        },
        onError: (error) => {
          toast.error(getPropertyErrorMessage(error, "Failed to update property."));
          options?.onError?.(error);
        },
      }
    );
  };

  const setPropertyVisibility = (
    id: string,
    isHidden: boolean,
    options?: { onSuccess?: (data?: any) => void; onError?: (error?: any) => void }
  ) => {
    setPropertyVisibilityMutation.mutate(
      { id, isHidden },
      {
        onSuccess: (data) => {
          toast.success(
            isHidden
              ? "Property hidden from user listings."
              : "Property is now visible on user listings."
          );
          options?.onSuccess?.(data);
        },
        onError: (error) => {
          toast.error(getPropertyErrorMessage(error, "Failed to update property visibility."));
          options?.onError?.(error);
        },
      }
    );
  };

  const updatePropertyCommission = (
    id: string,
    commission: number,
    options?: { onSuccess?: (data?: any) => void; onError?: (error?: any) => void }
  ) => {
    updateCommissionMutation.mutate(
      { id, commission },
      {
        onSuccess: (data) => {
          toast.success(
            data?.responseDescription ||
              data?.responseMessage ||
              data?.message ||
              "Property commission updated."
          );
          options?.onSuccess?.(data);
        },
        onError: (error) => {
          toast.error(getPropertyErrorMessage(error, "Failed to update commission."));
          options?.onError?.(error);
        },
      }
    );
  };

  const deleteProperty = async (_id: string, options?: { onSuccess?: () => void }) => {
    toast.success("Property deleted successfully");
    queryClient.invalidateQueries({ queryKey: ["properties"] });
    queryClient.invalidateQueries({ queryKey: ["property-statistics"] });
    options?.onSuccess?.();
  };

  return {
    properties: propertiesQuery.data ?? null,
    isLoadingProperties: propertiesQuery.isLoading,
    propertiesError: propertiesQuery.error,
    refetchProperties: propertiesQuery.refetch,

    searchProperty: propertiesQuery.data ?? null,
    isLoadingSearch: propertiesQuery.isLoading,
    searchError: propertiesQuery.error,
    refetchSearch: propertiesQuery.refetch,

    propertyDetail: propertyDetailQuery.data ?? null,
    isLoadingPropertyDetail: propertyDetailQuery.isLoading,
    propertyDetailError: propertyDetailQuery.error,
    refetchPropertyDetail: propertyDetailQuery.refetch,

    propertyStatistics: statisticsQuery.data ?? null,
    isLoadingStatistics: statisticsQuery.isLoading,
    statisticsError: statisticsQuery.error,
    refetchStatistics: statisticsQuery.refetch,

    addProperty,
    updateProperty,
    setPropertyVisibility,
    updatePropertyCommission,
    deleteProperty,
    isAddingProperty: addPropertyMutation.isPending,
    isUpdatingProperty: updatePropertyMutation.isPending,
    isUpdatingPropertyVisibility: setPropertyVisibilityMutation.isPending,
    isUpdatingCommission: updateCommissionMutation.isPending,
    isDeletingProperty: false,
  };
};

export default usePropertyAPI;
