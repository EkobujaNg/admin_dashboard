import { z } from "zod";
import { formatZodErrors } from "@/lib/validation/common";

export { formatZodErrors };

const MAX_PDF_BYTES = 20 * 1024 * 1024;

export const quarterlyReportFileSchema = z
  .custom<File>((value) => value instanceof File, { message: "Please select a PDF report to upload." })
  .refine((file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"), {
    message: "Only PDF files are allowed.",
  })
  .refine((file) => file.size > 0, { message: "Selected file is empty." })
  .refine((file) => file.size <= MAX_PDF_BYTES, { message: "PDF must be 20MB or smaller." });

export const uploadQuarterlyReportSchema = z.object({
  file: quarterlyReportFileSchema,
});
