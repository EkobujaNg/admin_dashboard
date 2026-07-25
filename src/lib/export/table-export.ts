import Papa from "papaparse";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { toast } from "sonner";

export type ExportFormat = "CSV" | "PDF" | "Excel";

export type ExportTableData = {
  headers: string[];
  rows: string[][];
};

const SKIP_COLUMN_IDS = new Set([
  "actions",
  "action",
  "select",
  "selection",
  "checkbox",
]);

function isSkippableColumn(column: {
  id: string;
  columnDef: { header?: unknown; meta?: unknown };
}) {
  const id = column.id?.toLowerCase?.() ?? "";
  if (SKIP_COLUMN_IDS.has(id)) return true;
  if (id.includes("action")) return true;

  const header = column.columnDef.header;
  if (typeof header === "string" && /action/i.test(header)) return true;

  return false;
}

function getHeaderLabel(column: { id: string; columnDef: { header?: unknown } }) {
  const header = column.columnDef.header;
  if (typeof header === "string" && header.trim()) return header;
  return column.id
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function cellToString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(cellToString).join(", ");
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }
  return String(value);
}

/** Extract exportable rows from a TanStack table instance. */
export function getTableExportData(table: any): ExportTableData {
  if (!table) return { headers: [], rows: [] };

  const columns = table
    .getAllLeafColumns()
    .filter((column: any) => column.getIsVisible?.() !== false)
    .filter((column: any) => !isSkippableColumn(column));

  const headers = columns.map((column: any) => getHeaderLabel(column));

  const rowModel =
    typeof table.getPrePaginationRowModel === "function"
      ? table.getPrePaginationRowModel()
      : table.getCoreRowModel?.();

  const rows = (rowModel?.rows ?? []).map((row: any) =>
    columns.map((column: any) => {
      try {
        return cellToString(row.getValue(column.id));
      } catch {
        const original = row.original?.[column.id];
        return cellToString(original);
      }
    })
  );

  return { headers, rows };
}

function slugifyFilename(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) || "export"
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportCsv(data: ExportTableData, filename: string) {
  const csv = Papa.unparse({
    fields: data.headers,
    data: data.rows,
  });
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `${filename}.csv`);
}

function exportExcel(data: ExportTableData, filename: string) {
  const sheetData = [data.headers, ...data.rows];
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  worksheet["!cols"] = data.headers.map((header, index) => {
    const maxContent = Math.max(
      header.length,
      ...data.rows.map((row) => String(row[index] ?? "").length)
    );
    return { wch: Math.min(Math.max(maxContent + 2, 12), 40) };
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

function exportPdf(data: ExportTableData, filename: string, title?: string) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const margin = 40;

  if (title) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title, margin, 36);
  }

  autoTable(doc, {
    startY: title ? 52 : margin,
    head: [data.headers],
    body: data.rows,
    styles: {
      fontSize: 8,
      cellPadding: 4,
      overflow: "linebreak",
      valign: "middle",
    },
    headStyles: {
      fillColor: [29, 54, 56],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 247, 247],
    },
    margin: { left: margin, right: margin },
  });

  doc.save(`${filename}.pdf`);
}

export function exportTableData(
  format: ExportFormat | string,
  data: ExportTableData,
  options?: { filename?: string; title?: string }
) {
  if (!data.headers.length || !data.rows.length) {
    toast.error("No data available to export.");
    return;
  }

  const filename = slugifyFilename(options?.filename || options?.title || "export");

  try {
    if (format === "CSV") {
      exportCsv(data, filename);
    } else if (format === "Excel" || format === "XLSX") {
      exportExcel(data, filename);
    } else if (format === "PDF") {
      exportPdf(data, filename, options?.title);
    } else {
      toast.error("Unsupported export format.");
      return;
    }
    toast.success(`Exported as ${format === "Excel" ? "Excel" : format}.`);
  } catch (error) {
    console.error(error);
    toast.error("Failed to export data. Please try again.");
  }
}

export function exportFromTable(
  format: ExportFormat | string,
  table: any,
  options?: { filename?: string; title?: string }
) {
  exportTableData(format, getTableExportData(table), options);
}
