import { uploadMediaFile } from "@/lib/storage/api";

const MAX_REPORT_SIZE = 20 * 1024 * 1024;
const ALLOWED_REPORT_TYPES = ["application/pdf"];

export async function uploadQuarterlyReportDocument(file: File): Promise<{
  documentUrl: string;
  fileName: string;
  mimeType: string;
}> {
  if (!ALLOWED_REPORT_TYPES.includes(file.type)) {
    throw new Error("Please upload a PDF document.");
  }

  if (file.size > MAX_REPORT_SIZE) {
    throw new Error("Report must be 20MB or smaller.");
  }

  const { publicUrl } = await uploadMediaFile(file, {
    kind: "properties",
    maxSizeBytes: MAX_REPORT_SIZE,
    allowedTypes: ALLOWED_REPORT_TYPES,
  });

  return {
    documentUrl: publicUrl,
    fileName: file.name,
    mimeType: file.type || "application/pdf",
  };
}
