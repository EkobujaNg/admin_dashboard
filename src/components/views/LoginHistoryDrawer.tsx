"use client";

import React, { useState } from "react";
import { Laptop, Smartphone } from "lucide-react";
import useLoginHistoryAPI from "@/services/useLoginHistoryAPI";
import {
  formatLoginHistoryDate,
  formatLoginHistoryDeviceLabel,
  isMobileLoginDevice,
  type LoginHistoryEntry,
} from "@/lib/auth/login-history";

function HistoryRow({ entry }: { entry: LoginHistoryEntry }) {
  const Icon = isMobileLoginDevice(entry.deviceType) ? Smartphone : Laptop;

  return (
    <div className="flex flex-col items-start gap-4 border-t border-[#E8EBEB] py-4 w-full">
      <span className="flex p-2.5 items-center justify-center border border-opacityClr-10 rounded">
        <Icon className="w-8 h-8 text-primary-10" />
      </span>

      <div className="flex flex-col items-start gap-2">
        <span className="font-Raleway font-medium text-sm text-opacityClr-40 leading-normal">Device</span>
        <p className="font-Raleway font-semibold text-base text-primary-10 leading-normal">
          {formatLoginHistoryDeviceLabel(entry.deviceType)}
        </p>
      </div>

      <div className="flex flex-col items-start gap-2">
        <span className="font-Raleway font-medium text-sm text-opacityClr-40 leading-normal">Logged in at</span>
        <p className="font-Raleway font-semibold text-base text-primary-10 leading-normal">
          {formatLoginHistoryDate(entry.loggedInAt)}
        </p>
      </div>
    </div>
  );
}

const LoginHistoryDrawer = () => {
  const [page, setPage] = useState(1);
  const { items, isLoading, error, hasMore, totalPages, refetch } = useLoginHistoryAPI({
    page,
    limit: 10,
  });

  return (
    <div className="flex flex-col items-start gap-6 relative h-full">
      <p className="font-Raleway font-normal text-opacityClr-100 text-base leading-[150%]">
        Get a report showing when you logged in to your account.
      </p>

      <div className="flex flex-col gap-2 w-full overflow-y-auto pb-8">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-28 w-full rounded-lg bg-opacityClr-10 animate-pulse" />
          ))
        ) : error ? (
          <div className="flex flex-col gap-3 py-6">
            <p className="font-Raleway text-sm text-opacityClr-80">Could not load login history.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="self-start px-4 py-2 rounded-md bg-neutral-lightGreen text-primary-10 font-semibold text-sm cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="font-Raleway text-sm text-opacityClr-80 py-6">No login history yet.</p>
        ) : (
          items.map((entry) => <HistoryRow key={entry.id} entry={entry} />)
        )}

        {!isLoading && !error && totalPages > 1 ? (
          <div className="flex items-center justify-between gap-3 pt-2 w-full">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2 rounded-md border border-opacityClr-20 text-sm font-semibold disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <span className="text-sm font-Raleway text-opacityClr-60">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={!hasMore}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 rounded-md border border-opacityClr-20 text-sm font-semibold disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LoginHistoryDrawer;
