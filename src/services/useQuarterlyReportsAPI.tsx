import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getQuarterlyReportErrorMessage,
  getQuarterlyReports,
  replaceQuarterlyReport,
  uploadQuarterlyReport,
} from "@/lib/quarterly-reports/api";
import type {
  QuarterlyReport,
  QuarterlyReportsYearResponse,
  ReplaceQuarterlyReportPayload,
  UploadQuarterlyReportPayload,
} from "@/lib/quarterly-reports/types";

const EMPTY_REPORTS: QuarterlyReport[] = [];
const EMPTY_YEAR_RESPONSE: QuarterlyReportsYearResponse = {
  propertyId: "",
  year: new Date().getFullYear(),
  reports: EMPTY_REPORTS,
};

type UseQuarterlyReportsAPIOptions = {
  propertyId?: string;
  year?: number;
  enableList?: boolean;
};

export default function useQuarterlyReportsAPI({
  propertyId = "",
  year = new Date().getFullYear(),
  enableList = false,
}: UseQuarterlyReportsAPIOptions = {}) {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["admin-quarterly-reports", propertyId, year],
    queryFn: () => getQuarterlyReports({ propertyId, year }),
    enabled: enableList && Boolean(propertyId) && Boolean(year),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-quarterly-reports", propertyId] });
  };

  const uploadMutation = useMutation({
    mutationFn: (payload: UploadQuarterlyReportPayload) => uploadQuarterlyReport(propertyId, payload),
    onSuccess: () => invalidate(),
  });

  const replaceMutation = useMutation({
    mutationFn: ({
      reportId,
      payload,
    }: {
      reportId: string;
      payload: ReplaceQuarterlyReportPayload;
    }) => replaceQuarterlyReport(propertyId, reportId, payload),
    onSuccess: () => invalidate(),
  });

  const createReport = (
    payload: UploadQuarterlyReportPayload,
    options?: { onSuccess?: () => void; onError?: (error?: unknown) => void }
  ) => {
    uploadMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Quarterly report uploaded.");
        options?.onSuccess?.();
      },
      onError: (error) => {
        toast.error(getQuarterlyReportErrorMessage(error, "Failed to upload quarterly report."));
        options?.onError?.(error);
      },
    });
  };

  const updateReport = (
    reportId: string,
    payload: ReplaceQuarterlyReportPayload,
    options?: { onSuccess?: () => void; onError?: (error?: unknown) => void }
  ) => {
    replaceMutation.mutate(
      { reportId, payload },
      {
        onSuccess: () => {
          toast.success("Quarterly report updated.");
          options?.onSuccess?.();
        },
        onError: (error) => {
          toast.error(getQuarterlyReportErrorMessage(error, "Failed to update quarterly report."));
          options?.onError?.(error);
        },
      }
    );
  };

  return {
    reports: listQuery.data?.reports ?? EMPTY_REPORTS,
    yearResponse: listQuery.data ?? EMPTY_YEAR_RESPONSE,
    isLoadingReports: listQuery.isLoading,
    reportsError: listQuery.error,
    refetchReports: listQuery.refetch,

    createReport,
    updateReport,
    isUploadingReport: uploadMutation.isPending,
    isReplacingReport: replaceMutation.isPending,
  };
}
