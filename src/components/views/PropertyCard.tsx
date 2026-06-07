// src/components/views/PropertyCard.jsx
"use client";
import React, { useState, useCallback, useEffect, memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BsArrowUpRight } from "react-icons/bs";
import { location, info } from "../../../public/assets/icons";
import { Eye, EyeOff } from "lucide-react";
import { usePropertyAPI } from "@/services/usePropertyAPI";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

const PropertyCard = memo(({ property }: { property?: any }) => {
  const router = useRouter();
  const { setPropertyVisibility, isUpdatingPropertyVisibility } = usePropertyAPI();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(Boolean(property?.isHidden));

  useEffect(() => {
    setIsHidden(Boolean(property?.isHidden));
  }, [property?.isHidden]);

  if (!property) return null;

  const imageUrl = property.imageUrls?.[0] || property.media?.[0] || "/assets/images/fallback-property.png";
  const yieldPercent = property.estimatedYieldPerAnnum ? `${property.estimatedYieldPerAnnum}%` : "—";
  const raisedAmount = property.amountRaisedDuringPresale ? `₦${property.amountRaisedDuringPresale.toLocaleString()} during presale` : "—";
  const priceDisplay = property.pricePerStock ? `₦${property.pricePerStock.toLocaleString()}` : "₦0";

  const progress =
    property.numberOfShares && property.sharesSold ? `${Math.round((property.sharesSold / property.numberOfShares) * 100)}%` : "0%";

  const handleVisibilityToggle = useCallback(() => {
    const nextHidden = !isHidden;
    setPropertyVisibility(property.propertyId, nextHidden, {
      onSuccess: () => {
        setIsHidden(nextHidden);
        setIsConfirmOpen(false);
      },
      onError: () => setIsConfirmOpen(false),
    });
  }, [isHidden, property.propertyId, setPropertyVisibility]);

  return (
    <>
      <div className={`relative h-full w-full shadow border rounded-2xl ${isHidden ? "border-amber-200 opacity-90" : "border-opacityClr-20"}`}>
        <div
          className="w-full h-[250px] rounded-t-2xl flex flex-col items-start justify-between bg-cover bg-center bg-no-repeat relative object-cover "
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="flex items-center justify-between py-6 px-4 w-full">
            <div className="flex py-[10px] px-4 items-center gap-3 rounded-2xl bg-white w-auto">
              <p className="text-primary-10 font-Raleway text-base font-bold leading-normal uppercase">{property.propertyName}</p>
            </div>
            {isHidden && (
              <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-Raleway font-bold uppercase text-amber-900">
                Hidden
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsConfirmOpen(true)}
            disabled={isUpdatingPropertyVisibility}
            className={`absolute top-4 right-4 flex items-center justify-center gap-2 w-[50px] h-[50px] rounded-full border transition-all duration-500 group cursor-pointer disabled:opacity-50 ${
              isHidden
                ? "bg-green-100 border-neutral-lightGreen hover:bg-transparent hover:border-[#E8EBEB]"
                : "bg-amber-100 border-amber-200 hover:bg-transparent hover:border-[#E8EBEB]"
            }`}
            title={isHidden ? "Show property" : "Hide property"}
          >
            {isHidden ? (
              <Eye className="group-hover:text-opacityClr-10 text-primary-10" />
            ) : (
              <EyeOff className="group-hover:text-opacityClr-10 text-amber-900" />
            )}
          </button>
        </div>

        <div className="flex flex-col items-start gap-4 p-4 w-full">
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex flex-col items-start">
              <h3 className="font-Raleway font-bold text-base text-opacity-100 leading-[140%]">
                {priceDisplay} <span className="text-opacityClr-60">/stock</span>
              </h3>
            </div>

            <button
              type="button"
              onClick={() => router.push(`/properties/${property.propertyId}`)}
              className="bg-[#C2DF93] hidden md:flex items-center justify-center gap-2 p-2 h-[50px] w-[50px] rounded-full border border-neutral-lightGreen transition-all duration-500 hover:bg-transparent hover:border-[#E8EBEB] group cursor-pointer"
            >
              <BsArrowUpRight className="group-hover:text-opacityClr-10" />
            </button>
          </div>

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

        <div className="flex flex-col items-start gap-4 p-4 w-full bg-primary-10 rounded-b-2xl">
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

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleVisibilityToggle}
        message={
          isHidden
            ? `Show "${property.propertyName}" on user-facing listings again?`
            : `Hide "${property.propertyName}" from user-facing listings? The property will not be deleted.`
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
    </>
  );
});

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
