"use client";

import React from "react";
import { FaPlus } from "react-icons/fa";

const EmptyRequirementsState = ({ onAddCategory }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 w-full rounded-2xl border border-opacityClr-30 bg-white">
      <button
        onClick={onAddCategory}
        className="flex items-center justify-center w-20 h-20 rounded-full bg-primary-10 text-white hover:bg-primary-10/90 transition-colors"
      >
        <FaPlus size={32} />
      </button>
      <div className="flex flex-col items-center gap-2">
        <p className="text-primary-10 font-Raleway font-semibold text-lg">No requirements yet</p>
        <p className="text-opacityClr-50 font-Raleway text-sm text-center max-w-md">
          Click the plus icon to add your first requirement category
        </p>
      </div>
    </div>
  );
};

export default EmptyRequirementsState;

