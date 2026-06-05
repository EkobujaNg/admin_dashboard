"use client";
import React, { useState } from "react";
import TabButton from "@/components/ui/TabButton";
import AddPropertyOverviewForm from "./AddPropertyOverviewForm";
import AddPropertyRevenueForm from "./AddPropertyRevenueForm";

const AddPropertyCardDrawer = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col items-start gap-6 py-6 relative h-full">
      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 w-full bg-[#ECECEC] rounded-[100px]">
        <TabButton label="Overview" isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
        <TabButton label="Revenue" isActive={activeTab === "revenue"} onClick={() => setActiveTab("revenue")} />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 w-full overflow-y-auto pb-6">
        {activeTab === "overview" ? <AddPropertyOverviewForm /> : <AddPropertyRevenueForm />}
      </div>
    </div>
  );
};

export default AddPropertyCardDrawer;
