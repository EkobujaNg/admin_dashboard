"use client";

import React from "react";
import ProfitSharing from "@/components/views/ProfitSharing";

const ProfitSharingPage = () => {
  return (
    <section className="flex flex-col gap-6 pb-5">
      <div className="flex flex-col gap-1 items-start">
        <h2 className="text-[28px] font-Raleway font-bold text-primary-10">
          Profit <span className="text-primary-20">Sharing</span>
        </h2>
        <p className="text-sm font-Raleway font-medium text-primary-10">
          Manage upcoming and past profit distributions
        </p>
      </div>

      <ProfitSharing />
    </section>
  );
};

export default ProfitSharingPage;
