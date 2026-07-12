import { useQuery } from "@tanstack/react-query";
import { getAdminLogById, getAdminLogs } from "@/lib/admin-logs/api";
import type { AdminLog } from "@/lib/admin-logs/types";

const EMPTY_LOGS: AdminLog[] = [];

type UseAdminLogsAPIOptions = {
  page?: number;
  limit?: number;
  action?: string;
  resourceType?: string;
  adminUserId?: string;
  logId?: string;
  enableList?: boolean;
  enableDetail?: boolean;
};

export default function useAdminLogsAPI({
  page = 1,
  limit = 10,
  action = "",
  resourceType = "",
  adminUserId = "",
  logId = "",
  enableList = false,
  enableDetail = false,
}: UseAdminLogsAPIOptions = {}) {
  const actionFilter = action && action !== "all" ? action : undefined;
  const resourceFilter = resourceType && resourceType !== "all" ? resourceType : undefined;
  const adminFilter = adminUserId.trim() || undefined;

  const listQuery = useQuery({
    queryKey: ["admin-logs", page, limit, actionFilter ?? "", resourceFilter ?? "", adminFilter ?? ""],
    queryFn: () =>
      getAdminLogs({
        page,
        limit,
        action: actionFilter,
        resourceType: resourceFilter,
        adminUserId: adminFilter,
      }),
    enabled: enableList,
  });

  const detailQuery = useQuery({
    queryKey: ["admin-log", logId],
    queryFn: () => getAdminLogById(logId),
    enabled: enableDetail && Boolean(logId),
  });

  return {
    logs: listQuery.data?.pageItems ?? EMPTY_LOGS,
    logsMeta: {
      pageNumber: listQuery.data?.currentPage ?? page,
      totalPages: listQuery.data?.numberOfPages ?? 1,
      totalRecords: listQuery.data?.totalItems ?? 0,
      pageSize: listQuery.data?.pageSize ?? limit,
      hasMore: listQuery.data?.hasMore ?? false,
    },
    isLoadingLogs: listQuery.isLoading,
    logsError: listQuery.error,
    refetchLogs: listQuery.refetch,

    log: detailQuery.data,
    isLoadingLog: detailQuery.isLoading,
    logError: detailQuery.error,
    refetchLog: detailQuery.refetch,
  };
}
