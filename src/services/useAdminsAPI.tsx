import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  blockAdmin,
  createAdmin,
  getAdminById,
  getAdmins,
  getAdminsErrorMessage,
  unblockAdmin,
} from "@/lib/admins/api";
import type { AdminAccount, CreateAdminPayload } from "@/lib/admins/types";

const EMPTY_ADMINS: AdminAccount[] = [];

type UseAdminsAPIOptions = {
  page?: number;
  limit?: number;
  search?: string;
  adminId?: string;
  enableList?: boolean;
  enableDetail?: boolean;
};

export default function useAdminsAPI({
  page = 1,
  limit = 10,
  search = "",
  adminId = "",
  enableList = false,
  enableDetail = false,
}: UseAdminsAPIOptions = {}) {
  const queryClient = useQueryClient();
  const trimmedSearch = search.trim();
  const searchFilter = trimmedSearch.length > 0 ? trimmedSearch : undefined;

  const listQuery = useQuery({
    queryKey: ["admin-admins", page, limit, searchFilter ?? ""],
    queryFn: () => getAdmins({ page, limit, search: searchFilter }),
    enabled: enableList,
  });

  const detailQuery = useQuery({
    queryKey: ["admin-admin", adminId],
    queryFn: () => getAdminById(adminId),
    enabled: enableDetail && Boolean(adminId),
  });

  const invalidate = (id?: string) => {
    queryClient.invalidateQueries({ queryKey: ["admin-admins"] });
    if (id) {
      queryClient.invalidateQueries({ queryKey: ["admin-admin", id] });
    }
  };

  const createMutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => invalidate(),
  });

  const blockMutation = useMutation({
    mutationFn: blockAdmin,
    onSuccess: (_data, id) => invalidate(id),
  });

  const unblockMutation = useMutation({
    mutationFn: unblockAdmin,
    onSuccess: (_data, id) => invalidate(id),
  });

  const createAdminAccount = (
    payload: CreateAdminPayload,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    createMutation.mutate(payload, {
      onSuccess: (data) => {
        toast.success(
          data?.responseDescription ||
            data?.responseMessage ||
            data?.message ||
            "Admin account created successfully."
        );
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        toast.error(getAdminsErrorMessage(error, "Failed to create admin account."));
        options?.onError?.(error);
      },
    });
  };

  const blockAdminAccount = (
    id: string,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    blockMutation.mutate(id, {
      onSuccess: (data) => {
        toast.success("Admin account blocked.");
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        toast.error(getAdminsErrorMessage(error, "Failed to block admin."));
        options?.onError?.(error);
      },
    });
  };

  const unblockAdminAccount = (
    id: string,
    options?: { onSuccess?: (data?: unknown) => void; onError?: (error?: unknown) => void }
  ) => {
    unblockMutation.mutate(id, {
      onSuccess: (data) => {
        toast.success("Admin account unblocked.");
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        toast.error(getAdminsErrorMessage(error, "Failed to unblock admin."));
        options?.onError?.(error);
      },
    });
  };

  return {
    admins: listQuery.data?.pageItems ?? EMPTY_ADMINS,
    adminsMeta: {
      totalRecords: listQuery.data?.totalItems ?? 0,
      totalPages: listQuery.data?.numberOfPages ?? 1,
      pageNumber: listQuery.data?.currentPage ?? page,
      pageSize: listQuery.data?.pageSize ?? limit,
      hasMore: listQuery.data?.hasMore ?? false,
    },
    isLoadingAdmins: listQuery.isLoading,
    adminsError: listQuery.error,
    refetchAdmins: listQuery.refetch,

    admin: detailQuery.data,
    isLoadingAdmin: detailQuery.isLoading,
    adminError: detailQuery.error,
    refetchAdmin: detailQuery.refetch,

    createAdminAccount,
    blockAdminAccount,
    unblockAdminAccount,
    isCreatingAdmin: createMutation.isPending,
    isBlockingAdmin: blockMutation.isPending,
    isUnblockingAdmin: unblockMutation.isPending,
  };
}
