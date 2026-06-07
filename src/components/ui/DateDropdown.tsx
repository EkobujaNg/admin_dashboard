// components/DateDropdown.js
import React, { useState } from "react";
import { HiChevronDown } from "react-icons/hi";

const DateDropdown = ({ options, defaultOption, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option);
    }
  };

  return (
    <div className="relative inline-block">
      <div
        className="flex items-center gap-2 py-1 px-2 border border-opacityClr-50 bg-opacityClr-10 rounded-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-normal text-primary-10 leading-5">{selectedOption}</span>
        <HiChevronDown />
      </div>

      {isOpen && (
        <ul className="absolute z-10 mt-2 w-full bg-opacityClr-10 border border-opacityClr-50 rounded-lg shadow-lg">
          {options.map((option) => (
            <li
              key={option}
              className="px-4 py-2 text-sm text-primary-10 hover:bg-gray-100 cursor-pointer rounded-lg"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DateDropdown;
