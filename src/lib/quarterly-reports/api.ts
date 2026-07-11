import http from "@/lib/http";
import { normalizeQuarterlyReportDetail, normalizeQuarterlyReportsResponse } from "./mappers";
import type {
  GetQuarterlyReportsParams,
  QuarterlyReport,
  QuarterlyReportsYearResponse,
  ReplaceQuarterlyReportPayload,
  UploadQuarterlyReportPayload,
} from "./types";

function adminReportsBase(propertyId: string) {
  return `/admin/properties/${propertyId}/quarterly-reports`;
}

export function getQuarterlyReportErrorMessage(error: any, fallback: string) {
  const message = error?.response?.data?.message;
  if (Array.isArray(message)) return message.join(", ");
  return (
    error?.response?.data?.responseDescription ||
    error?.response?.data?.responseMessage ||
    message ||
    error?.message ||
    fallback
  );
}

export async function getQuarterlyReports({
  propertyId,
  year,
}: GetQuarterlyReportsParams): Promise<QuarterlyReportsYearResponse> {
  const { data } = await http.get(adminReportsBase(propertyId), {
    params: { year },
  });
  return normalizeQuarterlyReportsResponse(data);
}

export async function uploadQuarterlyReport(
  propertyId: string,
  payload: UploadQuarterlyReportPayload
): Promise<QuarterlyReport> {
  const { data } = await http.post(adminReportsBase(propertyId), payload);
  return normalizeQuarterlyReportDetail(data);
}

export async function replaceQuarterlyReport(
  propertyId: string,
  reportId: string,
  payload: ReplaceQuarterlyReportPayload
): Promise<QuarterlyReport> {
  const { data } = await http.patch(`${adminReportsBase(propertyId)}/${reportId}`, payload);
  return normalizeQuarterlyReportDetail(data);
}
