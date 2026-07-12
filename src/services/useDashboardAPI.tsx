import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "@/lib/dashboard/api";

type UseDashboardAPIOptions = {
  enableDashboard?: boolean;
};

export default function useDashboardAPI({ enableDashboard = false }: UseDashboardAPIOptions = {}) {
  const dashboardQuery = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
    enabled: enableDashboard,
  });

  return {
    dashboard: dashboardQuery.data,
    isLoadingDashboard: dashboardQuery.isLoading,
    dashboardError: dashboardQuery.error,
    refetchDashboard: dashboardQuery.refetch,
  };
}
