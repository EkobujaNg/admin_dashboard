// src/services/useInvestmentAPI.js
import { useQuery } from "@tanstack/react-query";
import http from "@/lib/http";
import { toast } from "sonner";

const queryKeys = {
  summary: ["investment-summary"],
  active: (page, size, search) => ["active-investments", page, size, search],
  reports: (page, size, search) => ["earning-reports", page, size, search],
};

export default function useInvestmentAPI({
  activePage = 1,
  activeSize = 10,
  activeSearch = "",
  reportPage = 1,
  reportSize = 10,
  reportSearch = "",
  enableActive = false,
  enableReports = false,
  enableSummary = false,
} = {}) {
  // 📌 Summary — no params
  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    error: summaryError,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: queryKeys.summary,
    queryFn: async () => {
      const response = await http.get("/AdminDashboard/investment-management-summary");
      return response.data?.data;
    },
    enabled: enableSummary,
    onError: (err) => {
      toast.error(err?.response?.data?.responseMessage || "Failed to load summary");
    },
  });

  // 📌 Active Investments — paginated
  const {
    data: activeInvestmentsData,
    isLoading: isLoadingActiveInvestments,
    error: activeError,
    refetch: refetchActiveInvestments,
  } = useQuery({
    queryKey: queryKeys.active(activePage, activeSize, activeSearch),
    queryFn: async () => {
      const response = await http.get("/AdminDashboard/active-investments", {
        params: {
          PageNumber: activePage,
          PageSize: activeSize,
          searchTerm: activeSearch || undefined,
        },
      });

      return response.data?.data;
    },
    enabled: enableActive,
    keepPreviousData: true,
    onError: (err) => {
      toast.error(err?.response?.data?.responseMessage || "Failed to load active investments");
    },
  });

  // 📌 Earning Reports — paginated
  const {
    data: earningReportsData,
    isLoading: isLoadingReports,
    error: reportsError,
    refetch: refetchReports,
  } = useQuery({
    queryKey: queryKeys.reports(reportPage, reportSize, reportSearch),
    queryFn: async () => {
      const response = await http.get("/AdminDashboard/earning-reports", {
        params: {
          PageNumber: reportPage,
          PageSize: reportSize,
          searchTerm: reportSearch || undefined,
        },
      });

      return response.data?.data;
    },
    enabled: enableReports,
    keepPreviousData: true,
    onError: (err) => {
      toast.error(err?.response?.data?.responseMessage || "Failed to load earning reports");
    },
  });

  return {
    // 📌 Summary
    summary: summaryData,
    isLoadingSummary,
    summaryError,
    refetchSummary,

    // 📌 Active Investments
    activeInvestments: activeInvestmentsData?.investments || [],
    activeMeta: {
      totalRecords: activeInvestmentsData?.totalRecords,
      totalPages: activeInvestmentsData?.totalPages,
      pageNumber: activeInvestmentsData?.pageNumber,
      pageSize: activeInvestmentsData?.pageSize,
    },
    isLoadingActiveInvestments,
    activeError,
    refetchActiveInvestments,

    // 📌 Earning Reports
    earningReports: earningReportsData?.reports || [],
    reportsMeta: {
      totalRecords: earningReportsData?.totalRecords,
      totalPages: earningReportsData?.totalPages,
      pageNumber: earningReportsData?.pageNumber,
      pageSize: earningReportsData?.pageSize,
    },
    isLoadingReports,
    reportsError,
    refetchReports,
  };
}
