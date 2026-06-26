"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import AddPropertyListingForm from "@/components/views/AddPropertyListingForm";
import { usePropertyAPI } from "@/services/usePropertyAPI";

const EditPropertyPage = () => {
  const params = useParams();
  const propertyId = String(params.id || "");

  const { propertyDetail, isLoadingPropertyDetail, propertyDetailError } = usePropertyAPI({
    propertyId,
    enablePropertyDetail: true,
  });

  if (isLoadingPropertyDetail) {
    return (
      <section className="flex flex-col gap-6 pb-10 w-full">
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-primary-10 font-Raleway text-lg">Loading property...</p>
        </div>
      </section>
    );
  }

  if (propertyDetailError || !propertyDetail) {
    return (
      <section className="flex flex-col gap-6 pb-10 w-full">
        <div className="flex flex-col items-center justify-center gap-4 min-h-[50vh]">
          <p className="text-primary-10 font-Raleway text-lg">Property not found</p>
          <Link href="/properties" className="text-sm font-Raleway font-semibold text-primary-20 hover:underline">
            Back to properties
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 pb-10 w-full">
      <Breadcrumb
        items={[
          { label: "Properties", href: "/properties" },
          { label: propertyDetail.name, href: `/properties/${propertyId}` },
          { label: "Edit Property" },
        ]}
      />

      <Link
        href={`/properties/${propertyId}`}
        className="inline-flex items-center gap-2 text-sm font-Raleway font-semibold text-opacityClr-60 hover:text-primary-10 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to property
      </Link>

      <h1 className="text-[28px] font-Raleway font-bold text-primary-10">
        Edit <span className="text-primary-20">Property Listing</span>
      </h1>

      <AddPropertyListingForm mode="edit" property={propertyDetail} />
    </section>
  );
};

export default EditPropertyPage;
