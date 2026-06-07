import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const Dropdown = ({ label, options, onSelect = () => {} }: { label: any; options: any; onSelect?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(label);

  const handleSelect = (option) => {
    setSelected(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-auto min-w-[120px]">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-4xl border border-opacityClr-50 bg-transparent text-sm text-primary-10 whitespace-nowrap"
      >
        {selected}
        <FaChevronDown size={12} />
      </button>

      {isOpen && (
        <ul className="absolute top-full left-0 w-full mt-1 bg-white rounded-xl shadow-md z-10">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 text-sm text-primary-10 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
