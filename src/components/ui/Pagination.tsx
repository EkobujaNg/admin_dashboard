import React from "react";
import { IoChevronForwardOutline, IoChevronBackOutline } from "react-icons/io5";

const Pagination = ({ currentPage, totalPages, onPageChange, totalRecords }: { currentPage: any; totalPages: any; onPageChange: any; totalRecords: any }) => {
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

  return (
    <div className="flex items-center justify-between py-4 px-6 border-t border-gray-200 w-full">
      {/* Left side - Showing text */}
      <p className="text-sm text-gray-700 font-semibold">
        Showing <span className="text-primary-10 font-bold">{currentPage}</span> -{" "}
        <span className="text-primary-10 font-bold">{totalPages}</span> of {totalRecords || 0} transactions
      </p>

      {/* Right side - Pagination controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-md border border-gray-300 bg-opacityClr-10 text-gray-800 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoChevronBackOutline />
        </button>

        {pages.map((page, idx) => (
          <button
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
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 rounded-md border border-gray-300 bg-opacityClr-10 text-gray-800 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoChevronForwardOutline />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
