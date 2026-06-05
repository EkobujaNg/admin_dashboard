"use client";

import React, { useState } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";
import StatsCard from "@/components/ui/StatsCard";
import { facilities } from "@/data/facilities";
import { location } from "../../../../public/assets/icons";
import { useDrawerModal } from "@/context/DrawerModalContext";
import CreateFacilityManagerDrawer from "@/components/views/CreateFacilityManagerDrawer";

const ReportManagementPage = () => {
  const { openModal, closeModal } = useDrawerModal();
  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between w-full gap-4">
        <div>
          <h2 className="text-[28px] font-Raleway font-bold text-primary-10">
            Facility <span className="text-primary-20">Administration</span>
          </h2>
          <p className="text-sm font-Raleway font-medium text-primary-10">Manage all reports and facility managers across the system</p>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center justify-center gap-3 px-5 py-3 bg-primary-10 rounded-lg border border-transparent transition hover:bg-transparent hover:border-primary-10 group cursor-pointer"
            onClick={() => openModal("Create Manager Access", <CreateFacilityManagerDrawer closeModal={closeModal} />)}
          >
            <span className="text-white font-Raleway font-semibold text-base group-hover:text-primary-10">Create New Manager</span>
          </button>
        </div>
      </div>

      {/* stats card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <StatsCard
          title="Total Facility Managers"
          count="18"
          textColor="#E8EBEB"
          FTextColor="#1d3638"
          bodyBg="#4E6E6E"
          footerBg="#E1E7E7"
          footerText="Starts from 06 Jan 2025"
        />
        <StatsCard
          title="Approved Reports"
          count="32"
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Starts from 06 Jan 2025"
        />
        <StatsCard
          title="Pending Approval Reports"
          count="15"
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Starts from 06 Jan 2025"
        />
        <StatsCard
          title="Rejected Reports"
          count="6"
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText="Starts from 06 Jan 2025"
        />
      </div>

      <div className="flex flex-col gap-6 items-start mt-6  rounded-2xl border border-opacityClr-30 bg-white p-4">
        <h2 className="text-primary-10 font-Raleway font-bold text-lg">
          Newly Assigned <span className="text-primary-20"> Facilities </span>
        </h2>
        <div className="grid grid-cols-4 items-center gap-x-4 gap-y-8 w-full max-h-[700px] overflow-y-auto">
          {facilities.map((facility) => (
            <Link
              key={facility.id}
              href={`/facility-admin/${facility.id}`}
              className="h-auto w-full shadow border border-opacityClr-20 rounded-2xl hover:shadow-lg transition-shadow duration-300"
            >
              <figure className="w-full h-[150px] rounded-t-2xl flex flex-col items-start justify-between ">
                <Image
                  src={facility.image}
                  alt={facility.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full rounded-t-2xl object-cover "
                />
              </figure>
              <div className="flex items-center justify-between w-full p-3">
                <div className="flex flex-col items-start gap-1  w-full">
                  <h2 className="text-primary-10 font-Raleway text-base font-bold leading-normal uppercase">{facility.name}</h2>
                  <div className="flex items-center gap-2">
                    <Image src={location} alt="location" />
                    <p className="text-primary-10 font-Geist font-normal text-base leading-normal">{facility.location}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="bg-[#C2DF93] hidden md:flex items-center justify-center gap-2 p-3 rounded-full border border-neutral-lightGreen transition-colors duration-300 hover:[background-color:#E8EBEB] hover:[border-color:#C2DF93] group cursor-pointer"
                  tabIndex={-1}
                >
                  <BsArrowUpRight className="group-hover:text-opacityClr-100 transition-colors duration-300" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReportManagementPage;
