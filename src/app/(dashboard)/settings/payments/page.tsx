"use client";

import BankContents from "@/components/views/BankContents";
import CardContents from "@/components/views/CardContents";
import React, { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";

const Payments = () => {
  const [activeTab, setActiveTab] = useState("banks");
  return (
    <div className="flex flex-col items-start justify-center gap-6 w-full">
      <Breadcrumb items={[{ label: "Settings", href: "/settings" }, { label: "Payments" }]} />
      <div className="flex items-center justify-center gap-2 rounded-[100px] w-full bg-[#ECECEC] transition-all duration-500 ease-linear">
        <button
          className={`px-4 py-[14px] flex items-center justify-center gap-[10px] rounded-[100px] font-Raleway font-semibold text-sm text-center leading-[150%] w-full transition-all duration-500 ease-linear ${
            activeTab === "banks"
              ? "bg-primary-10 text-opacityClr-10"
              : "text-opacityClr-50 bg-transparent"
          }`}
          onClick={() => setActiveTab("banks")}
        >
          Banks
        </button>

        <button
          className={`px-4 py-[14px] flex items-center justify-center gap-[10px] rounded-[100px] font-Raleway font-semibold text-sm text-center leading-[150%] w-full transition-all duration-500 ease-linear ${
            activeTab === "cards"
              ? "bg-primary-10 text-opacityClr-10"
              : "text-opacityClr-50 bg-transparent"
          }`}
          onClick={() => setActiveTab("cards")}
        >
          Cards
        </button>
      </div>

      {/* Content Based on Selected Tab */}
      <div className="w-full">
        {activeTab === "banks" ? <BankContents /> : <CardContents />}
      </div>
    </div>
  );
};

export default Payments;
