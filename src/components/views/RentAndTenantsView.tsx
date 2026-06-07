import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUp,
  Pencil,
  Trash2,
  Plus,
  Info,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import RentModal from "./RentModal";
import TenantModal from "./TenantModal";

const dummyChartData = [
  { year: "2023", value: 18000000 },
  { year: "2024", value: 21600000 },
  { year: "2025", value: 24000000 },
];

const initialRentConfig = [
  {
    year: "2023",
    totalRent: "₦18,000,000",
    rentType: "Annual",
    status: "Archived",
    statusColor: "bg-[#EAD0A5]",
  },
  {
    year: "2024",
    totalRent: "₦21,600,000",
    rentType: "Annual",
    status: "Archived",
    statusColor: "bg-[#EAD0A5]",
  },
  {
    year: "2025",
    totalRent: "₦24,000,000",
    rentType: "Annual",
    status: "Active",
    statusColor: "bg-[#C4DEAF]",
  },
];

const initialTenants = [
  {
    id: 1,
    name: "Acme Corporation",
    unitId: "Unit A-101",
    rentAmount: "₦2,000,000",
    cycle: "Monthly",
    start: "2024-01-01",
    end: "2025-12-31",
    status: "Active",
  },
  {
    id: 2,
    name: "Green Solutions",
    unitId: "Unit B-201",
    rentAmount: "₦2,200,000",
    cycle: "Monthly",
    start: "2024-06-01",
    end: "2025-05-31",
    status: "Active",
  },
];

const formatYAxis = (value) => {
  if (value >= 1000000) return `₦${value / 1000000}M`;
  return `₦${value}`;
};

