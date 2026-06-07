"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PropertyDetailPage from "@/components/views/PropertyDetailPage";
import { usePropertyAPI } from "@/services/usePropertyAPI";

const PropertyDetail = () => {
  const params = useParams();
  const propertyId = String(params.id || "");

  const { propertyDetail, isLoadingPropertyDetail, propertyDetailError } = usePropertyAPI({
    propertyId,
    enablePropertyDetail: true,
  });

  if (isLoadingPropertyDetail) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-primary-10 font-Raleway text-lg">Loading property...</p>
      </div>
    );
  }

  if (propertyDetailError || !propertyDetail) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[50vh]">
        <p className="text-primary-10 font-Raleway text-lg">Property not found</p>
        <Link href="/properties" className="text-sm font-Raleway font-semibold text-primary-20 hover:underline">
          Back to properties
        </Link>
      </div>
    );
  }

  return <PropertyDetailPage property={propertyDetail} />;
};

export default PropertyDetail;
