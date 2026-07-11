export type QuarterlyReportQuarter = 1 | 2 | 3 | 4;

export type QuarterlyReport = {
  id: string;
  propertyId: string;
  year: number;
  quarter: QuarterlyReportQuarter;
  quarterLabel: string;
  documentUrl: string;
  fileName: string;
  mimeType: string;
  uploadedByAdminId?: string | null;
  /** Replace is allowed until this timestamp. After it, replace is locked. */
  updateExpiresAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type QuarterlyReportsYearResponse = {
  propertyId: string;
  year: number;
  reports: QuarterlyReport[];
};

export type UploadQuarterlyReportPayload = {
  year: number;
  quarter: QuarterlyReportQuarter;
  documentUrl: string;
  fileName: string;
  mimeType: string;
};

export type ReplaceQuarterlyReportPayload = {
  documentUrl: string;
  fileName: string;
  mimeType: string;
};

export type GetQuarterlyReportsParams = {
  propertyId: string;
  year: number;
};

export function canReplaceQuarterlyReport(report: Pick<QuarterlyReport, "updateExpiresAt">): boolean {
  if (!report.updateExpiresAt) return true;
  const expiresAt = new Date(report.updateExpiresAt);
  if (Number.isNaN(expiresAt.getTime())) return true;
  return Date.now() < expiresAt.getTime();
}
