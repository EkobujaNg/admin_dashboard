"use client";
import { FaSearch, FaTimes } from "react-icons/fa";
import Dropdown from "../ui/Dropdown";

function TableHeader({ searchQuery, handleInputChange, handleClear, title, isLoading = false, table }: { searchQuery?: any; handleInputChange?: any; handleClear?: any; title?: any; isLoading?: boolean; table?: any }) {
  const hasData = table?.getRowModel().rows.length > 0;

  // Hide header when loading OR no data
  if (isLoading || !hasData) return null;

  return (
    <div className="flex items-center justify-between gap-8 p-6 w-full">
      <h3 className="text-xl text-primary-10 font-Raleway font-bold leading-8 tracking-[-0.36px] flex-1">{title}</h3>

      <div className="flex items-center gap-2 flex-1/4">
        <div className="flex items-center gap-2 px-6 py-2.5 bg-transparent rounded-4xl border border-opacityClr-50 w-full">
          {searchQuery ? (
            <FaTimes className="text-[#8C9394] cursor-pointer" onClick={handleClear} />
          ) : (
            <FaSearch className="text-[#8C9394]" />
          )}
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search..."
            className="bg-transparent w-full outline-none placeholder:text-[#8C9394] text-sm"
          />
        </div>

        <Dropdown label="This week" options={["Today", "This week", "This month"]} />

        <Dropdown label="Export as" options={["CSV", "PDF", "Excel"]} />
      </div>
    </div>
  );
}

export default TableHeader;
