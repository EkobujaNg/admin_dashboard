import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  blockAdminUser,
  getAdminUserById,
  getAdminUserErrorMessage,
  getAdminUsers,
  getAdminUserStats,
  unblockAdminUser,
} from "@/lib/users/api";
import type { AdminUserFilter } from "@/lib/users/types";

type UseUserAPIOptions = {
  page?: number;
  limit?: number;
  search?: string;
  filter?: AdminUserFilter;
  userId?: string;
  enableUsers?: boolean;
  enableStats?: boolean;
  enableUserDetail?: boolean;
};

export const useUserAPI = ({
  page = 1,
  limit = 10,
  search = "",
  filter = "all",
  userId = "",
  enableUsers = false,
  enableStats = true,
  enableUserDetail = false,
}: UseUserAPIOptions = {}) => {
  const queryClient = useQueryClient();
  const trimmedSearch = search.trim();
  const searchFilter = trimmedSearch.length > 0 ? trimmedSearch : undefined;

  const usersQuery = useQuery({
    queryKey: ["admin-users", page, limit, searchFilter, filter],
    queryFn: () => getAdminUsers({ page, limit, q: searchFilter, filter }),
    enabled: enableUsers,
  });

  const statsQuery = useQuery({
    queryKey: ["admin-users-stats"],
    queryFn: getAdminUserStats,
    enabled: enableStats,
  });

  const userDetailQuery = useQuery({
    queryKey: ["admin-user", userId],
    queryFn: () => getAdminUserById(userId),
    enabled: enableUserDetail && Boolean(userId),
  });

  const invalidateUsers = (id?: string) => {
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    queryClient.invalidateQueries({ queryKey: ["admin-users-stats"] });
    if (id) {
      queryClient.invalidateQueries({ queryKey: ["admin-user", id] });
    }
  };

  const blockUserMutation = useMutation({
    mutationFn: blockAdminUser,
    onSuccess: (_data, id) => invalidateUsers(id),
  });

  const unblockUserMutation = useMutation({
    mutationFn: unblockAdminUser,
    onSuccess: (_data, id) => invalidateUsers(id),
  });

  const blockUser = (
    id: string,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    blockUserMutation.mutate(id, {
      onSuccess: (data) => {
        toast.success("User blocked successfully.");
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        toast.error(getAdminUserErrorMessage(error, "Failed to block user."));
        options?.onError?.(error);
      },
    });
  };

  const unblockUser = (
    id: string,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    unblockUserMutation.mutate(id, {
      onSuccess: (data) => {
        toast.success("User unblocked successfully.");
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        toast.error(getAdminUserErrorMessage(error, "Failed to unblock user."));
        options?.onError?.(error);
      },
    });
  };

  const paginated = usersQuery.data;

  return {
    users: paginated?.pageItems ?? [],
    usersMeta: {
      totalRecords: paginated?.totalItems ?? 0,
      totalPages: paginated?.numberOfPages ?? 1,
      pageNumber: paginated?.currentPage ?? page,
      pageSize: limit,
      hasMore: paginated?.hasMore ?? false,
    },
    isLoadingUsers: usersQuery.isLoading,
    usersError: usersQuery.error,
    refetchUsers: usersQuery.refetch,

    summaryStats: statsQuery.data,
    isLoadingSummary: statsQuery.isLoading,
    summaryError: statsQuery.error,
    refetchSummary: statsQuery.refetch,

    userDetail: userDetailQuery.data,
    isLoadingUserDetail: userDetailQuery.isLoading,
    userDetailError: userDetailQuery.error,
    refetchUserDetail: userDetailQuery.refetch,

    blockUser,
    unblockUser,
    isBlockingUser: blockUserMutation.isPending,
    isUnblockingUser: unblockUserMutation.isPending,
  };
};

export default useUserAPI;
