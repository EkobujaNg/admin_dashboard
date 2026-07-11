"use client";

import React, { useMemo, useState } from "react";
import { Download, FileText, RefreshCw, Upload } from "lucide-react";
import { useDrawerModal } from "@/context/DrawerModalContext";
import useQuarterlyReportsAPI from "@/services/useQuarterlyReportsAPI";
import UploadQuarterlyReportDrawer from "@/components/views/UploadQuarterlyReportDrawer";
import {
  canReplaceQuarterlyReport,
  type QuarterlyReport,
  type QuarterlyReportQuarter,
} from "@/lib/quarterly-reports/types";

const QUARTERS: QuarterlyReportQuarter[] = [1, 2, 3, 4];

const QUARTER_LABELS: Record<QuarterlyReportQuarter, string> = {
  1: "First Quarter",
  2: "Second Quarter",
  3: "Third Quarter",
  4: "Fourth Quarter",
};

function buildYearOptions(currentYear: number) {
  return Array.from({ length: 8 }, (_, index) => currentYear - index);
}

function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-NG", { dateStyle: "medium" });
}

function formatDateTime(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

type PropertyReportsTabProps = {
  propertyId: string;
};

export default function PropertyReportsTab({ propertyId }: PropertyReportsTabProps) {
  const { openModal } = useDrawerModal();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const yearOptions = useMemo(() => buildYearOptions(currentYear), [currentYear]);

  const { reports, isLoadingReports, reportsError } = useQuarterlyReportsAPI({
    propertyId,
    year,
    enableList: true,
  });

  const reportsByQuarter = useMemo(() => {
    const map = new Map<QuarterlyReportQuarter, QuarterlyReport>();
    reports.forEach((report) => {
      map.set(report.quarter, report);
    });
    return map;
  }, [reports]);

  const openUploadDrawer = (quarter: QuarterlyReportQuarter, existing?: QuarterlyReport | null) => {
    openModal(
      existing ? "Replace quarterly report" : "Upload quarterly report",
      <UploadQuarterlyReportDrawer
        propertyId={propertyId}
        year={year}
        quarter={quarter}
        existingReport={existing}
      />
    );
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-Raleway font-bold text-primary-10">Quarterly reports</h3>
          <p className="text-sm font-Raleway text-opacityClr-60">
            Upload one PDF per quarter. Replace is available until the edit window expires.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm font-Raleway font-semibold text-primary-10">
          Year
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-4 py-2.5 rounded-lg border border-opacityClr-50 bg-white outline-none focus:border-primary-10"
          >
            {yearOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoadingReports ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {QUARTERS.map((quarter) => (
            <div
              key={quarter}
              className="h-40 rounded-2xl border border-opacityClr-30 bg-white animate-pulse"
            />
          ))}
        </div>
      ) : reportsError ? (
        <div className="rounded-2xl border border-opacityClr-30 bg-white p-6">
          <p className="text-base font-Raleway text-[#9F1B1B]">
            Failed to load quarterly reports for {year}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {QUARTERS.map((quarter) => {
            const report = reportsByQuarter.get(quarter);
            const uploadedOn = formatDate(report?.updatedAt || report?.createdAt);
            const canReplace = report ? canReplaceQuarterlyReport(report) : false;
            const expiresLabel = formatDateTime(report?.updateExpiresAt);

            return (
              <div
                key={quarter}
                className="flex flex-col gap-4 rounded-2xl border border-opacityClr-30 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-10/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-10" />
                    </div>
                    <div>
                      <p className="text-base font-Raleway font-bold text-primary-10">
                        {report?.quarterLabel || QUARTER_LABELS[quarter]}
                      </p>
                      <p className="text-sm font-Raleway text-opacityClr-60">
                        Q{quarter} · {year}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-Raleway font-semibold ${
                      report
                        ? "bg-[#CEDDB7] text-[#6D9F1B]"
                        : "bg-opacityClr-10 text-opacityClr-60"
                    }`}
                  >
                    {report ? "Uploaded" : "Missing"}
                  </span>
                </div>

                {report ? (
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-Raleway font-semibold text-primary-10 break-all">
                      {report.fileName}
                    </p>
                    {uploadedOn && (
                      <p className="text-xs font-Raleway text-opacityClr-60">Updated {uploadedOn}</p>
                    )}
                    {expiresLabel && (
                      <p
                        className={`text-xs font-Raleway ${
                          canReplace ? "text-opacityClr-60" : "text-[#9F471B]"
                        }`}
                      >
                        {canReplace
                          ? `Replace available until ${expiresLabel}`
                          : `Replace window expired ${expiresLabel}`}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm font-Raleway text-opacityClr-60">
                    No report uploaded for this quarter yet.
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-auto pt-2">
                  {report?.documentUrl ? (
                    <a
                      href={report.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-opacityClr-30 text-sm font-Raleway font-semibold text-primary-10 hover:bg-opacityClr-10"
                    >
                      <Download className="w-4 h-4" />
                      View
                    </a>
                  ) : null}

                  {!report ? (
                    <button
                      type="button"
                      onClick={() => openUploadDrawer(quarter)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-lightGreen text-primary-10 text-sm font-Raleway font-semibold hover:bg-primary-10 hover:text-white transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  ) : canReplace ? (
                    <button
                      type="button"
                      onClick={() => openUploadDrawer(quarter, report)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-lightGreen text-primary-10 text-sm font-Raleway font-semibold hover:bg-primary-10 hover:text-white transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Replace
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-opacityClr-30 text-opacityClr-50 text-sm font-Raleway font-semibold cursor-not-allowed"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Replace locked
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
