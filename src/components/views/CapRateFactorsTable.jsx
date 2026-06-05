"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaTimes } from "react-icons/fa";

// Factor Row Component
const FactorRow = ({ factor, onUpdate, onAddOption, onRemoveOption, onDelete }) => {
  const [newOption, setNewOption] = useState("");

  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg border border-opacityClr-30 bg-opacityClr-10">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={factor.name}
            onChange={(e) => onUpdate(factor.id, "name", e.target.value)}
            placeholder="e.g., Property Tier (Location Quality)"
            className="w-full px-4 py-3 rounded-lg border border-opacityClr-30 bg-white text-primary-10 font-Raleway text-sm outline-none focus:border-primary-10 transition-colors"
          />
        </div>
        <div className="flex-1">
          <select
            value={factor.value}
            onChange={(e) => onUpdate(factor.id, "value", e.target.value)}
            disabled={!factor.options || factor.options.length === 0}
            className="w-full px-4 py-3 rounded-lg border border-opacityClr-30 bg-white text-primary-10 font-Raleway text-sm outline-none focus:border-primary-10 transition-colors disabled:bg-opacityClr-20 disabled:cursor-not-allowed"
          >
            <option value="">Select an option</option>
            {(factor.options || []).map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => onDelete(factor.id)}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-red-200 bg-transparent hover:bg-red-50 transition-colors"
        >
          <FaTrash className="text-red-500" size={14} />
        </button>
      </div>

      {/* Options Management */}
      <div className="flex flex-col gap-2 pl-4 border-l-2 border-primary-10">
        <label className="text-primary-10 font-Raleway font-semibold text-xs">Options:</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder="Enter option..."
            className="flex-1 px-3 py-2 rounded-lg border border-opacityClr-30 bg-white text-primary-10 font-Raleway text-sm outline-none focus:border-primary-10 transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddOption(factor.id, newOption);
                setNewOption("");
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              onAddOption(factor.id, newOption);
              setNewOption("");
            }}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-10 text-white hover:bg-primary-10/90 transition-colors"
          >
            <FaPlus size={12} />
          </button>
        </div>
        
        {/* Options List */}
        {factor.options && factor.options.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {factor.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-opacityClr-30 bg-white"
              >
                <span className="text-primary-10 font-Raleway text-xs">{option}</span>
                <button
                  type="button"
                  onClick={() => onRemoveOption(factor.id, option)}
                  className="flex items-center justify-center w-5 h-5 rounded-full border border-red-200 bg-transparent hover:bg-red-50 transition-colors"
                >
                  <FaTimes className="text-red-500" size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
        {(!factor.options || factor.options.length === 0) && (
          <p className="text-opacityClr-50 font-Raleway text-xs">Add at least one option to enable the dropdown</p>
        )}
      </div>
    </div>
  );
};

const CapRateFactorsTable = ({ factors = [], onChange }) => {
  const [factorItems, setFactorItems] = useState(factors || []);

  // Sync with parent when factors prop changes
  useEffect(() => {
    setFactorItems(factors || []);
  }, [factors]);

  const handleAddFactor = () => {
    const newFactor = {
      id: Date.now(),
      name: "",
      value: "",
      options: [],
    };
    const updatedFactors = [...factorItems, newFactor];
    setFactorItems(updatedFactors);
    onChange(updatedFactors);
  };

  const handleUpdateFactor = (id, field, value) => {
    const updatedFactors = factorItems.map((factor) => {
      if (factor.id === id) {
        const updated = { ...factor, [field]: value };
        // If value is changed and it's not in options, clear it
        if (field === "value" && updated.options.length > 0 && !updated.options.includes(value)) {
          updated.value = "";
        }
        return updated;
      }
      return factor;
    });
    setFactorItems(updatedFactors);
    onChange(updatedFactors);
  };

  const handleAddOption = (id, optionText) => {
    if (!optionText.trim()) return;
    
    const updatedFactors = factorItems.map((factor) => {
      if (factor.id === id) {
        const options = factor.options || [];
        if (!options.includes(optionText.trim())) {
          return {
            ...factor,
            options: [...options, optionText.trim()],
          };
        }
      }
      return factor;
    });
    setFactorItems(updatedFactors);
    onChange(updatedFactors);
  };

  const handleRemoveOption = (id, optionToRemove) => {
    const updatedFactors = factorItems.map((factor) => {
      if (factor.id === id) {
        const options = (factor.options || []).filter((opt) => opt !== optionToRemove);
        // If the removed option was the selected value, clear the value
        const value = factor.value === optionToRemove ? "" : factor.value;
        return {
          ...factor,
          options,
          value,
        };
      }
      return factor;
    });
    setFactorItems(updatedFactors);
    onChange(updatedFactors);
  };

  const handleDeleteFactor = (id) => {
    const updatedFactors = factorItems.filter((factor) => factor.id !== id);
    setFactorItems(updatedFactors);
    onChange(updatedFactors);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-primary-10 font-Raleway font-bold text-lg">Cap Rate Factors</h3>
      
      {factorItems.length > 0 && (
        <div className="flex flex-col gap-4 w-full">
          {factorItems.map((factor) => (
            <FactorRow
              key={factor.id}
              factor={factor}
              onUpdate={handleUpdateFactor}
              onAddOption={handleAddOption}
              onRemoveOption={handleRemoveOption}
              onDelete={handleDeleteFactor}
            />
          ))}
        </div>
      )}

      <button
        onClick={handleAddFactor}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-10 text-white font-Raleway font-semibold text-sm rounded-lg hover:bg-primary-10/90 transition-colors w-fit"
      >
        <FaPlus size={16} />
        <span>Add Factor</span>
      </button>
    </div>
  );
};

export default CapRateFactorsTable;

