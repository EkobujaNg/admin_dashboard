"use client";

import React, { memo } from "react";

import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#a6bbbc", "#325E62", "#1D3638", "#C2DF93"];
const investmentMetricsData = [
  { name: "Rivers", value: 14.3 },
  { name: "Kano", value: 23.7 },
  { name: "Lagos", value: 38.6 },
  { name: "Abuja", value: 32.1 },
];

const InvestmentMetricsChart = memo(() => {
  return (
    <div className="bg-[#EFF1F1] rounded-2xl p-6 flex flex-col gap-4 w-full md:w-[30%]">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-sm text-primary-10 font-Raleway font-semibold leading-5">Investment metrics</h2>
        <div className="text-[10px] bg-[#2C4244] text-white px-2 py-1 rounded-full font-semibold">98.6%</div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Tooltip />

          <Pie
            data={investmentMetricsData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
            startAngle={90}
            endAngle={-270}
            paddingAngle={3}
          >
            {investmentMetricsData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-col gap-4 pl-2 text-sm text-primary-10 font-semibold font-Raleway">
        {investmentMetricsData.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between w-full pr-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
              <span>{item.name}</span>
            </div>
            <span>{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
});

InvestmentMetricsChart.displayName = "InvestmentMetricsChart";

export default InvestmentMetricsChart;
