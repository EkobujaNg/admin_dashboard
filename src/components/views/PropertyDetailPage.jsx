"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, ArrowUpRight } from "lucide-react";
import TabButton from "@/components/ui/TabButton";
import PropertyOverviewForm from "./PropertyOverviewForm";

import RentAndTenantsView from "./RentAndTenantsView";

const PropertyDetailPage = ({ property }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  if (!property) return null;

  // Derived values
  const imageUrl = property.imageUrls?.[0] || "/assets/images/propertyA.png";
  const sharePrice = property.pricePerStock ? `₦${property.pricePerStock.toLocaleString()}` : "₦0";
  const expectedYield = property.estimatedYieldPerAnnum ? `${property.estimatedYieldPerAnnum}%` : "0%";
  const totalShares = property.numberOfShares?.toLocaleString() || "0";
  const sharesSold = property.sharesSold?.toLocaleString() || "0";
  const totalInvestment = property.amountRaisedDuringPresale ? `₦${property.amountRaisedDuringPresale.toLocaleString()}` : "₦0";

  // Calculate number of units from features or use a default
  const beds = property.features?.find((f) => f.includes("Bed"))?.match(/\d+/)?.[0] || "0";
  const numberOfUnits = property.numberOfShares ? Math.floor(property.numberOfShares / 100) : 12; // Default or calculated

  const handleSave = (formData) => {
    // Handle save logic here
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-5">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-opacityClr-10 transition-colors"
        >
          <ArrowLeft className="text-primary-10 w-5 h-5" />
        </button>
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px] font-Raleway font-bold text-primary-10 uppercase">{property.propertyName}</h1>
          <div className="flex items-center gap-2">
            <MapPin className="text-opacityClr-60 w-4 h-4" />
            <p className="text-base font-Raleway font-normal text-opacityClr-60">{property.propertyLocation}</p>
          </div>
        </div>
      </div>

      {/* Main Information Card (Dark Teal) */}
      <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-primary-10 w-full">
        {/* Left Side - Property Image */}
        <div className="w-full md:w-[30%] h-[150px] md:h-[200px] rounded-2xl overflow-hidden relative">
          <Image src={imageUrl} alt={property.propertyName} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        </div>

        {/* Right Side - Key Metrics */}
        <div className="flex flex-col justify-center gap-6 w-full md:w-1/2">
          <div className="grid grid-cols-2 gap-6">
            {/* Share Price */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-Raleway font-medium text-white/70">Share Price</p>
              <p className="text-2xl font-Raleway font-bold text-white">{sharePrice}</p>
            </div>

            {/* Expected Yield */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-Raleway font-medium text-white/70">Expected Yield</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-Raleway font-bold text-white">{expectedYield}</p>
                <ArrowUpRight className="text-white w-5 h-5" />
              </div>
            </div>

            {/* Total Shares */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-Raleway font-medium text-white/70">Total Shares</p>
              <p className="text-2xl font-Raleway font-bold text-white">{totalShares}</p>
            </div>

            {/* Shares Sold */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-Raleway font-medium text-white/70">Shares Sold</p>
              <p className="text-2xl font-Raleway font-bold text-white">{sharesSold}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 w-full bg-[#ECECEC] rounded-[100px]">
        <TabButton label="Overview" isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
        <TabButton label="Rent & Tenants" isActive={activeTab === "rentTenants"} onClick={() => setActiveTab("rentTenants")} />
        <TabButton label="Maintenance" isActive={activeTab === "maintenance"} onClick={() => setActiveTab("maintenance")} />
        <TabButton label="Reports" isActive={activeTab === "reports"} onClick={() => setActiveTab("reports")} />
      </div>

      {/* Tab Content */}
      <div className="flex flex-col gap-6 w-full">
        {activeTab === "overview" && (
          <>
            {/* Property Overview Section */}
            <div className="flex flex-col gap-6 p-6 rounded-2xl border border-opacityClr-30 bg-white">
              <h2 className="text-xl font-Raleway font-bold text-primary-10">Property Overview</h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-base font-Raleway font-medium text-opacityClr-60">Property Type</p>
                  <p className="text-base font-Raleway font-semibold text-primary-10">{property.propertyType || "Residential Estate"}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-base font-Raleway font-medium text-opacityClr-60">Total Investment</p>
                  <p className="text-base font-Raleway font-semibold text-primary-10">{totalInvestment}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-base font-Raleway font-medium text-opacityClr-60">Number of Units</p>
                  <p className="text-base font-Raleway font-semibold text-primary-10">{numberOfUnits} Units</p>
                </div>
              </div>
            </div>

            {/* Property Form */}
            <PropertyOverviewForm property={property} onSave={handleSave} isLoading={false} />
          </>
        )}

        {activeTab === "rentTenants" && <RentAndTenantsView />}

        {activeTab === "maintenance" && (
          <div className="flex items-center justify-center p-12 rounded-2xl border border-opacityClr-30 bg-white">
            <p className="text-base font-Raleway text-opacityClr-60">Maintenance content coming soon...</p>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="flex items-center justify-center p-12 rounded-2xl border border-opacityClr-30 bg-white">
            <p className="text-base font-Raleway text-opacityClr-60">Reports content coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailPage;
