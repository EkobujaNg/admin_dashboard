"use client";

import React from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PropertyProfitSharingDetail from "@/components/views/PropertyProfitSharingDetail";

const PropertyProfitSharingPage = () => {
  const params = useParams();
  const propertyId = String(params?.propertyId || "");

  return (
    <section className="flex flex-col gap-6 pb-5">
      <Breadcrumb
        items={[
          { label: "Profit Sharing", href: "/profit-sharing" },
          { label: "Property details" },
        ]}
      />

      <div className="flex flex-col gap-1 items-start">
        <h2 className="text-[28px] font-Raleway font-bold text-primary-10">
          Profit <span className="text-primary-20">Sharing</span>
        </h2>
        <p className="text-sm font-Raleway font-medium text-primary-10">
          Load and distribute profit share for this property.
        </p>
      </div>

      {propertyId ? (
        <PropertyProfitSharingDetail propertyId={propertyId} />
      ) : (
        <p className="text-sm text-red-600 font-Raleway">Invalid property.</p>
      )}
    </section>
  );
};

export default PropertyProfitSharingPage;
