"use client";
import React, { useState, useImperativeHandle, forwardRef } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import Tooltip from "@/components/ui/Tooltip";

const AddPropertyRevenueForm = forwardRef(({ onSave }, ref) => {
  const initialFormData = {
    monthlyRevenue: "",
    annualRevenue: "",
    occupancyRate: "85",
    revenueShare: "70",
    payoutFrequency: "monthly",
  };

  const [formData, setFormData] = useState(initialFormData);

  useImperativeHandle(ref, () => ({
    getFormData: () => formData,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save button is in the parent drawer, this form just provides the data
  // const handleSave = (e) => {
  //   e.preventDefault();
  //   onSave(formData);
  // };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Monthly Revenue */}
      <div className="flex flex-col gap-2">
        <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">
          Monthly Revenue <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="px-3 py-3 border rounded-l bg-opacityClr-20 text-opacityClr-100 text-base leading-[150%]">₦</span>
          <input
            type="number"
            name="monthlyRevenue"
            value={formData.monthlyRevenue}
            onChange={handleChange}
            required
            className="w-full border border-opacityClr-30 rounded-r-lg p-3 text-opacityClr-100 text-base leading-[150%] outline-none"
          />
        </div>
      </div>

      {/* Annual Revenue */}
      <div className="flex flex-col gap-2">
        <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">
          Annual Revenue <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="px-3 py-3 border rounded-l bg-opacityClr-20 text-opacityClr-100 text-base leading-[150%]">₦</span>
          <input
            type="number"
            name="annualRevenue"
            value={formData.annualRevenue}
            onChange={handleChange}
            required
            className="w-full border border-opacityClr-30 rounded-r-lg p-3 text-opacityClr-100 text-base leading-[150%] outline-none"
          />
        </div>
      </div>

      {/* Occupancy Rate */}
      <div className="flex flex-col gap-2">
        <label className="font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%] flex items-center">
          Occupancy Rate <span className="text-red-500">*</span>
          <Tooltip text="The percentage of time the property is occupied by tenants">
            <span className="ml-2 flex items-center justify-center bg-opacityClr-10 px-2 py-1 rounded-full">
              <HiOutlineInformationCircle className="cursor-pointer text-gray-500" size={18} />
              Info
            </span>
          </Tooltip>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="occupancyRate"
            value={formData.occupancyRate}
            onChange={handleChange}
            required
            min="0"
            max="100"
            className="w-full border border-opacityClr-30 rounded-lg p-3 text-opacityClr-100 text-base leading-[150%] outline-none"
          />
          <span className="px-3 py-3 border rounded-r bg-opacityClr-20 text-opacityClr-100 text-base leading-[150%]">%</span>
        </div>
      </div>

      {/* Revenue Share */}
      <div className="flex flex-col gap-2">
        <label className="font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%] flex items-center">
          Revenue Share <span className="text-red-500">*</span>
          <Tooltip text="The percentage of revenue shared with investors">
            <span className="ml-2 flex items-center justify-center bg-opacityClr-10 px-2 py-1 rounded-full">
              <HiOutlineInformationCircle className="cursor-pointer text-gray-500" size={18} />
              Info
            </span>
          </Tooltip>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="revenueShare"
            value={formData.revenueShare}
            onChange={handleChange}
            required
            min="0"
            max="100"
            className="w-full border border-opacityClr-30 rounded-lg p-3 text-opacityClr-100 text-base leading-[150%] outline-none"
          />
          <span className="px-3 py-3 border rounded-r bg-opacityClr-20 text-opacityClr-100 text-base leading-[150%]">%</span>
        </div>
      </div>

      {/* Payout Frequency */}
      <div className="flex flex-col gap-2">
        <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">
          Payout Frequency <span className="text-red-500">*</span>
        </label>
        <select
          name="payoutFrequency"
          value={formData.payoutFrequency}
          onChange={handleChange}
          className="w-full border border-opacityClr-30 rounded-lg p-3 text-opacityClr-100 text-base leading-[150%] outline-none"
        >
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annually">Annually</option>
        </select>
      </div>
    </div>
  );
});

AddPropertyRevenueForm.displayName = "AddPropertyRevenueForm";

export default AddPropertyRevenueForm;
