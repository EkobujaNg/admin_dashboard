"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { useDrawerModal } from "@/context/DrawerModalContext";
import useQuarterlyReportsAPI from "@/services/useQuarterlyReportsAPI";
import { uploadQuarterlyReportDocument } from "@/lib/quarterly-reports/media";
import { getQuarterlyReportErrorMessage } from "@/lib/quarterly-reports/api";
import {
  canReplaceQuarterlyReport,
  type QuarterlyReport,
  type QuarterlyReportQuarter,
} from "@/lib/quarterly-reports/types";

type UploadQuarterlyReportDrawerProps = {
  propertyId: string;
  year: number;
  quarter: QuarterlyReportQuarter;
  existingReport?: QuarterlyReport | null;
};

export default function UploadQuarterlyReportDrawer({
  propertyId,
  year,
  quarter,
  existingReport = null,
}: UploadQuarterlyReportDrawerProps) {
  const { closeModal } = useDrawerModal();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const { createReport, updateReport, isUploadingReport, isReplacingReport } = useQuarterlyReportsAPI({
    propertyId,
    year,
  });

  const isReplace = Boolean(existingReport?.id);
  const isSubmitting = isUploadingFile || isUploadingReport || isReplacingReport;
  const replaceAllowed = !isReplace || (existingReport ? canReplaceQuarterlyReport(existingReport) : false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReplace && !replaceAllowed) {
      toast.error("The replace window for this report has expired.");
      return;
    }
    if (!file) {
      toast.error("Please select a PDF report to upload.");
      return;
    }

    try {
      setIsUploadingFile(true);
      const uploaded = await uploadQuarterlyReportDocument(file);

      if (isReplace && existingReport) {
        updateReport(
          existingReport.id,
          {
            documentUrl: uploaded.documentUrl,
            fileName: uploaded.fileName,
            mimeType: uploaded.mimeType,
          },
          { onSuccess: () => closeModal() }
        );
      } else {
        createReport(
          {
            year,
            quarter,
            documentUrl: uploaded.documentUrl,
            fileName: uploaded.fileName,
            mimeType: uploaded.mimeType,
          },
          { onSuccess: () => closeModal() }
        );
      }
    } catch (error) {
      toast.error(getQuarterlyReportErrorMessage(error, "Failed to upload report file."));
    } finally {
      setIsUploadingFile(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-4 h-full">
      <div className="flex flex-col gap-1">
        <p className="font-Raleway font-semibold text-primary-10 text-base">
          {isReplace ? "Replace report" : "Upload report"}
        </p>
        <p className="text-sm font-Raleway text-opacityClr-60">
          Q{quarter} · {year}
          {existingReport?.fileName ? ` · Current: ${existingReport.fileName}` : ""}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-Raleway font-semibold text-opacityClr-100 text-base">PDF document</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full rounded-xl border border-dashed border-opacityClr-50 px-4 py-8 text-sm font-Raleway text-opacityClr-80 hover:border-primary-10 hover:text-primary-10 transition-colors"
        >
          {file ? file.name : "Click to select a PDF (max 20MB)"}
        </button>
      </div>

      <div className="mt-auto pt-4 border-t border-opacityClr-20">
        <button
          type="submit"
          disabled={isSubmitting || (isReplace && !replaceAllowed)}
          className="w-full px-5 py-[14px] rounded-md bg-neutral-lightGreen text-primary-10 font-Raleway font-bold text-base hover:bg-primary-10 hover:text-white transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Uploading..." : isReplace ? "Replace report" : "Upload report"}
        </button>
      </div>
    </form>
  );
}
