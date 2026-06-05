"use client";
import React from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message, cancelMsg, confirmMsg, confirmButtonColor = "red" }) => {
  if (!isOpen) return null;

  const confirmButtonClasses =
    confirmButtonColor === "green"
      ? "flex items-center justify-center gap-[10px] p-4 rounded-md border border-[#6D9F1B] bg-transparent text-[#6D9F1B] font-Raleway text-base font-bold leading-6 tracking-[-0.14px] w-full transition-all duration-300 ease-linear hover:bg-[#6D9F1B] hover:border-none hover:text-white"
      : "flex items-center justify-center gap-[10px] p-4 rounded-md border border-[#9F1B1B] bg-transparent text-[#9F1B1B] font-Raleway text-base font-bold leading-6 tracking-[-0.14px] w-full transition-all duration-300 ease-linear hover:bg-[#9F1B1B] hover:border-none hover:text-white";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[100]" onClick={onClose}>
      <div className="flex flex-col items-start justify-center bg-white rounded-2xl shadow w-[603px] text-center">
        <div className="flex flex-col items-center gap-4 p-6 rounded-t-2xl bg-[#F0F0F0] w-full">
          <p className="text-primary-10 text-center font-Raleway text-xl font-bold leading-normal">Are you sure?</p>
        </div>

        {/* Modal Message */}
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-10 bg-white w-full">
          <p className="text-primary-10 text-center font-Raleway text-xl font-semibold leading-normal">{message}</p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4 px-6 py-5 w-full bg-white shadow rounded-b-2xl">
          <button onClick={onConfirm} className={confirmButtonClasses}>
            {confirmMsg}
          </button>

          <button
            onClick={onClose}
            className="flex items-center justify-center gap-[10px] p-4  rounded-md border border-transparent bg-opacityClr-100 text-white font-Raleway text-base font-bold leading-6 tracking-[-0.14px] w-full transition-all duration-300 ease-linear hover:bg-transparent hover:border-opacityClr-100 hover:text-opacityClr-100"
          >
            {cancelMsg}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
