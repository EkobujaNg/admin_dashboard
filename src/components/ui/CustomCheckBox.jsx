import React from "react";

const CustomCheckbox = ({ label, customLabel, checked, onChange }) => {
  return (
    <div className="flex items-center gap-1 cursor-pointer">
      {/* Custom checkbox */}
      <div
        onClick={() => onChange(!checked)}
        className={`w-5 h-5 flex items-center justify-center border-2 rounded-md ${
          checked ? "border-opacityClr-100 bg-opacityClr-100" : "border-opacityClr-30"
        }`}
      >
        {checked && (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Label */}
      <label
        onClick={() => onChange(!checked)}
        className="text-xs md:text-base font-Raleway font-medium text-opacityClr-80 cursor-pointer leading-normal"
      >
        {/* If a customLabel is provided, render it; otherwise, render a simple text label */}
        {customLabel || label}
      </label>
    </div>
  );
};

export default CustomCheckbox;
