"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const RentalUnitsTable = ({ rentalUnits = [], onChange }) => {
  const [units, setUnits] = useState(rentalUnits || []);

  // Sync with parent when rentalUnits prop changes
  useEffect(() => {
    setUnits(rentalUnits || []);
  }, [rentalUnits]);

  const handleAddUnit = () => {
    const newUnit = {
      id: Date.now(),
      unitType: "",
      numberOfUnits: "",
      monthlyRent: "",
      annualRent: 0,
    };
    const updatedUnits = [...units, newUnit];
    setUnits(updatedUnits);
    onChange(updatedUnits);
  };

  const handleUpdateUnit = (id, field, value) => {
    const updatedUnits = units.map((unit) => {
      if (unit.id === id) {
        const updated = { ...unit, [field]: value };
        // Auto-calculate annual rent
        if (field === "monthlyRent") {
          const monthly = parseFloat(value) || 0;
          updated.annualRent = monthly * 12;
        }
        return updated;
      }
      return unit;
    });
    setUnits(updatedUnits);
    onChange(updatedUnits);
  };

  const handleDeleteUnit = (id) => {
    const updatedUnits = units.filter((unit) => unit.id !== id);
    setUnits(updatedUnits);
    onChange(updatedUnits);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-primary-10 font-Raleway font-bold text-lg">Rental Units</h3>
      
      {units.length > 0 && (
        <div className="rounded-lg border border-opacityClr-30 bg-white overflow-hidden">
          <table className="w-full">
            <thead className="bg-opacityClr-10">
              <tr>
                <th className="text-left px-4 py-3 text-primary-10 font-Raleway font-semibold text-sm">Unit Type / Name</th>
                <th className="text-left px-4 py-3 text-primary-10 font-Raleway font-semibold text-sm">No. of Units</th>
                <th className="text-left px-4 py-3 text-primary-10 font-Raleway font-semibold text-sm">Monthly Rent per Unit (₦)</th>
                <th className="text-left px-4 py-3 text-primary-10 font-Raleway font-semibold text-sm">Annual Rent (₦)</th>
                <th className="text-left px-4 py-3 text-primary-10 font-Raleway font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.id} className="border-b border-opacityClr-30 hover:bg-opacityClr-10 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={unit.unitType}
                      onChange={(e) => handleUpdateUnit(unit.id, "unitType", e.target.value)}
                      placeholder="e.g., 2-Bed Flat"
                      className="w-full px-3 py-2 rounded-lg border border-opacityClr-30 bg-white text-primary-10 font-Raleway text-sm outline-none focus:border-primary-10 transition-colors"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={unit.numberOfUnits}
                      onChange={(e) => handleUpdateUnit(unit.id, "numberOfUnits", e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 rounded-lg border border-opacityClr-30 bg-white text-primary-10 font-Raleway text-sm outline-none focus:border-primary-10 transition-colors"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={unit.monthlyRent}
                      onChange={(e) => handleUpdateUnit(unit.id, "monthlyRent", e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 rounded-lg border border-opacityClr-30 bg-white text-primary-10 font-Raleway text-sm outline-none focus:border-primary-10 transition-colors"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-primary-10 font-Raleway text-sm">
                      ₦{unit.annualRent.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteUnit(unit.id)}
                      className="flex items-center justify-center w-8 h-8 rounded-lg border border-red-200 bg-transparent hover:bg-red-50 transition-colors"
                    >
                      <FaTrash className="text-red-500" size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={handleAddUnit}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-10 text-white font-Raleway font-semibold text-sm rounded-lg hover:bg-primary-10/90 transition-colors w-fit"
      >
        <FaPlus size={16} />
        <span>Add Unit</span>
      </button>
    </div>
  );
};

export default RentalUnitsTable;

