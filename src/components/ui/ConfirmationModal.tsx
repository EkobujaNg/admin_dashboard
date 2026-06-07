"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  cancelMsg: string;
  confirmMsg: string;
  confirmButtonColor?: "red" | "green";
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  cancelMsg,
  confirmMsg,
  confirmButtonColor = "red",
}: ConfirmationModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  const confirmButtonClasses =
    confirmButtonColor === "green"
      ? "flex flex-1 items-center justify-center px-4 py-3.5 rounded-xl border border-[#6D9F1B] bg-white text-[#6D9F1B] font-Raleway text-sm font-bold leading-normal transition-all duration-200 hover:bg-[#6D9F1B] hover:text-white"
      : "flex flex-1 items-center justify-center px-4 py-3.5 rounded-xl border border-[#9F1B1B] bg-white text-[#9F1B1B] font-Raleway text-sm font-bold leading-normal transition-all duration-200 hover:bg-[#9F1B1B] hover:text-white";

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
      >
        <div className="px-6 pt-6 pb-2">
          <h2
            id="confirmation-modal-title"
            className="text-primary-10 font-Raleway text-xl font-bold leading-normal text-center"
          >
            Are you sure?
          </h2>
          <p className="mt-4 text-primary-10 font-Raleway text-base font-medium leading-normal text-center">
            {message}
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch gap-3 px-6 py-6">
          <button
            type="button"
            onClick={onClose}
            className="flex flex-1 items-center justify-center px-4 py-3.5 rounded-xl bg-opacityClr-100 text-white font-Raleway text-sm font-bold leading-normal transition-all duration-200 hover:bg-opacityClr-80"
          >
            {cancelMsg}
          </button>

          <button type="button" onClick={onConfirm} className={confirmButtonClasses}>
            {confirmMsg}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
