"use client";

import { Search, X } from "lucide-react";
import Dropdown from "../ui/Dropdown";
import { exportFromTable } from "@/lib/export/table-export";

type FilterOption = string | { value: string; label: string };

type TableHeaderProps = {
  searchQuery?: string;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClear?: () => void;
  title?: string;
  isLoading?: boolean;
  table?: any;
  filterLabel?: string;
  filterOptions?: FilterOption[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  showExport?: boolean;
  showFilter?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  headerActions?: React.ReactNode;
  exportFilename?: string;
};

function TableHeader({
  searchQuery,
  handleInputChange,
  handleClear,
  title,
  isLoading = false,
  table,
  filterLabel = "This week",
  filterOptions = ["Today", "This week", "This month"],
  filterValue,
  onFilterChange,
  showExport = true,
  showFilter = true,
  showSearch = true,
  searchPlaceholder = "Search...",
  headerActions,
  exportFilename,
}: TableHeaderProps) {
  const hasData = (table?.getRowModel()?.rows?.length ?? 0) > 0;
  const hasCustomFilter = Boolean(onFilterChange);
  const keepVisible = hasCustomFilter || showSearch || Boolean(headerActions) || showExport;

  // Keep search/filter/export controls visible when wired; otherwise hide on empty/loading.
  if (table && !keepVisible && (isLoading || !hasData)) return null;

  const handleExport = (format: string) => {
    exportFromTable(format, table, {
      title,
      filename: exportFilename || title,
    });
  };

  return (
    <div className="flex items-center justify-between gap-8 p-6 w-full">
      <h3 className="text-xl text-primary-10 font-Raleway font-bold leading-8 tracking-[-0.36px] shrink-0">
        {title}
      </h3>

      <div className={`flex items-center gap-2 ${showSearch ? "flex-1 justify-end max-w-xl" : "shrink-0 ml-auto"}`}>
        {showSearch && (
          <div className="flex items-center gap-2 px-6 py-2.5 bg-transparent rounded-4xl border border-opacityClr-50 w-full">
            {searchQuery ? (
              <X className="text-[#8C9394] cursor-pointer" onClick={handleClear} />
            ) : (
              <Search className="text-[#8C9394]" />
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder={searchPlaceholder}
              className="bg-transparent w-full outline-none placeholder:text-[#8C9394] text-sm"
            />
          </div>
        )}

        {headerActions}

        {showFilter && (
          <Dropdown
            label={filterLabel}
            options={filterOptions}
            value={filterValue}
            onSelect={onFilterChange}
          />
        )}

        {showExport && (
          <Dropdown
            label="Export as"
            options={["CSV", "PDF", "Excel"]}
            onSelect={handleExport}
          />
        )}
      </div>
    </div>
  );
}

export default TableHeader;
