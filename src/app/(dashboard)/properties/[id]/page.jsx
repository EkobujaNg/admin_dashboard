"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import PropertyDetailPage from "@/components/views/PropertyDetailPage";
import { dummyPropertiesData } from "@/data";

const PropertyDetail = () => {
  const params = useParams();
  const propertyId = params.id;

  // Get property from dummy data
  const property = dummyPropertiesData.pageItems.find((p) => p.propertyId === propertyId);

  if (!property) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-primary-10 font-Raleway text-lg">Property not found</p>
      </div>
    );
  }

  return <PropertyDetailPage property={property} />;
};

export default PropertyDetail;
