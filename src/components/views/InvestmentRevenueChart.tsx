"use client";

import React, { useState, memo } from "react";
import DateDropdown from "@/components/ui/DateDropdown";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Generate date options dynamically
const currentYear = new Date().getFullYear();
const dateOptions = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => (2020 + i).toString());

const investmentRevenueData = [
  { month: "Jan", current: 880000, previous: 954000 },
  { month: "Feb", current: 620000, previous: 310000 },
  { month: "Mar", current: 740000, previous: 430000 },
  { month: "Apr", current: 710000, previous: 490000 },
  { month: "May", current: 670000, previous: 550000 },
  { month: "Jun", current: 790000, previous: 590000 },
  { month: "Jul", current: 830000, previous: 700000 },
  { month: "Aug", current: 870000, previous: 820000 },
  { month: "Sep", current: 920000, previous: 870000 },
  { month: "Oct", current: 945000, previous: 965000 },
  { month: "Nov", current: 975000, previous: 990000 },
  { month: "Dec", current: 1000000, previous: 1000000 },
];

const CustomTooltip = ({ active, payload, label }: { active?: any; payload?: any; label?: any }) => {
  if (active && payload && payload.length) {
    const current = payload.find((p) => p.dataKey === "current")?.value;
    const previous = payload.find((p) => p.dataKey === "previous")?.value;

    return (
      <div className="flex flex-col items-start justify-end rounded-lg border border-[#dee5f2] bg-white shadow-md w-fit">
        <div className="flex items-center py-[10px] px-4 gap-2 border border-[#dee5f2] bg-[#f7f8fa] w-full rounded-t-lg">
          <p className="text-sm font-medium text-primary-10 leading-5 w-full">{label}</p>
        </div>

        {current !== undefined && (
          <div className="flex items-center gap-4 justify-between  p-3  w-full">
            <div className="w-1 h-4 rounded bg-[#8CB326]"></div>
            <p className="text-sm font-normal font-Raleway text-primary-10 leading-5">Current Revenue</p>
            <p className="text-sm font-semibold font-Raleway text-primary-10 leading-5">₦{current.toLocaleString()}</p>
          </div>
        )}

        {previous !== undefined && (
          <div className="flex items-center gap-4 justify-between p-3  w-full">
            <div className="w-1 h-4 rounded bg-[#1D3638]"></div>
            <p className="text-sm font-normal font-Raleway text-primary-10 leading-5">Previous Revenue</p>
            <p className="text-sm font-semibold font-Raleway text-primary-10 leading-5">₦{previous.toLocaleString()}</p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const InvestmentRevenueChart = memo(() => {
  const [selectedYear, setSelectedYear] = useState("2024");
  return (
    <div className="w-full md:w-[70%] bg-[#EFF1F1]  rounded-2xl p-6 flex flex-col gap-10">
      {/* The line graph info  */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3 w-full">
          <h2 className="text-base text-primary-10 font-Raleway font-bold leading-5">Investment Revenue</h2>

          <span className="text-opacityClr-20 font-normal text-base">|</span>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8CB326]"></span>
            <p className="text-xs text-primary-10 font-normal leading-4">
              Current Year: <span className="font-bold">₦188,211.78</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full  bg-[#1D3638]"></span>
            <p className="text-xs text-primary-10 font-normal leading-4">
              Previous Year: <span className="font-bold">₦954,098.23</span>
            </p>
          </div>
        </div>

        <DateDropdown options={dateOptions} defaultOption={selectedYear} onChange={(selected) => setSelectedYear(selected)} />
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={investmentRevenueData}
          margin={{
            top: 10,
            bottom: 10,
            left: 20,
            right: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="current" stroke="#8CB326" name="Current Year" activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="previous" stroke="#1D3638" strokeDasharray="5 5" name="Previous Year" activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

InvestmentRevenueChart.displayName = "InvestmentRevenueChart";

export default InvestmentRevenueChart;
