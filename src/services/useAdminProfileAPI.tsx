import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  getAdminProfile,
  getAdminProfileErrorMessage,
  updateAdminProfile,
} from "@/lib/admin-profile/api";
import type { UpdateAdminProfilePayload } from "@/lib/admin-profile/types";
import { getAdminProfileDisplayName } from "@/lib/admin-profile/mappers";
import { updateProfileLocally } from "@/lib/store/slices/authSlice";

type UseAdminProfileAPIOptions = {
  enableProfile?: boolean;
};

export default function useAdminProfileAPI({ enableProfile = false }: UseAdminProfileAPIOptions = {}) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const syncAuthUser = (profile: Awaited<ReturnType<typeof getAdminProfile>>) => {
    dispatch(
      updateProfileLocally({
        userId: profile.userId,
        email: profile.email,
        fullName: getAdminProfileDisplayName(profile),
        roles: profile.roles,
        role: profile.roles[0],
      })
    );
  };

  const profileQuery = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const profile = await getAdminProfile();
      syncAuthUser(profile);
      return profile;
    },
    enabled: enableProfile,
  });

  const updateMutation = useMutation({
    mutationFn: updateAdminProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(["admin-profile"], profile);
      syncAuthUser(profile);
      toast.success("Profile updated successfully.");
    },
    onError: (error) => {
      toast.error(getAdminProfileErrorMessage(error, "Failed to update profile."));
    },
  });

  const saveProfile = (
    payload: UpdateAdminProfilePayload,
    options?: { onSuccess?: () => void; onError?: (error?: unknown) => void }
  ) => {
    updateMutation.mutate(payload, {
      onSuccess: () => options?.onSuccess?.(),
      onError: (error) => options?.onError?.(error),
    });
  };

  return {
    profile: profileQuery.data,
    isLoadingProfile: profileQuery.isLoading,
    profileError: profileQuery.error,
    refetchProfile: profileQuery.refetch,

    saveProfile,
    isUpdatingProfile: updateMutation.isPending,
  };
}
