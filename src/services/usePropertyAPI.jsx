// src/hooks/usePropertyAPI.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/lib/http";
import { toast } from "sonner";

const queryKeys = {
  all: ["properties"],
  list: ["properties", "list"],
  detail: (id) => ["properties", "detail", id],
  search: (term) => ["properties", "search", term],
  statistics: ["properties", "statistics"],
};

export const usePropertyAPI = ({ searchTerm = "", propertyId = "", enableProperties = false, enableStatistics = false } = {}) => {
  const queryClient = useQueryClient();

  // 🏠 Get all properties
  const {
    data: properties,
    isLoading: isLoadingProperties,
    error: propertiesError,
    refetch: refetchProperties,
  } = useQuery({
    queryKey: queryKeys.list,
    queryFn: async () => {
      const response = await http.get("/AdminProperty/get-all-properties");
      return response.data;
    },
    enabled: enableProperties,
    onError: (error) => {
      toast.error(error?.response?.data?.responseMessage || "Failed to fetch properties");
    },
  });

  // 🔍 Search properties
  const {
    data: searchProperty,
    isLoading: isLoadingSearch,
    error: searchError,
    refetch: refetchSearch,
  } = useQuery({
    queryKey: queryKeys.search(searchTerm),
    queryFn: async () => {
      const response = await http.get("/AdminProperty/search-properties", {
        params: { searchTerm },
      });
      return response.data;
    },
    enabled: enableProperties && !!searchTerm,
    staleTime: 60 * 1000,
    onError: (error) => {
      toast.error(error?.response?.data?.responseMessage || "Failed to search properties");
    },
  });

  // 🏡 Single property detail
  const {
    data: propertyDetail,
    isLoading: isLoadingPropertyDetail,
    error: propertyDetailError,
    refetch: refetchPropertyDetail,
  } = useQuery({
    queryKey: queryKeys.detail(propertyId),
    queryFn: async () => {
      const response = await http.get("/AdminProperty/get-property", { params: { propertyId } });
      return response.data;
    },
    enabled: !!propertyId,
    staleTime: 60 * 1000,
    onError: (error) => {
      toast.error(error?.response?.data?.responseMessage || "Failed to fetch property details");
    },
  });

  // 📊 Property statistics
  const {
    data: propertyStatistics,
    isLoading: isLoadingStatistics,
    error: statisticsError,
    refetch: refetchStatistics,
  } = useQuery({
    queryKey: queryKeys.statistics,
    queryFn: async () => {
      const response = await http.get("/AdminProperty/property-statistics");
      return response.data;
    },
    enabled: enableStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      toast.error(error?.response?.data?.responseMessage || "Failed to fetch property statistics");
    },
  });

  // ➕ Add property
  const { mutate: addProperty, isPending: isAddingProperty } = useMutation({
    mutationFn: async (newProperty) => {
      const response = await http.post("/AdminProperty/add-property", newProperty);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.responseMessage || "Property added successfully");
      queryClient.invalidateQueries(queryKeys.list);
      queryClient.invalidateQueries(queryKeys.statistics);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.responseMessage || "Failed to add property");
    },
  });

  // ✏️ Update property
  const { mutate: updateProperty, isPending: isUpdatingProperty } = useMutation({
    mutationFn: async (updatedProperty) => {
      const response = await http.post("/AdminProperty/update-property", updatedProperty);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.responseMessage || "Property updated successfully");
      queryClient.invalidateQueries(queryKeys.list);
      queryClient.invalidateQueries(queryKeys.statistics);
      if (propertyId) queryClient.invalidateQueries(queryKeys.detail(propertyId));
    },
    onError: (error) => {
      toast.error(error?.response?.data?.responseMessage || "Failed to update property");
    },
  });

  // ❌ Delete property
  const { mutate: deleteProperty, isPending: isDeletingProperty } = useMutation({
    mutationFn: async (id) => {
      const response = await http.delete("/AdminProperty/delete-property", {
        params: { propertyId: id },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.responseMessage || "Property deleted successfully");
      queryClient.invalidateQueries(queryKeys.list);
      queryClient.invalidateQueries(queryKeys.statistics);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.responseMessage || "Failed to delete property");
    },
  });

  return {
    // 🏠 All properties
    properties: properties?.data || null,
    isLoadingProperties,
    propertiesError,
    refetchProperties,

    // 🔍 Search
    searchProperty: searchProperty?.data || null,
    isLoadingSearch,
    searchError,
    refetchSearch,

    // 🏡 Property detail
    propertyDetail: propertyDetail?.data || null,
    isLoadingPropertyDetail,
    propertyDetailError,
    refetchPropertyDetail,

    // 📊 Statistics
    propertyStatistics: propertyStatistics?.data || null,
    isLoadingStatistics,
    statisticsError,
    refetchStatistics,

    // ➕ Add, ✏️ Update, ❌ Delete
    addProperty,
    updateProperty,
    deleteProperty,
    isAddingProperty,
    isUpdatingProperty,
    isDeletingProperty,
  };
};

export default usePropertyAPI;
