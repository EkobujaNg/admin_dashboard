// src/components/views/PropertyCard.jsx
"use client";
import React, { useState, useCallback, memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BsArrowUpRight } from "react-icons/bs";
import { location, info } from "../../../public/assets/icons";
import { Trash2 } from "lucide-react";
import { usePropertyAPI } from "@/services/usePropertyAPI";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

const PropertyCard = memo(({ property }) => {
  const router = useRouter();
  const { deleteProperty, isDeleting } = usePropertyAPI();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  if (!property) return null;

  // Derived display fields
  const imageUrl = property.imageUrls?.[0] || "/assets/images/fallback-property.png";
  const yieldPercent = property.estimatedYieldPerAnnum ? `${property.estimatedYieldPerAnnum}%` : "—";
  const raisedAmount = property.amountRaisedDuringPresale ? `₦${property.amountRaisedDuringPresale.toLocaleString()} during presale` : "—";
  const priceDisplay = property.pricePerStock ? `₦${property.pricePerStock.toLocaleString()}` : "₦0";

  const beds = property.features?.find((f) => f.includes("Bed")) || "— Beds";
  const baths = property.features?.find((f) => f.includes("Bath")) || "— Baths";

  const progress =
    property.numberOfShares && property.sharesSold ? `${Math.round((property.sharesSold / property.numberOfShares) * 100)}%` : "0%";

  const handleDelete = useCallback(() => {
    deleteProperty(property.propertyId);
    setIsConfirmOpen(false);
  }, [deleteProperty, property.propertyId]);

  return (
    <>
      <div className="relative h-full w-full shadow border border-opacityClr-20 rounded-2xl">
        {/* Property Image */}
        <div
          className="w-full h-[250px] rounded-t-2xl flex flex-col items-start justify-between bg-cover bg-center bg-no-repeat relative object-cover "
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="flex items-center justify-between py-6 px-4 w-full">
            <div className="flex py-[10px] px-4 items-center gap-3 rounded-2xl bg-white w-auto">
              <p className="text-primary-10 font-Raleway text-base font-bold leading-normal uppercase">{property.propertyName}</p>
            </div>
          </div>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => setIsConfirmOpen(true)}
            className="absolute top-4 right-4 bg-red-100 flex items-center justify-center gap-2 w-[50px] h-[50px] rounded-full border border-neutral-lightRed transition-all duration-500 hover:bg-transparent hover:border-[#E8EBEB] group cursor-pointer"
          >
            <Trash2 className="group-hover:text-opacityClr-10" />
          </button>
        </div>

        {/* Property Details */}
        <div className="flex flex-col items-start gap-4 p-4 w-full">
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex flex-col items-start">
              <h3 className="font-Raleway font-bold text-base text-opacity-100 leading-[140%]">
                {priceDisplay} <span className="text-opacityClr-60">/stock</span>
              </h3>

              <div className="flex gap-2 items-center">
                <p className="text-primary-10 font-Raleway text-normal text-sm leading-normal">{property.propertySize || "— Sq Ft."}</p>
                <div className="w-[1px] bg-[#778688] h-[10px]" />
                <p className="text-primary-10 font-Raleway text-normal text-sm leading-normal">{beds}</p>
                <div className="w-[1px] bg-[#778688] h-[10px]" />
                <p className="text-primary-10 font-Raleway text-normal text-sm leading-normal">{baths}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push(`/properties/${property.propertyId}`)}
              className="bg-[#C2DF93] hidden md:flex items-center justify-center gap-2 p-2 h-[50px] w-[50px] rounded-full border border-neutral-lightGreen transition-all duration-500 hover:bg-transparent hover:border-[#E8EBEB] group cursor-pointer"
            >
              <BsArrowUpRight className="group-hover:text-opacityClr-10" />
            </button>
          </div>

          {/* Location & Yield Info */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Image src={location} alt="location" />
              <p className="text-primary-10 font-Geist font-normal text-base leading-normal">{property.propertyLocation}</p>
            </div>
            <div className="flex items-center gap-2">
              <Image src={info} alt="yield" />
              <p className="text-primary-10 font-Geist font-normal text-base leading-normal">
                Estimate to yield up to <span className="text-[#6D9F1B]">{yieldPercent}</span> annually
              </p>
            </div>
          </div>
        </div>

        {/* Raised Amount & Progress Bar */}
        <div className="flex flex-col items-start gap-4 p-4 w-full bg-primary-10">
          <h3 className="font-Raleway font-bold text-base text-opacityClr-10 leading-[140%]">Raised {raisedAmount}</h3>

          <div className="w-full bg-opacityClr-80 rounded-full h-3 overflow-hidden">
            <div className="h-full bg-neutral-lightGreen transition-all duration-700" style={{ width: progress }} />
          </div>

          <div className="flex items-center justify-between w-full">
            <p className="text-opacityClr-60 text-base font-Geist font-normal leading-normal">
              Total Shares: {property.numberOfShares?.toLocaleString() || 0}
            </p>
            <p className="text-opacityClr-20 text-base text-right font-Geist font-normal leading-normal">
              Shares Sold: {property.sharesSold?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        message={`This will permanently delete "${property.propertyName}".`}
        cancelMsg="Cancel"
        confirmMsg={isDeleting ? "Deleting..." : "Delete Property"}
      />
    </>
  );
});

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
