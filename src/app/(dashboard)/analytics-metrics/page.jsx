"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import StatsCard from "@/components/ui/StatsCard";
import { worldMap } from "../../../../public/assets/images";
import { XAxis, YAxis, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

const InvestmentRevenueChart = dynamic(() => import("@/components/views/InvestmentRevenueChart"), {
  ssr: false,
  loading: () => <div className="spinner"></div>,
});

const InvestmentMetricsChart = dynamic(() => import("@/components/views/InvestmentMetricsChart"), {
  ssr: false,
  loading: () => <div className="spinner"></div>,
});

const locations = [
  { name: "Lagos", count: 24 },
  { name: "Abuja", count: 16 },
  { name: "Port Harcourt", count: 18 },
  { name: "Kano", count: 22 },
];

const propertyPerformanceData = [
  { property: "WNE1", owned: 3, traded: 1 },
  { property: "SUNC", owned: 4, traded: 1 },
  { property: "LEXF", owned: 3, traded: 1 },
  { property: "WNE2", owned: 4, traded: 1 },
  { property: "FXTR", owned: 3, traded: 1 },
  { property: "RWE7", owned: 4, traded: 1 },
  { property: "OPPR", owned: 5, traded: 3 }, // single full bar
];

const AnalyticsPage = () => {
  const maxCount = Math.max(...locations.map((l) => l.count));
  return (
    <section className="flex flex-col gap-6 ">
      {/* header */}
      <div className="flex flex-col gap-1 items-start">
        <h2 className="text-primary-10 font-Raleway font-bold text-[28px]">
          Statistics & <span className="text-primary-20"> Revenue Metrics </span>
        </h2>
        <p className="text-primary-10 font-Raleway text-sm">View all statistics and revenue metrics across the system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <StatsCard
          title="Total Property Listed"
          count="0"
          textColor="#1d3638"
          bodyBg="#C2DF93"
          footerBg="#DAECBE"
          footerText=" Starts from 06 Jan 2025"
        />
        <StatsCard
          title="No. Of Traded Stock"
          count="0"
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Starts from 06 Jan 2025"
        />
        <StatsCard
          title="Total Revenue Generated"
          count="₦0.00"
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Starts from 06 Jan 2025"
        />
        <StatsCard
          title="Inactive Stocks"
          count="0"
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Starts from 06 Jan 2025"
        />
      </div>

      {/* analytics 1 */}
      <div className="flex items-center gap-4 w-full">
        {/* InvestmentRevenue Chart */}
        <InvestmentRevenueChart />

        {/* InvestmentMetrics chart */}
        <InvestmentMetricsChart />
      </div>

      {/* analytics 1 */}
      <div className="flex items-start gap-4 w-full">
        {/* world map */}
        <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 w-full md:w-[30%]">
          <h2 className="text-base text-primary-10 font-Raleway font-bold leading-5">Property Location</h2>
          <Image src={worldMap} alt="world map" className="w-full h-auto object-cover" />
          <ul className="flex flex-col gap-4">
            {locations.map((location) => (
              <li key={location.name} className="w-full">
                <div className="flex justify-between text-sm font-medium text-gray-700">
                  <span>{location.name}</span>
                  <span>{location.count}</span>
                </div>
                <div className="w-full bg-gray-200 h-1 rounded">
                  <div className="bg-primary-10 h-1 rounded" style={{ width: `${(location.count / maxCount) * 100}%` }}></div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* bar chart */}
        <div className="w-full md:w-[70%] bg-white rounded-2xl p-6 flex flex-col gap-10">
          {/* The bar chart title */}
          <h2 className="text-base text-primary-10 font-Raleway font-bold leading-5">Property Performance Stats</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={propertyPerformanceData}>
              <XAxis dataKey="property" />
              <YAxis domain={[0, 5]} tickCount={6} tickFormatter={(value) => `${value}yrs`} />
              {/* <Tooltip /> */}
              <Legend />
              <Bar dataKey="owned" stackId="a" fill="#325E62" maxBarSize={24} />
              <Bar dataKey="traded" stackId="a" fill="#a6bbbc" maxBarSize={24} />

              {/* <Bar
                dataKey="special"
                fill="#C2DF93"
                data={propertyPerformanceData.map((item) =>
                  item.property === "OPPR" ? { ...item, special: item.owned } : { ...item, special: 0 }
                )}
              /> */}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsPage;
