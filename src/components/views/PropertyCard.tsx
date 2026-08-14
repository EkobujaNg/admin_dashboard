"use client";
import React, { useState, useCallback, useEffect, memo } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Eye, EyeOff, MapPin, Info } from "lucide-react";
import { usePropertyAPI } from "@/services/usePropertyAPI";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import MediaImage from "@/components/ui/MediaImage";
import { getFirstPropertyImageUrl } from "@/lib/property/media";

const PropertyCard = memo(({ property }: { property?: any }) => {
  const router = useRouter();
  const { setPropertyVisibility, isUpdatingPropertyVisibility } = usePropertyAPI();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(Boolean(property?.isHidden));

  useEffect(() => {
    setIsHidden(Boolean(property?.isHidden));
  }, [property?.isHidden]);

  const handleVisibilityToggle = useCallback(() => {
    if (!property?.propertyId) return;
    const nextHidden = !isHidden;
    setPropertyVisibility(property.propertyId, nextHidden, {
      onSuccess: () => {
        setIsHidden(nextHidden);
        setIsConfirmOpen(false);
      },
      onError: () => setIsConfirmOpen(false),
    });
  }, [isHidden, property?.propertyId, setPropertyVisibility]);

  if (!property) return null;

  const imageUrl = getFirstPropertyImageUrl(property, "/assets/images/fallback-property.png");
  const sharePrice = property.shareValue ?? property.pricePerStock ?? 0;
  const totalShares = property.numberOfShares ?? 0;
  const sharesSold = property.numberOfSharesSold ?? property.sharesSold ?? 0;
  const propertyValue = property.ekobujaValue ?? property.propertyValue ?? 0;
  const soldPercent = totalShares > 0 ? (sharesSold / totalShares) * 100 : 0;
  const address = property.propertyAddress || property.propertyLocation || "Location not specified";
  const propertyType = property.propertyType
    ? String(property.propertyType).charAt(0).toUpperCase() + String(property.propertyType).slice(1)
    : "—";
  const priceDisplay = `₦${Number(sharePrice || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  const valueDisplay = `₦${Number(propertyValue || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <>
      <div
        className={`relative h-full w-full shadow border rounded-2xl ${isHidden ? "border-amber-200 opacity-90" : "border-opacityClr-20"}`}
      >
        <div className="w-full h-[250px] rounded-t-2xl flex flex-col items-start justify-between relative overflow-hidden">
          <MediaImage
            src={imageUrl}
            alt={property.propertyName || "Property"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <div className="relative z-10 flex items-center justify-between py-6 px-4 w-full">
            <div className="flex py-[10px] px-4 items-center gap-3 rounded-2xl bg-white w-auto">
              <p className="text-primary-10 font-Raleway text-base font-bold leading-normal uppercase">{property.propertyName}</p>
            </div>
            {isHidden && (
              <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-Raleway font-bold uppercase text-amber-900">Hidden</div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsConfirmOpen(true)}
            disabled={isUpdatingPropertyVisibility}
            className={`absolute z-10 top-4 right-4 flex items-center justify-center gap-2 w-[50px] h-[50px] rounded-full border transition-all duration-500 group cursor-pointer disabled:opacity-50 ${
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
          <div className="flex items-start justify-between gap-4 w-full">
            <div className="flex flex-col items-start gap-3 min-w-0 flex-1">
              <h3 className="font-Raleway font-bold text-base text-opacity-100 leading-[140%]">
                {priceDisplay} <span className="text-opacityClr-60">/stock</span>
              </h3>

              <div className="flex items-start gap-2 w-full">
                <MapPin className="w-4 h-4 text-primary-10 shrink-0 mt-0.5" />
                <p className="text-primary-10 font-Geist font-normal text-sm leading-normal line-clamp-2">{address}</p>
              </div>

              <div className="flex items-start gap-2 w-full">
                <Info className="w-4 h-4 text-primary-10 shrink-0 mt-0.5" />
                <p className="text-primary-10 font-Geist font-normal text-sm leading-normal">{propertyType}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push(`/properties/${property.propertyId}`)}
              className="bg-[#C2DF93] hidden md:flex items-center justify-center gap-2 p-2 h-[50px] w-[50px] rounded-full border border-neutral-lightGreen transition-all duration-500 hover:bg-transparent hover:border-[#E8EBEB] group cursor-pointer shrink-0"
            >
              <ArrowUpRight className="group-hover:text-opacityClr-10" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 p-4 w-full bg-primary-10 rounded-b-2xl">
          <h3 className="font-Raleway font-bold text-base text-opacityClr-10 leading-[140%]">
            Property value: {valueDisplay}
          </h3>

          <div className="flex items-center justify-between w-full gap-4">
            <p className="text-opacityClr-60 text-sm font-Geist font-normal leading-normal">
              Total share: <span className="text-opacityClr-20">{totalShares.toLocaleString()}</span>
            </p>
            <p className="text-opacityClr-60 text-sm font-Geist font-normal leading-normal">
              Share sold: <span className="text-opacityClr-20">{sharesSold.toLocaleString()}</span>
            </p>
          </div>

          <div className="w-full bg-opacityClr-80 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-neutral-lightGreen transition-all duration-700"
              style={{ width: `${Math.min(soldPercent, 100)}%` }}
            />
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
        confirmMsg={isUpdatingPropertyVisibility ? "Updating..." : isHidden ? "Show Property" : "Hide Property"}
        confirmButtonColor="green"
      />
    </>
  );
});

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
