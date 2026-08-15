"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";

type IdleTimeoutWarningModalProps = {
  isOpen: boolean;
  secondsRemaining: number;
  onStayLoggedIn: () => void;
};

const IdleTimeoutWarningModal = ({ isOpen, secondsRemaining, onStayLoggedIn }: IdleTimeoutWarningModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 px-4"
      role="presentation"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="idle-timeout-modal-title"
      >
        <div className="px-6 pt-6 pb-2">
          <h2
            id="idle-timeout-modal-title"
            className="text-primary-10 font-Raleway text-xl font-bold leading-normal text-center"
          >
            Still there?
          </h2>
          <p className="mt-4 text-primary-10 font-Raleway text-base font-medium leading-normal text-center">
            You&apos;ll be logged out due to inactivity in{" "}
            <span className="font-bold">{secondsRemaining}s</span>.
          </p>
        </div>

        <div className="flex items-stretch gap-3 px-6 py-6">
          <button
            type="button"
            onClick={onStayLoggedIn}
            className="flex flex-1 items-center justify-center px-4 py-3.5 rounded-xl bg-opacityClr-100 text-white font-Raleway text-sm font-bold leading-normal transition-all duration-200 hover:bg-opacityClr-80"
          >
            Stay logged in
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default IdleTimeoutWarningModal;
