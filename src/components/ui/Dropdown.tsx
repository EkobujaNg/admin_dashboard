"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

type DropdownOption = string | { value: string; label: string };

type DropdownProps = {
  label: string;
  options: DropdownOption[];
  value?: string;
  onSelect?: (value: string) => void;
};

function getOptionValue(option: DropdownOption) {
  return typeof option === "string" ? option : option.value;
}

function getOptionLabel(option: DropdownOption) {
  return typeof option === "string" ? option : option.label;
}

const Dropdown = ({ label, options, value, onSelect = () => {} }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(label);

  useEffect(() => {
    if (value == null) return;

    const matched = options.find((option) => getOptionValue(option) === value);
    setSelected(matched ? getOptionLabel(matched) : label);
  }, [value, options, label]);

  const handleSelect = (option: DropdownOption) => {
    const nextValue = getOptionValue(option);
    setSelected(getOptionLabel(option));
    onSelect(nextValue);
    setIsOpen(false);
  };

  return (
    <div className="relative w-auto min-w-[120px]">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-4xl border border-opacityClr-50 bg-transparent text-sm text-primary-10 whitespace-nowrap"
      >
        {selected}
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <ul className="absolute top-full left-0 min-w-full mt-1 bg-white rounded-xl shadow-md z-10 max-h-72 overflow-y-auto">
          {options.map((option) => {
            const optionValue = getOptionValue(option);
            const optionLabel = getOptionLabel(option);

            return (
              <li
                key={optionValue}
                onClick={() => handleSelect(option)}
                className="px-4 py-2 text-sm text-primary-10 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
              >
                {optionLabel}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
