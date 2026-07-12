import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdminSettings,
  getAdminSettingsErrorMessage,
  updateAdminSettings,
} from "@/lib/admin-settings/api";
import type { UpdateAdminSettingsPayload } from "@/lib/admin-settings/types";

type UseAdminSettingsAPIOptions = {
  enableSettings?: boolean;
};

export default function useAdminSettingsAPI({
  enableSettings = false,
}: UseAdminSettingsAPIOptions = {}) {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ["admin-settings"],
    queryFn: getAdminSettings,
    enabled: enableSettings,
  });

  const updateMutation = useMutation({
    mutationFn: updateAdminSettings,
    onSuccess: (settings) => {
      queryClient.setQueryData(["admin-settings"], settings);
      toast.success("Settings updated successfully.");
    },
    onError: (error) => {
      toast.error(getAdminSettingsErrorMessage(error, "Failed to update settings."));
    },
  });

  const saveSettings = (
    payload: UpdateAdminSettingsPayload,
    options?: { onSuccess?: () => void; onError?: (error?: unknown) => void }
  ) => {
    updateMutation.mutate(payload, {
      onSuccess: () => options?.onSuccess?.(),
      onError: (error) => options?.onError?.(error),
    });
  };

  return {
    settings: settingsQuery.data,
    isLoadingSettings: settingsQuery.isLoading,
    settingsError: settingsQuery.error,
    refetchSettings: settingsQuery.refetch,

    saveSettings,
    isUpdatingSettings: updateMutation.isPending,
  };
}
