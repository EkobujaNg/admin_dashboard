"use client";

import React from "react";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import Breadcrumb from "@/components/ui/Breadcrumb";
import AddPropertyListingForm from "@/components/views/AddPropertyListingForm";

const AddPropertyPage = () => {
  return (
    <section className="flex flex-col gap-6 pb-10 w-full">
      <Breadcrumb
        items={[
          { label: "Properties", href: "/properties" },
          { label: "Create Property Listing" },
        ]}
      />

      <Link
        href="/properties"
        className="inline-flex items-center gap-2 text-sm font-Raleway font-semibold text-opacityClr-60 hover:text-primary-10 transition-colors w-fit"
      >
        <MdArrowBack className="w-4 h-4" />
        Back to properties
      </Link>

      <h1 className="text-[28px] font-Raleway font-bold text-primary-10">
        Create <span className="text-primary-20">Property Listing</span>
      </h1>

      <AddPropertyListingForm />
    </section>
  );
};

export default AddPropertyPage;
