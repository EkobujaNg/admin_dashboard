"use client";

import React, { useMemo, useState, memo } from "react";
import DateDropdown from "@/components/ui/DateDropdown";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  formatChartPeriodLabel,
  formatCompactMoney,
  formatDashboardMoney,
} from "@/lib/dashboard/mappers";
import type { DashboardChartPeriod, DashboardIncomeCharts } from "@/lib/dashboard/types";

const RANGE_OPTIONS = ["Daily", "Weekly", "Monthly"] as const;

const RANGE_MAP: Record<(typeof RANGE_OPTIONS)[number], DashboardChartPeriod> = {
  Daily: "daily",
  Weekly: "weekly",
  Monthly: "monthly",
};

type InvestmentRevenueChartProps = {
  income?: DashboardIncomeCharts | null;
  isLoading?: boolean;
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const amount = payload[0]?.value ?? 0;

  return (
    <div className="flex flex-col items-start justify-end rounded-lg border border-[#dee5f2] bg-white shadow-md w-fit">
      <div className="flex items-center py-[10px] px-4 gap-2 border border-[#dee5f2] bg-[#f7f8fa] w-full rounded-t-lg">
        <p className="text-sm font-medium text-primary-10 leading-5 w-full">{label}</p>
      </div>
      <div className="flex items-center gap-4 justify-between p-3 w-full">
        <div className="w-1 h-4 rounded bg-[#8CB326]" />
        <p className="text-sm font-normal font-Raleway text-primary-10 leading-5">Income</p>
        <p className="text-sm font-semibold font-Raleway text-primary-10 leading-5">
          {formatDashboardMoney(amount)}
        </p>
      </div>
    </div>
  );
};

const InvestmentRevenueChart = memo(({ income, isLoading = false }: InvestmentRevenueChartProps) => {
  const [selectedRange, setSelectedRange] = useState<(typeof RANGE_OPTIONS)[number]>("Daily");
  const periodKey = RANGE_MAP[selectedRange];

  const chartData = useMemo(() => {
    const points = income?.[periodKey] ?? [];
    return points.map((point) => ({
      label: formatChartPeriodLabel(point.period, periodKey),
      amount: point.amount,
    }));
  }, [income, periodKey]);

  const total = useMemo(
    () => chartData.reduce((sum, point) => sum + (point.amount || 0), 0),
    [chartData]
  );

  return (
    <div className="w-full bg-[#EFF1F1] rounded-2xl p-6 flex flex-col gap-10">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-base text-primary-10 font-Raleway font-bold leading-5">Income</h2>
          <span className="text-opacityClr-20 font-normal text-base">|</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8CB326]" />
            <p className="text-xs text-primary-10 font-normal leading-4">
              {selectedRange} total: <span className="font-bold">{formatDashboardMoney(total)}</span>
            </p>
          </div>
        </div>

        <DateDropdown
          options={[...RANGE_OPTIONS]}
          defaultOption={selectedRange}
          onChange={(selected: string) => {
            if (RANGE_OPTIONS.includes(selected as (typeof RANGE_OPTIONS)[number])) {
              setSelectedRange(selected as (typeof RANGE_OPTIONS)[number]);
            }
          }}
        />
      </div>

      {isLoading ? (
        <div className="h-[350px] w-full rounded-xl bg-opacityClr-20 animate-pulse" />
      ) : chartData.length === 0 ? (
        <div className="h-[350px] w-full flex items-center justify-center">
          <p className="text-sm font-Raleway text-opacityClr-60">No income data for this range.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 10, bottom: 10, left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" minTickGap={24} />
            <YAxis tickFormatter={(value) => formatCompactMoney(Number(value))} width={72} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#8CB326"
              name="Income"
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
});

InvestmentRevenueChart.displayName = "InvestmentRevenueChart";

export default InvestmentRevenueChart;
