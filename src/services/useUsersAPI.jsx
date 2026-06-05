// src/hooks/useUserAPI.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/lib/http";
import { toast } from "sonner";

const queryKeys = {
  all: ["users"],
  list: (sortByDate, role) => ["users", "list", sortByDate, role],
  summary: ["users", "summary"],
  detail: (id) => ["users", "detail", id],
};

export const useUserAPI = ({ sortByDate = true, role = "", userId = "", enableUsers = false } = {}) => {
  const queryClient = useQueryClient();

  // 📊 Summary stats
  const {
    data: summaryStats,
    isLoading: isLoadingSummary,
    error: summaryError,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: queryKeys.summary,
    queryFn: async () => {
      const response = await http.get("/AdminUsers/management/summary");
      return response.data;
    },
    onError: (error) => {
      toast.error(error?.response?.data?.responseMessage || "Failed to fetch user summary stats");
    },
  });

  // 👥 Get all users
  const {
    data: users,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: queryKeys.list(sortByDate, role),
    queryFn: async () => {
      const response = await http.get("/AdminUsers/get-users", {
        params: {
          sortByDate,
          role,
        },
      });
      return response.data;
    },
    enabled: enableUsers,
    onError: (error) => {
      toast.error(error?.response?.data?.responseMessage || "Failed to fetch users");
    },
  });

  // 👤 User detail (if endpoint supports it)
  const {
    data: userDetail,
    isLoading: isLoadingUserDetail,
    error: userDetailError,
    refetch: refetchUserDetail,
  } = useQuery({
    queryKey: queryKeys.detail(userId),
    queryFn: async () => {
      const response = await http.get("/AdminUsers/get-users", {
        params: { userId },
      });
      return response.data;
    },
    enabled: !!userId,
    onError: (error) => {
      toast.error(error?.response?.data?.responseMessage || "Failed to fetch user details");
    },
  });

  // ➕ Add User
  const { mutate: addUser, isPending: isAddingUser } = useMutation({
    mutationFn: async (newUser) => {
      const response = await http.post("/AdminUsers/add-user", newUser);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.responseMessage || "User added successfully");
      queryClient.invalidateQueries(queryKeys.all);
      queryClient.invalidateQueries(queryKeys.summary);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.responseMessage || "Failed to add user");
    },
  });

  // ✏️ Edit User
  const { mutate: editUser, isPending: isEditingUser } = useMutation({
    mutationFn: async ({ userId, updatedUser }) => {
      const response = await http.post(`/AdminUsers/edit-users`, updatedUser, {
        params: { userId },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.responseMessage || "User updated successfully");
      queryClient.invalidateQueries(queryKeys.all);
      if (userId) queryClient.invalidateQueries(queryKeys.detail(userId));
      queryClient.invalidateQueries(queryKeys.summary);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.responseMessage || "Failed to update user");
    },
  });

  // ❌ Delete User
  const { mutate: deleteUser, isPending: isDeletingUser } = useMutation({
    mutationFn: async (id) => {
      const response = await http.delete(`/AdminUsers/delete-user/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.responseMessage || "User deleted successfully");
      queryClient.invalidateQueries(queryKeys.all);
      queryClient.invalidateQueries(queryKeys.summary);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.responseMessage || "Failed to delete user");
    },
  });

  // ✔ Accept User
  const { mutate: acceptUser, isPending: isAcceptingUser } = useMutation({
    mutationFn: async (id) => {
      const response = await http.post(`/AdminUsers/${id}/accept`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("User accepted");
      queryClient.invalidateQueries(queryKeys.all);
      queryClient.invalidateQueries(queryKeys.summary);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.responseMessage || "Failed to accept user");
    },
  });

  // ✖ Reject User
  const { mutate: rejectUser, isPending: isRejectingUser } = useMutation({
    mutationFn: async (id) => {
      const response = await http.post(`/AdminUsers/${id}/reject`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("User rejected");
      queryClient.invalidateQueries(queryKeys.all);
      queryClient.invalidateQueries(queryKeys.summary);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.responseMessage || "Failed to reject user");
    },
  });

  // 🚫 Deactivate User
  const { mutate: deactivateUser, isPending: isDeactivatingUser } = useMutation({
    mutationFn: async (id) => {
      const response = await http.post(`/AdminUsers/${id}/deactivate`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("User deactivated");
      queryClient.invalidateQueries(queryKeys.all);
      queryClient.invalidateQueries(queryKeys.summary);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.responseMessage || "Failed to deactivate user");
    },
  });

  return {
    // 👥 Users
    users: users?.data || null,
    isLoadingUsers,
    usersError,
    refetchUsers,

    // 📊 Summary
    summaryStats: summaryStats?.data || null,
    isLoadingSummary,
    summaryError,
    refetchSummary,

    // 👤 User Detail
    userDetail: userDetail?.data || null,
    isLoadingUserDetail,
    userDetailError,
    refetchUserDetail,

    // Mutations
    addUser,
    editUser,
    deleteUser,
    acceptUser,
    rejectUser,
    deactivateUser,

    // Loading states
    isAddingUser,
    isEditingUser,
    isDeletingUser,
    isAcceptingUser,
    isRejectingUser,
    isDeactivatingUser,
  };
};

export default useUserAPI;
