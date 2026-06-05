"use client";

import React, { useState } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { IoMdNotifications, IoIosArrowForward } from "react-icons/io";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import Tooltip from "@/components/ui/Tooltip"; // Assuming Tooltip is needed here based on the image

const PropertyRevenueForm = ({ property, onSave }) => {
  // Added property and onSave props
  const [isExpenditureOpen, setIsExpenditureOpen] = useState(false);

  // Added state and handleChange/handleSave for the revenue form fields
  const initialFormData = {
    monthlyRevenue: property?.monthlyRevenue?.replace(/[^\\d.]/g, "") || "",
    annualRevenue: property?.annualRevenue?.replace(/[^\\d.]/g, "") || "",
    occupancyRate: property?.occupancyRate || "85",
    revenueShare: property?.revenueShare || "70",
    lastPayout: property?.lastPayout || "",
    nextPayout: property?.nextPayout || "",
    payoutFrequency: property?.payoutFrequency || "monthly",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const expenditureItems = [
    { label: "Monthly service charge", value: "₦0.00" },
    { label: "Steward salary", value: "₦0.00" },
    { label: "Towel replacement", value: "₦0.00" },
    { label: "Bedsheet replacement", value: "₦0.00" },
    { label: "Dish soap and toiletries", value: "₦0.00" },
    { label: "Diesel energy bill", value: "₦0.00" },
    { label: "Govt energy bill", value: "₦0.00" },
    { label: "Plumbing repairs", value: "₦0.00" },
    { label: "Repainting", value: "₦0.00" },
    { label: "Furniture or upholstery repair", value: "₦0.00" },
    { label: "Legal expense to eject tenant", value: "₦0.00" },
  ];

  const toggleExpenditure = () => {
    setIsExpenditureOpen(!isExpenditureOpen);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto pb-24">
      <div className="flex flex-col gap-4 w-full">
        {/* Property Current Value */}
        <div className="flex flex-col gap-1 items-start">
          <span className="text-primary-10 font-Raleway font-medium leading-[20px] text-sm">Property Current Value:</span>
          <p className="text-opacityClr-100 text-2xl font-bold font-Raleway leading-normal">₦20,995,670.88</p>
          <div className="flex gap-2 items-start">
            <span className="text-primary-10 font-Raleway font-medium leading-[20px] text-sm">₦20,995</span>
            <span className="text-[#6D9F1B] font-Raleway font-bold leading-normal text-sm">▲ 0.1%</span>
            <span className="text-primary-20 font-Raleway font-bold leading-normal text-sm">~today</span>
          </div>
        </div>
        {/* Property analytics */}
        <div className="bg-opacityClr-20 h-[288px] w-full"></div>
        {/* price alert */}
        <div className="flex items-center gap-4 w-full">
          <span className="flex w-12 h-12 p-2.5 items-center justify-center gap-2.5 rounded-lg bg-opacityClr-10">
            <IoMdNotifications className="text-primary-20" size={20} />
          </span>
          <p className="text-primary-10 font-Raleway font-semibold text-sm leading-normal flex-1">Price Alert</p>
          <span className="flex w-12 h-12 p-2.5 items-center justify-center gap-2.5 rounded-lg bg-transparent">
            <IoIosArrowForward className="text-primary-20" size={20} />
          </span>
        </div>
        {/* total revenue */}
        <div className="flex flex-col items-start gap-2 px-4 py-5 border border-opacityClr-30 rounded-2xl w-full">
          <p className="text-sm text-primary-10 font-Raleway font-medium leading-normal">Total revenue</p>
          <h2 className="font-Raleway font-semibold text-2xl text-primary-10 leading-[130%]">₦0.00</h2>
        </div>
        {/* total savings */}
        <div className="flex flex-col items-start gap-2 px-4 py-5 border border-opacityClr-30 rounded-2xl w-full">
          <p className="text-sm text-primary-10 font-Raleway font-medium leading-normal">Total savings</p>
          <h2 className="font-Raleway font-semibold text-2xl text-primary-10 leading-[130%]">₦0.00</h2>
        </div>
        {/* nwt profits*/}
        <div className="flex flex-col items-start gap-2 px-4 py-5 border border-opacityClr-30 rounded-2xl w-full">
          <p className="text-sm text-primary-10 font-Raleway font-medium leading-normal flex items-center">
            Net Profit
            <HiOutlineInformationCircle className="ml-2 text-[#1D3638]" />
          </p>
          <h2 className="font-Raleway font-semibold text-2xl text-primary-10 leading-[130%]">₦0.00</h2>
        </div>
        {/* total expenditure / maintenance fees */}
        <div className="flex flex-col items-start gap-2 px-4 py-5 border border-opacityClr-30 rounded-2xl w-full">
          <p className="text-sm text-primary-10 font-Raleway font-medium leading-normal">Total expenditure / maintenance fees </p>
          <h2 className="font-Raleway font-semibold text-2xl text-primary-10 leading-[130%]">₦0.00</h2>
        </div>
        {/* Expenditure Breakdown */}
        <div className="flex flex-col items-start w-full border border-opacityClr-30 rounded-2xl">
          <div className="flex items-center justify-between w-full px-4 py-5 cursor-pointer" onClick={toggleExpenditure}>
            <h3 className="text-primary-10 font-Raleway font-semibold text-base leading-normal">Expenditure Breakdown</h3>
            {isExpenditureOpen ? (
              <MdKeyboardArrowUp className="text-primary-10" size={24} />
            ) : (
              <MdKeyboardArrowDown className="text-primary-10" size={24} />
            )}
          </div>
          {isExpenditureOpen && (
            <div className="w-full border-t border-opacityClr-30">
              {expenditureItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between w-full px-4 py-3 border-b border-opacityClr-30 last:border-b-0"
                >
                  <p className="text-primary-10 font-Raleway font-normal text-sm leading-normal">{item.label}</p>
                  <p className="text-primary-10 font-Raleway font-normal text-sm leading-normal">{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed buttons at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white py-3 px-6 border-t border-opacityClr-20">
        {" "}
        {/* Added px-6 */}
        <div className="flex items-center gap-4 w-full">
          {/* Liquidate button removed as per previous form structure */}
          <button
            type="button" // Changed to type="button" since it's not the primary form submit button here
            className="block w-full rounded-md border border-transparent py-3 px-5 bg-opacityClr-60 text-base text-white font-semibold leading-[150%] transition-all duration-300 ease-in-out hover:bg-opacityClr-80 cursor-pointer"
            onClick={handleSave} // Added onClick handler
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyRevenueForm;
