"use client";

import React, { useState } from "react";
import TabButton from "@/components/ui/TabButton";
import AddPropertyOverviewForm from "./AddPropertyOverviewForm";
import AddPropertyRevenueForm from "./AddPropertyRevenueForm";

type AddPropertyFormProps = {
  onSuccess?: () => void;
};

const AddPropertyForm = ({ onSuccess }: AddPropertyFormProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col items-start gap-6 w-full">
      <div className="flex items-center justify-center gap-2 w-full bg-[#ECECEC] rounded-[100px]">
        <TabButton label="Overview" isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
        <TabButton label="Revenue" isActive={activeTab === "revenue"} onClick={() => setActiveTab("revenue")} />
      </div>

      <div className="w-full">
        {activeTab === "overview" ? (
          <AddPropertyOverviewForm onSuccess={onSuccess} />
        ) : (
          <AddPropertyRevenueForm />
        )}
      </div>
    </div>
  );
};

export default AddPropertyForm;
