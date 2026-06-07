"use client";
import React, { useState } from "react";
import TabButton from "@/components/ui/TabButton";
import PropertyOverviewForm from "./PropertyOverviewForm";
import PropertyRevenueForm from "./PropertyRevenueForm";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { usePropertyAPI } from "@/services/usePropertyAPI";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const EditPropertyCardDrawer = ({ property }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const propertyId = property?.propertyId;

  // ✅ Fetch full details via propertyId (cached for 60s)
  const { propertyDetail, isLoadingPropertyDetail, propertyDetailError, refetchPropertyDetail, updateProperty, isUpdatingProperty } =
    usePropertyAPI({ propertyId, enablePropertyDetail: Boolean(propertyId) });

  const currentProperty = propertyDetail || property;

  const handleSave = (formData) => {
    if (!propertyId) return;

    updateProperty(propertyId, formData, {
      onSuccess: () => refetchPropertyDetail(),
    });
  };

  const handleLiquidate = () => setShowConfirmModal(true);

  const handleConfirmLiquidate = () => {
    setShowConfirmModal(false);
  };

  // 🌀 Handle loading/error states gracefully
  if (isLoadingPropertyDetail) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-opacityClr-60" />
        <p className="text-sm text-opacityClr-60 mt-2">Loading property details...</p>
      </div>
    );
  }

  if (propertyDetailError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500">
        <p>Failed to load property details.</p>
        <button onClick={() => refetchPropertyDetail()} className="mt-3 bg-opacityClr-60 text-white px-4 py-2 rounded-lg hover:bg-opacityClr-80">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-6 py-6 relative h-full">
      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 w-full bg-[#ECECEC] rounded-[100px]">
        <TabButton label="Overview" isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
        <TabButton label="Revenue" isActive={activeTab === "revenue"} onClick={() => setActiveTab("revenue")} />
      </div>

      {/* Tab content */}
      {activeTab === "overview" ? (
        <PropertyOverviewForm property={currentProperty} onSave={handleSave} isLoading={isUpdatingProperty} />
      ) : (
        <PropertyRevenueForm property={currentProperty} onSave={handleSave} isLoading={isUpdatingProperty} />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmLiquidate}
        message="Are you sure you want to liquidate this property? This action cannot be undone."
        confirmMsg="Yes, Liquidate Property"
        cancelMsg="No, Cancel"
        confirmButtonColor="green"
      />
    </div>
  );
};

export default EditPropertyCardDrawer;
