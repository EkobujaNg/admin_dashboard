"use client";
import { flexRender } from "@tanstack/react-table";
import Image from "next/image";

function TableHeadAndBody({ table, emptyState, isLoading = false }) {
  const columnCount = table.getAllLeafColumns().length;

  const hasData = table.getRowModel().rows.length > 0;

  return (
    <table className="w-full border-none text-left overflow-scroll overflow-x-auto">
      {/* TABLE HEADER (always show while loading or when data exists) */}
      {(hasData || isLoading) && (
        <thead className="bg-opacityClr-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="text-primary-10 text-base font-semibold py-6 px-6 capitalize">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
      )}

      <tbody>
        {/* 🔄 LOADING STATE */}
        {isLoading && (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-neutral-200 animate-pulse">
                {Array.from({ length: columnCount }).map((__, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 w-full bg-gray-200 rounded-md" />
                  </td>
                ))}
              </tr>
            ))}
          </>
        )}

        {/* DATA STATE */}
        {!isLoading && hasData && (
          <>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-neutral-50 transition-bg duration-300 border-b border-neutral-200">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-2.5 text-primary-10 text-[15px] font-semibold">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !hasData && (
          <tr>
            <td colSpan={columnCount} className="py-10">
              <div className="flex flex-col items-center justify-center gap-6 max-w-[500px] mx-auto self-center">
                {emptyState?.image && <Image src={emptyState.image} alt={emptyState.alt || "No data"} />}

                {emptyState?.message && (
                  <span className="text-[#A5AFAF] text-sm font-normal leading-normal text-center font-Raleway">{emptyState.message}</span>
                )}

                {emptyState?.action && (
                  <button
                    type="button"
                    onClick={emptyState.action.onClick}
                    className="py-3.5 px-6 bg-primary-10 text-white font-Raleway font-semibold text-base leading-6 rounded-lg transition-all duration-500 ease-in-out hover:text-primary-10 hover:bg-transparent border border-primary-10 cursor-pointer w-full"
                  >
                    {emptyState.action.label}
                  </button>
                )}
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default TableHeadAndBody;
