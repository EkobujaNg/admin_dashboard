import type {
  QuarterlyReport,
  QuarterlyReportQuarter,
  QuarterlyReportsYearResponse,
} from "./types";

function unwrapData<T>(data: T | { data: T }): T {
  if (data && typeof data === "object" && "data" in data && (data as { data: T }).data) {
    return (data as { data: T }).data;
  }
  return data as T;
}

function normalizeQuarter(value: unknown): QuarterlyReportQuarter {
  const num = Number(value);
  if (num === 2 || num === 3 || num === 4) return num;
  return 1;
}

function defaultQuarterLabel(quarter: QuarterlyReportQuarter): string {
  const labels: Record<QuarterlyReportQuarter, string> = {
    1: "First Quarter",
    2: "Second Quarter",
    3: "Third Quarter",
    4: "Fourth Quarter",
  };
  return labels[quarter];
}

function normalizeQuarterlyReport(
  raw: Record<string, unknown>,
  defaults?: { propertyId?: string; year?: number }
): QuarterlyReport {
  const quarter = normalizeQuarter(raw.quarter);

  return {
    id: String(raw.id ?? raw.reportId ?? ""),
    propertyId: String(raw.propertyId ?? defaults?.propertyId ?? ""),
    year: Number(raw.year ?? defaults?.year) || new Date().getFullYear(),
    quarter,
    quarterLabel: String(raw.quarterLabel ?? defaultQuarterLabel(quarter)),
    documentUrl: String(raw.documentUrl ?? raw.url ?? ""),
    fileName: String(raw.fileName ?? raw.name ?? "report.pdf"),
    mimeType: String(raw.mimeType ?? "application/pdf"),
    uploadedByAdminId: raw.uploadedByAdminId ? String(raw.uploadedByAdminId) : null,
    updateExpiresAt: raw.updateExpiresAt ? String(raw.updateExpiresAt) : null,
    createdAt: raw.createdAt ? String(raw.createdAt) : null,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : null,
  };
}

export function normalizeQuarterlyReportsResponse(raw: unknown): QuarterlyReportsYearResponse {
  const payload = unwrapData(raw) as Record<string, unknown> | unknown[];

  if (Array.isArray(payload)) {
    const reports = payload.map((item) => normalizeQuarterlyReport(item as Record<string, unknown>));
    return {
      propertyId: reports[0]?.propertyId ?? "",
      year: reports[0]?.year ?? new Date().getFullYear(),
      reports,
    };
  }

  const propertyId = String(payload.propertyId ?? "");
  const year = Number(payload.year) || new Date().getFullYear();
  const reportsRaw = Array.isArray(payload.reports)
    ? payload.reports
    : Array.isArray(payload.items)
      ? payload.items
      : Array.isArray(payload.data)
        ? payload.data
        : [];

  return {
    propertyId,
    year,
    reports: reportsRaw.map((item) =>
      normalizeQuarterlyReport(item as Record<string, unknown>, { propertyId, year })
    ),
  };
}

export function normalizeQuarterlyReportDetail(raw: unknown): QuarterlyReport {
  return normalizeQuarterlyReport(unwrapData(raw) as Record<string, unknown>);
}
