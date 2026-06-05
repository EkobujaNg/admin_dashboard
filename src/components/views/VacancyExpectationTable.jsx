"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

const VacancyExpectationTable = ({ vacancyData = {}, onChange }) => {
  const [options, setOptions] = useState(vacancyData.options || []);
  const [selectedValue, setSelectedValue] = useState(vacancyData.value || "");
  const [newOption, setNewOption] = useState("");

  // Sync with parent when vacancyData prop changes
  useEffect(() => {
    setOptions(vacancyData.options || []);
    setSelectedValue(vacancyData.value || "");
  }, [vacancyData]);

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      const updatedOptions = [...options, newOption.trim()];
      setOptions(updatedOptions);
      onChange({ options: updatedOptions, value: selectedValue });
      setNewOption("");
    }
  };

  const handleRemoveOption = (optionToRemove) => {
    const updatedOptions = options.filter((opt) => opt !== optionToRemove);
    setOptions(updatedOptions);
    // If the removed option was the selected value, clear the value
    const newValue = selectedValue === optionToRemove ? "" : selectedValue;
    setSelectedValue(newValue);
    onChange({ options: updatedOptions, value: newValue });
  };

  const handleValueChange = (value) => {
    setSelectedValue(value);
    onChange({ options, value });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-primary-10 font-Raleway font-bold text-lg">Vacancy Expectation</h3>
      
      <div className="flex flex-col gap-4 p-4 rounded-lg border border-opacityClr-30 bg-opacityClr-10">
        {/* Dropdown Select */}
        <div className="flex flex-col gap-2">
          <label className="text-primary-10 font-Raleway font-semibold text-sm">Default Value</label>
          <select
            value={selectedValue}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={options.length === 0}
            className="w-full px-4 py-3 rounded-lg border border-opacityClr-30 bg-white text-primary-10 font-Raleway text-sm outline-none focus:border-primary-10 transition-colors disabled:bg-opacityClr-20 disabled:cursor-not-allowed"
          >
            <option value="">Select vacancy expectation</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          {options.length === 0 && (
            <p className="text-red-500 font-Raleway text-xs">Add at least one option to enable the dropdown</p>
          )}
        </div>

        {/* Options Management */}
        <div className="flex flex-col gap-2 pt-4 border-t border-opacityClr-30">
          <label className="text-primary-10 font-Raleway font-semibold text-sm">Options</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="e.g., Prime Estate (5%)"
              className="flex-1 px-4 py-3 rounded-lg border border-opacityClr-30 bg-white text-primary-10 font-Raleway text-sm outline-none focus:border-primary-10 transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddOption();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddOption}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-10 text-white hover:bg-primary-10/90 transition-colors"
            >
              <FaPlus size={14} />
            </button>
          </div>
          
          {/* Options List */}
          {options.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-opacityClr-30 bg-white"
                >
                  <span className="text-primary-10 font-Raleway text-sm">{option}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(option)}
                    className="flex items-center justify-center w-5 h-5 rounded-full border border-red-200 bg-transparent hover:bg-red-50 transition-colors"
                  >
                    <FaTimes className="text-red-500" size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VacancyExpectationTable;

