"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, MapPin, ArrowUpRight, Pencil } from "lucide-react";
import TabButton from "@/components/ui/TabButton";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { formatNaira, formatPercent } from "@/lib/property/valuation";
import { PROPERTY_LISTING_TYPE_OPTIONS, type PropertyRecord } from "@/lib/property/types";
import { usePropertyAPI } from "@/services/usePropertyAPI";

type DetailRowProps = {
  label: string;
  value: React.ReactNode;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-base font-Raleway font-medium text-opacityClr-60">{label}</p>
      <p className="text-base font-Raleway font-semibold text-primary-10 text-right">{value}</p>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl border border-opacityClr-30 bg-white">
      <h2 className="text-xl font-Raleway font-bold text-primary-10">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function getPropertyTypeLabel(type: string) {
  const option = PROPERTY_LISTING_TYPE_OPTIONS.find((item) => item.value === type);
  return option?.label || type;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-NG", { dateStyle: "medium" });
}

function formatUnitType(unitType: string) {
  if (!unitType) return "—";
  return /^\d+$/.test(unitType) ? `${unitType} Bedroom` : unitType;
}

const PropertyDetailPage = ({ property }: { property: PropertyRecord }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isHidden, setIsHidden] = useState(Boolean(property?.isHidden));
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { setPropertyVisibility, isUpdatingPropertyVisibility } = usePropertyAPI({
    propertyId: property?.propertyId,
  });

  useEffect(() => {
    setIsHidden(Boolean(property?.isHidden));
  }, [property?.isHidden]);

  if (!property) return null;

  const handleVisibilityConfirm = () => {
    const nextHidden = !isHidden;
    setPropertyVisibility(property.propertyId, nextHidden, {
      onSuccess: () => {
        setIsHidden(nextHidden);
        setIsConfirmOpen(false);
      },
      onError: () => setIsConfirmOpen(false),
    });
  };

  const images = property.media?.length ? property.media : property.imageUrls || [];
  const primaryImage = images[selectedImageIndex] || "/assets/images/propertyA.png";
  const valuation = property.propertyValuation;
  const capRateDisplay = valuation?.capRate != null ? formatPercent(valuation.capRate) : "—";
  const progress =
    property.numberOfShares > 0
      ? `${Math.round((property.sharesSold / property.numberOfShares) * 100)}%`
      : "0%";

  return (
    <div className="flex flex-col gap-6 w-full pb-5">
      <div className="flex items-start justify-between gap-4 w-full">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-opacityClr-10 transition-colors"
          >
            <ArrowLeft className="text-primary-10 w-5 h-5" />
          </button>
          <div className="flex flex-col gap-1">
            <h1 className="text-[28px] font-Raleway font-bold text-primary-10 uppercase">{property.name}</h1>
            <div className="flex items-center gap-2">
              <MapPin className="text-opacityClr-60 w-4 h-4" />
              <p className="text-base font-Raleway font-normal text-opacityClr-60">{property.propertyLocation}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsConfirmOpen(true)}
            disabled={isUpdatingPropertyVisibility}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg font-Raleway font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isHidden
                ? "border border-neutral-lightGreen bg-white text-primary-10 hover:bg-neutral-lightGreen"
                : "border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
            }`}
          >
            {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {isUpdatingPropertyVisibility ? "Updating..." : isHidden ? "Show Property" : "Hide Property"}
          </button>

          <Link
            href={`/properties/${property.propertyId}/edit`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-neutral-lightGreen text-primary-10 font-Raleway font-semibold text-sm hover:bg-primary-10 hover:text-white transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit Property
          </Link>
        </div>
      </div>

      {isHidden && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-Raleway text-amber-900">
          This property is hidden and will not appear on user-facing listings.
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-primary-10 w-full">
        <div className="w-full md:w-[30%] h-[150px] md:h-[200px] rounded-2xl overflow-hidden relative">
          <Image
            src={primaryImage}
            alt={property.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="flex flex-col justify-center gap-6 w-full md:w-1/2">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-Raleway font-medium text-white/70">Share Price</p>
              <p className="text-2xl font-Raleway font-bold text-white">{formatNaira(property.shareValue)}</p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-Raleway font-medium text-white/70">Cap Rate</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-Raleway font-bold text-white">{capRateDisplay}</p>
                <ArrowUpRight className="text-white w-5 h-5" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-Raleway font-medium text-white/70">Ekobuja Value</p>
              <p className="text-2xl font-Raleway font-bold text-white">
                {valuation ? formatNaira(valuation.ekobujaValue) : "—"}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-Raleway font-medium text-white/70">Shares Sold</p>
              <p className="text-2xl font-Raleway font-bold text-white">
                {property.sharesSold.toLocaleString()} / {property.numberOfShares.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-Raleway font-medium text-white/70">Presale Progress</p>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-neutral-lightGreen transition-all duration-700" style={{ width: progress }} />
            </div>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedImageIndex(index)}
              className={`relative flex-shrink-0 w-28 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                selectedImageIndex === index ? "border-primary-10" : "border-transparent"
              }`}
            >
              <Image src={image} alt={`${property.name} ${index + 1}`} fill className="object-cover" sizes="112px" />
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-2 w-full bg-[#ECECEC] rounded-[100px]">
        <TabButton label="Overview" isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
        <TabButton label="Valuation" isActive={activeTab === "valuation"} onClick={() => setActiveTab("valuation")} />
      </div>

      <div className="flex flex-col gap-6 w-full">
        {activeTab === "overview" && (
          <>
            <SectionCard title="About">
              <p className="text-base font-Raleway text-primary-10 leading-relaxed">
                {property.description || "No description provided."}
              </p>
            </SectionCard>

            <SectionCard title="Property Details">
              <DetailRow label="Property Type" value={getPropertyTypeLabel(property.propertyType)} />
              <DetailRow label="Address" value={property.propertyAddress || "—"} />
              <DetailRow label="City" value={property.city || "—"} />
              <DetailRow label="State" value={property.state || "—"} />
              <DetailRow label="ZIP" value={property.zip || "—"} />
              <DetailRow label="Total Shares" value={property.numberOfShares.toLocaleString()} />
              <DetailRow label="Shares Sold" value={property.sharesSold.toLocaleString()} />
              <DetailRow label="Visibility" value={isHidden ? "Hidden" : "Visible"} />
              <DetailRow label="Created" value={formatDate(property.createdAt)} />
              <DetailRow label="Last Updated" value={formatDate(property.updatedAt)} />
            </SectionCard>
          </>
        )}

        {activeTab === "valuation" && (
          <>
            {!valuation ? (
              <SectionCard title="Valuation">
                <p className="text-base font-Raleway text-opacityClr-60">No valuation data available for this property.</p>
              </SectionCard>
            ) : (
              <>
                <SectionCard title="Valuation Summary">
                  <DetailRow label="Gross Rent" value={formatNaira(valuation.grossRent)} />
                  <DetailRow label="Effective Income" value={formatNaira(valuation.effectiveIncome)} />
                  <DetailRow label="Total Expenses" value={formatNaira(valuation.totalExpenses)} />
                  <DetailRow label="Net Operating Income" value={formatNaira(valuation.noi)} />
                  <DetailRow label="Cap Rate" value={capRateDisplay} />
                  <DetailRow label="Estimated Value" value={formatNaira(valuation.estimatedValue)} />
                  <DetailRow label="Computed Value" value={formatNaira(valuation.computedValue)} />
                  <DetailRow label="Ekobuja Value" value={formatNaira(valuation.ekobujaValue)} />
                  <DetailRow
                    label="Admin Adjustment"
                    value={`${valuation.adminAjustWith === "minus" ? "-" : "+"}${formatNaira(valuation.adminAdjustment)}`}
                  />
                </SectionCard>

                <SectionCard title="Assumptions">
                  <DetailRow label="Vacancy Rate" value={valuation.vacancyRateName || "—"} />
                  <DetailRow label="Property Tier" value={`Tier ${valuation.propertyTier}`} />
                  <DetailRow
                    label="Classification"
                    value={valuation.propertyClassification.charAt(0).toUpperCase() + valuation.propertyClassification.slice(1)}
                  />
                  <DetailRow label="Title" value={valuation.titleAdjustmentName || "—"} />
                  <DetailRow label="Security Risk" value={valuation.securityRiskAdjustmentName || "—"} />
                  <DetailRow label="Infrastructure" value={valuation.infrastructureAdjustmentName || "—"} />
                  <DetailRow label="Development" value={valuation.developmentAdjustmentName || "—"} />
                </SectionCard>

                <SectionCard title="Operating Expenses">
                  <DetailRow label="Security" value={formatNaira(valuation.securityCost)} />
                  <DetailRow label="Maintenance" value={formatNaira(valuation.maintenanceCost)} />
                  <DetailRow label="Repairs" value={formatNaira(valuation.repairsCost)} />
                  <DetailRow label="Utilities" value={formatNaira(valuation.utilitiesCost)} />
                  <DetailRow label="Management" value={formatNaira(valuation.managementCost)} />
                  <DetailRow label="Tax" value={formatNaira(valuation.taxCost)} />
                </SectionCard>

                <SectionCard title="Rental Units">
                  {valuation.rentalUnits.length === 0 ? (
                    <p className="text-base font-Raleway text-opacityClr-60">No rental units recorded.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-opacityClr-20">
                            <th className="py-3 pr-4 text-sm font-Raleway font-semibold text-opacityClr-60">Unit Type</th>
                            <th className="py-3 pr-4 text-sm font-Raleway font-semibold text-opacityClr-60">Units</th>
                            <th className="py-3 pr-4 text-sm font-Raleway font-semibold text-opacityClr-60">Monthly Rent</th>
                            <th className="py-3 text-sm font-Raleway font-semibold text-opacityClr-60">Annual Rent</th>
                          </tr>
                        </thead>
                        <tbody>
                          {valuation.rentalUnits.map((unit) => (
                            <tr key={unit.id} className="border-b border-opacityClr-10 last:border-0">
                              <td className="py-3 pr-4 text-base font-Raleway text-primary-10">{formatUnitType(unit.unitType)}</td>
                              <td className="py-3 pr-4 text-base font-Raleway text-primary-10">{unit.numberOfUnits}</td>
                              <td className="py-3 pr-4 text-base font-Raleway text-primary-10">
                                {formatNaira(unit.monthlyRentPerUnit)}
                              </td>
                              <td className="py-3 text-base font-Raleway text-primary-10">{formatNaira(unit.annualRent)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </SectionCard>
              </>
            )}
          </>
        )}
      </div>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleVisibilityConfirm}
        message={
          isHidden
            ? `Show "${property.name}" on user-facing listings again?`
            : `Hide "${property.name}" from user-facing listings? The property will not be deleted.`
        }
        cancelMsg="Cancel"
        confirmMsg={
          isUpdatingPropertyVisibility
            ? "Updating..."
            : isHidden
              ? "Show Property"
              : "Hide Property"
        }
        confirmButtonColor="green"
      />
    </div>
  );
};

export default PropertyDetailPage;
