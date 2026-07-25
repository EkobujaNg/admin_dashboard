import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalRecords: number;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: readonly number[];
  label?: string;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  label = "records",
}: PaginationProps) => {
  const getPageNumbers = () => {
    const totalNumbers = 1;
    const maxPages = 3;

    if (totalPages <= maxPages) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const startPage = Math.max(2, currentPage - totalNumbers);
    const endPage = Math.min(totalPages - 1, currentPage + totalNumbers);
    const pages: (number | string)[] = [1];

    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();
  const showPageSize = typeof pageSize === "number" && typeof onPageSizeChange === "function";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-6 border-t border-gray-200 w-full">
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-sm text-gray-700 font-semibold">
          Showing <span className="text-primary-10 font-bold">{currentPage}</span> -{" "}
          <span className="text-primary-10 font-bold">{totalPages}</span> of {totalRecords || 0} {label}
        </p>

        {showPageSize && (
          <label className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
            <span className="whitespace-nowrap">Rows per page</span>
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="h-10 rounded-md border border-gray-300 bg-opacityClr-10 px-3 text-sm text-primary-10 outline-none"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-md border border-gray-300 bg-opacityClr-10 text-gray-800 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft />
        </button>

        {pages.map((page, idx) => (
          <button
            type="button"
            key={idx}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium ${
              currentPage === page ? "bg-primary-10 text-white" : "bg-opacityClr-10 text-gray-800 border border-gray-300"
            } ${page === "..." ? "cursor-default text-gray-500" : ""}`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 rounded-md border border-gray-300 bg-opacityClr-10 text-gray-800 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