const CustomTooltip = ({ active, payload, label }: { active?: any; payload?: any; label?: any }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-black/10 rounded shadow-sm text-xs font-Raleway">
        <p className="font-semibold">{label}</p>
        <p className="text-primary-10">
          Rent: ₦{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const RentAndTenantsView = () => {
  // Rent Config State
  const [rentConfig, setRentConfig] = useState(initialRentConfig);
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [editingRentItem, setEditingRentItem] = useState(null);

  // Tenant State
  const [tenants, setTenants] = useState(initialTenants);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);

  // Rent Handlers
  const handleAddYear = () => {
    setEditingRentItem(null);
    setIsRentModalOpen(true);
  };

  const handleEditYear = (item) => {
    setEditingRentItem(item);
    setIsRentModalOpen(true);
  };

  const handleSaveRent = (data) => {
    if (editingRentItem) {
      setRentConfig((prev) =>
        prev.map((item) =>
          item.year === editingRentItem.year
            ? {
                ...item,
                ...data,
                statusColor: data.status === "Active" ? "bg-[#C4DEAF]" : "bg-[#EAD0A5]",
              }
            : item
        )
      );
    } else {
      const newItem = {
        ...data,
        statusColor: data.status === "Active" ? "bg-[#C4DEAF]" : "bg-[#EAD0A5]",
      };
      setRentConfig((prev) => [...prev, newItem].sort((a, b) => a.year - b.year));
    }
    setIsRentModalOpen(false);
  };

  // Tenant Handlers
  const handleAddTenant = () => {
    setEditingTenant(null);
    setIsTenantModalOpen(true);
  };

  const handleEditTenant = (tenant) => {
    setEditingTenant(tenant);
    setIsTenantModalOpen(true);
  };

  const handleSaveTenant = (data) => {
    if (editingTenant) {
      setTenants((prev) =>
        prev.map((item) => (item.id === editingTenant.id ? { ...item, ...data } : item))
      );
    } else {
      const newItem = {
        ...data,
        id: Date.now(),
      };
      setTenants((prev) => [...prev, newItem]);
    }
    setIsTenantModalOpen(false);
  };

  const handleDeleteTenant = (id) => {
    setTenants((prev) => prev.filter((tenant) => tenant.id !== id));
    toast.success("Tenant deleted successfully");
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <RentModal
        isOpen={isRentModalOpen}
        onClose={() => setIsRentModalOpen(false)}
        onSave={handleSaveRent}
        initialData={editingRentItem}
      />

      <TenantModal
        isOpen={isTenantModalOpen}
        onClose={() => setIsTenantModalOpen(false)}
        onSave={handleSaveTenant}
        initialData={editingTenant}
      />

      {/* 1. Rental Income (Year-on-Year) Stats */}
      <div className="flex flex-col gap-4">
        <p className="text-base font-Raleway font-normal text-opacityClr-60">
          Rental Income (Year-on-Year)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Rent Card */}
          <div className="bg-primary-10 rounded-lg p-6 flex flex-col justify-between h-[140px] shadow-sm">
            <p className="text-white/70 text-sm font-Raleway">
              Current Rent (This Year)
            </p>
            <h3 className="text-white text-[32px] font-bold font-Raleway">
              ₦24,000,000
            </h3>
            <p className="text-white/70 text-xs font-Raleway">2025 (Annual)</p>
          </div>

          {/* Last Year Rent Card */}
          <div className="bg-[#EDEDED] rounded-lg p-6 flex flex-col justify-between h-[140px] shadow-sm">
            <p className="text-primary-10/60 text-sm font-Raleway font-semibold">
              Last Year Rent
            </p>
            <h3 className="text-primary-10 text-[32px] font-bold font-Raleway">
              ₦21,600,000
            </h3>
            <p className="text-primary-10/60 text-xs font-Raleway font-medium">
              2024 (Annual)
            </p>
          </div>

          {/* YoY Change Card */}
          <div className="bg-[#EDEDED] rounded-lg p-6 flex flex-col justify-between h-[140px] shadow-sm">
            <p className="text-primary-10/60 text-sm font-Raleway font-semibold">
              YoY Change
            </p>
            <div className="flex items-center gap-2">
              <h3 className="text-primary-10 text-[32px] font-bold font-Raleway">
                +11.1%
              </h3>
              <div className="bg-[#C4DEAF]/50 p-1 rounded-full">
                <ArrowUp className="text-[#6EA043] w-3 h-3" />
              </div>
            </div>
            <p className="text-[#8CBF63] text-xs font-Raleway font-medium">
              Increase from last year
            </p>
          </div>
        </div>
      </div>

      {/* 2. Rent Growth Trend Chart */}
      <div className="p-6 border border-opacityClr-30 rounded-2xl bg-white flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-Raleway font-normal text-primary-10">
            Rent Growth Trend
          </h3>
          <div className="border border-opacityClr-30 rounded-lg px-3 py-1 text-sm font-Raleway text-primary-10">
            2025 ▼
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dummyChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E5E5"
              />
              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666", fontSize: 12, fontFamily: "Raleway" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={formatYAxis}
                tick={{ fill: "#666", fontSize: 12, fontFamily: "Raleway" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#1B3B36"
                strokeWidth={3}
                dot={{ r: 6, fill: "#1B3B36", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Rent Configuration Table */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-Raleway font-normal text-primary-10">
            Rent Configuration
          </h3>
          <button
            onClick={handleAddYear}
            className="flex items-center gap-2 bg-primary-10 text-white px-4 py-2 rounded-lg text-sm font-Raleway font-medium hover:bg-primary-10/90 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Year
          </button>
        </div>
        <div className="border border-opacityClr-30 rounded-2xl overflow-hidden bg-white">
          <table className="w-full">
            <thead className="bg-[#EDEDED]">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-Raleway font-bold text-primary-10">
                  Year
                </th>
                <th className="py-4 px-6 text-left text-sm font-Raleway font-bold text-primary-10">
                  Total Rent Expected
                </th>
                <th className="py-4 px-6 text-left text-sm font-Raleway font-bold text-primary-10">
                  Rent Type
                </th>
                <th className="py-4 px-6 text-left text-sm font-Raleway font-bold text-primary-10">
                  Status
                </th>
                <th className="py-4 px-6 text-left text-sm font-Raleway font-bold text-primary-10">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rentConfig.map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-opacityClr-30 last:border-0"
                >
                  <td className="py-4 px-6 text-sm font-Raleway font-bold text-primary-10">
                    {item.year}
                  </td>
                  <td className="py-4 px-6 text-sm font-Raleway font-bold text-primary-10">
                    {item.totalRent}
                  </td>
                  <td className="py-4 px-6 text-sm font-Raleway font-normal text-primary-10/70">
                    {item.rentType}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-Raleway font-medium text-primary-10 flex items-center gap-1 w-fit ${item.statusColor}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-10"></span>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleEditYear(item)}
                      className="text-primary-10/70 hover:text-primary-10 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Tenants in This Property Table */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-Raleway font-normal text-primary-10">
            Tenants in This Property
          </h3>
          <button
            onClick={handleAddTenant}
            className="flex items-center gap-2 bg-primary-10 text-white px-4 py-2 rounded-lg text-sm font-Raleway font-medium hover:bg-primary-10/90 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Tenant
          </button>
        </div>
        <div className="border border-opacityClr-30 rounded-2xl overflow-hidden bg-white">
          <table className="w-full">
            <thead className="bg-[#EDEDED]">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-Raleway font-bold text-primary-10">
                  Tenant Name / Unit ID
                </th>
                <th className="py-4 px-6 text-left text-sm font-Raleway font-bold text-primary-10">
                  Rent Amount
                </th>
                <th className="py-4 px-6 text-left text-sm font-Raleway font-bold text-primary-10">
                  Payment Cycle
                </th>
                <th className="py-4 px-6 text-left text-sm font-Raleway font-bold text-primary-10">
                  Lease Start
                </th>
                <th className="py-4 px-6 text-left text-sm font-Raleway font-bold text-primary-10">
                  Lease End
                </th>
                <th className="py-4 px-6 text-left text-sm font-Raleway font-bold text-primary-10">
                  Status
                </th>
                <th className="py-4 px-6 text-left text-sm font-Raleway font-bold text-primary-10">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant, index) => (
                <tr
                  key={index}
                  className="border-t border-opacityClr-30 last:border-0"
                >
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-Raleway font-bold text-primary-10">
                        {tenant.name}
                      </span>
                      <span className="text-xs font-Raleway text-primary-10/60">
                        {tenant.unitId}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-Raleway font-bold text-primary-10">
                    {tenant.rentAmount}
                  </td>
                  <td className="py-4 px-6 text-sm font-Raleway font-normal text-primary-10/70">
                    {tenant.cycle}
                  </td>
                  <td className="py-4 px-6 text-sm font-Raleway font-normal text-primary-10/70">
                    {tenant.start}
                  </td>
                  <td className="py-4 px-6 text-sm font-Raleway font-normal text-primary-10/70">
                    {tenant.end}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full text-xs font-Raleway font-medium text-primary-10 flex items-center gap-1 w-fit bg-[#C4DEAF]">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-10"></span>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEditTenant(tenant)}
                        className="text-primary-10/70 hover:text-primary-10 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTenant(tenant.id)}
                        className="text-[#FF3B30] hover:text-[#D32F2F] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Rental Income Summary */}
      <div className="bg-[#EDEDED] rounded-2xl p-6 flex flex-col gap-4">
        <h3 className="text-lg font-Raleway font-bold text-primary-10">
          Rental Income Summary
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-base font-Raleway font-medium text-primary-10/60">
              Total Rent From Tenants
            </p>
            <p className="text-base font-Raleway font-bold text-primary-10">
              ₦6,000,000
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-base font-Raleway font-medium text-primary-10/60">
              Vacancy Impact
            </p>
            <p className="text-base font-Raleway font-bold text-[#FF3B30]">
              ₦18,000,000
            </p>
          </div>
          <div className="h-[1px] bg-primary-10/10 w-full my-1"></div>
          <div className="flex items-center justify-between">
            <p className="text-base font-Raleway font-bold text-primary-10">
              Gross Rental Income
            </p>
            <p className="text-lg font-Raleway font-bold text-primary-10">
              ₦6,000,000
            </p>
          </div>
        </div>
      </div>

      {/* 6. Info Box */}
      <div className="bg-[#A7C7CB] rounded-2xl p-6 flex items-start gap-4">
        <div className="bg-primary-10 rounded-full p-1 mt-1">
          <Info className="text-white w-5 h-5" />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <p className="text-base font-Raleway font-normal text-primary-10/80">
            This rental income feeds directly into profit distribution.
          </p>
          <div className="flex items-center justify-between w-full pr-8">
            <p className="text-base font-Raleway font-normal text-primary-10">
              Gross Rent
            </p>
            <p className="text-base font-Raleway font-bold text-primary-10">
              ₦6,000,000
            </p>
          </div>
          <div className="flex items-center justify-between w-full pr-8">
            <p className="text-base font-Raleway font-normal text-primary-10">
              Total Expenses
            </p>
            <p className="text-base font-Raleway font-bold text-[#FF3B30]">
              -₦800,000
            </p>
          </div>
          <div className="flex items-center justify-between w-full pr-8 mt-2">
            <p className="text-lg font-Raleway font-bold text-primary-10">
              Net Profit Available for Distribution
            </p>
            <p className="text-lg font-Raleway font-bold text-[#7AA855]">
              ₦5,200,000
            </p>
          </div>
          <button className="bg-primary-10 text-white rounded-full px-6 py-3 text-sm font-Raleway font-bold flex items-center justify-between w-fit gap-4 mt-2 hover:bg-primary-10/90 transition-colors cursor-pointer">
            View Profit Distribution Breakdown
            <ArrowRight className="text-white w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentAndTenantsView;
