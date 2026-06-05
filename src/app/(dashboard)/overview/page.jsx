"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { MdArrowOutward } from "react-icons/md";
import { useDrawerModal } from "@/context/DrawerModalContext";
import PropertyCard from "@/components/views/PropertyCard";
import RecentActivities from "@/components/views/RecentActivities";
import AddPropertyCardDrawer from "@/components/views/AddPropertyCardDrawer";
import { usePropertyAPI } from "@/services/usePropertyAPI";
import { emptyAssets } from "../../../../public/assets/images";
import { companyFilledIcon, userIconFilled, bagIconFilled, chartIconFilled } from "../../../../public/assets/icons";
const InvestmentRevenueChart = dynamic(() => import("@/components/views/InvestmentRevenueChart"), {
  ssr: false,
  loading: () => <div className="spinner"></div>,
});

const InvestmentMetricsChart = dynamic(() => import("@/components/views/InvestmentMetricsChart"), {
  ssr: false,
  loading: () => <div className="spinner"></div>,
});

const Overview = () => {
  const { openModal } = useDrawerModal();

  // Fetch properties data
  const { properties, isLoadingProperties, refetchProperties } = usePropertyAPI({ enableProperties: true });

  // Get the first 4 properties to display in the overview
  const featuredProperties = useMemo(() => {
    return (properties?.pageItems || []).slice(0, 4);
  }, [properties]);
  return (
    <section className="flex flex-col gap-6 ">
      {/* header */}
      <div className="flex flex-col gap-1 items-start">
        <h2 className="text-primary-10 font-Raleway font-bold text-[28px]">
          Hello <span className="text-primary-20">Admin</span>
        </h2>
        <p className="text-primary-10 font-Raleway text-sm">Welcome to EkoBuja Admin Dashboard.</p>
      </div>

      {/* stats card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {/* stat card 1 */}
        <div
          className="w-full h-[195px] rounded-lg flex flex-col bg-cover bg-center bg-no-repeat bg-primary-10 "
          style={{
            backgroundImage: "url('/assets/images/walletPattern.png')",
          }}
        >
          <div className="flex flex-col gap-4 px-6 py-4">
            <span className="w-12 h-12 flex p-2.5 items-center justify-center gap-2.5 rounded-[10px] bg-opacityClr-10">
              <Image src={companyFilledIcon} alt="company" width={24} height={24} />
            </span>
            <div className="flex flex-col items-start">
              <p className="font-Raleway font-semibold text-base text-opacityClr-10">Total Properties</p>
              <h3 className="font-Raleway font-semibold text-[32px] text-opacityClr-10">0</h3>
            </div>
          </div>
          <div className="py-2 px-6 rounded-b-lg bg-[#DBE5E5]">
            <Link href="/" className="font-Raleway font-semibold text-sm text-primary-10 underline">
              View listed properties
            </Link>
          </div>
        </div>

        {/* stat card 2 */}
        <div className="w-full rounded-lg flex flex-col bg-[#EFF1F1] ">
          <div className="flex flex-col gap-4 px-6 py-4">
            <span className="w-12 h-12 flex p-2.5 items-center justify-center gap-2.5 rounded-[10px] bg-[#E1E7E7]">
              <Image src={userIconFilled} alt="company" width={24} height={24} />
            </span>
            <div className="flex flex-col items-start">
              <p className="font-Raleway font-semibold text-base text-primary-10">Active Users</p>
              <h3 className="font-Raleway font-semibold text-[32px] text-primary-10">0</h3>
            </div>
          </div>

          <div className="py-2 px-6 rounded-b-lg bg-[#E1E7E7]">
            <p className="font-Raleway font-semibold text-sm text-primary-10">Starts from 06 Jan 2025</p>
          </div>
        </div>

        {/* stat card 3 */}
        <div className="w-full rounded-lg flex flex-col bg-[#EFF1F1] ">
          <div className="flex flex-col gap-4 px-6 py-4">
            <span className="w-12 h-12 flex p-2.5 items-center justify-center gap-2.5 rounded-[10px] bg-[#E1E7E7]">
              <Image src={bagIconFilled} alt="company" width={24} height={24} />
            </span>
            <div className="flex flex-col items-start">
              <p className="font-Raleway font-semibold text-base text-primary-10">Revenue Generated</p>
              <h3 className="font-Raleway font-semibold text-[32px] text-primary-10">0</h3>
            </div>
          </div>

          <div className="py-2 px-6 rounded-b-lg bg-[#E1E7E7]">
            <p className="font-Raleway font-semibold text-sm text-primary-10">Starts from 06 Jan 2025</p>
          </div>
        </div>

        {/* stat card 4 */}
        <div className="w-full rounded-lg flex flex-col bg-[#EFF1F1] ">
          <div className="flex flex-col gap-4 px-6 py-4">
            <span className="w-12 h-12 flex p-2.5 items-center justify-center gap-2.5 rounded-[10px] bg-[#E1E7E7]">
              <Image src={chartIconFilled} alt="company" width={24} height={24} />
            </span>
            <div className="flex flex-col items-start">
              <p className="font-Raleway font-semibold text-base text-primary-10">Total Stock</p>
              <h3 className="font-Raleway font-semibold text-[32px] text-primary-10">0</h3>
            </div>
          </div>

          <div className="py-2 px-6 rounded-b-lg bg-[#E1E7E7]">
            <p className="font-Raleway font-semibold text-sm text-primary-10">Starts from 06 Jan 2025</p>
          </div>
        </div>
      </div>

      {/* reviewing list  */}
      <div className="flex gap-6 items-center justify-between py-4 px-6 w-full rounded-2xl bg-primary-10">
        <div className="flex gap-6 items-center">
          <span className="w-14 h-14 flex p-2.5 items-center justify-center gap-2.5 rounded-[10px] bg-opacityClr-10">
            <Image src={companyFilledIcon} alt="company" width={24} height={24} />
          </span>

          <div className="flex flex-col gap-1.5 items-start">
            <p className="text-opacityClr-10 text-sm font-Raleway font-normal leading-normal">
              <span className="font-bold"> 74 Tenant </span>
              has been submitted recently, please check it out!
            </p>

            <p className="text-opacityClr-10 text-xs font-Raleway font-normal leading-normal">
              There are some issue found, review it and approve.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-neutral-lightGreen text-base text-primary-10 font-Raleway font-semibold leading-[150%] tracking-[-0.16px]"
        >
          Review listing
        </Link>
      </div>

      {/* analytics */}
      <div className="flex flex-col gap-6 items-start mt-6">
        <h2 className="text-primary-10 font-Raleway font-bold text-lg">
          Statistics & <span className="text-primary-20"> Revenue Metrics </span>
        </h2>
        <div className="flex items-center gap-4 w-full">
          {/* InvestmentRevenue Chart */}
          <InvestmentRevenueChart />

          {/* InvestmentMetrics chart */}
          <InvestmentMetricsChart />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* Left Section */}
        <div className="flex flex-col gap-4 w-full lg:w-[67%]">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-Raleway font-bold text-primary-10">
                Listing <span className="text-primary-20">Board</span>
              </h2>
              <span className="flex justify-center items-center gap-2.5 px-2 py-1 rounded bg-neutral-lightGreen font-Raleway font-bold text-[10px] text-primary-10 leading-[150%] uppercase">
                Newly Added
              </span>
            </div>

            <Link href="/properties">
              <button className="flex items-center justify-center gap-3 w-fit px-5 py-3 bg-primary-10 rounded-[100px] border border-transparent transition hover:bg-transparent hover:border-primary-10 group">
                <span className="text-white font-Raleway font-semibold text-base group-hover:text-primary-10">Explore all listings</span>
              </button>
            </Link>
          </div>
          {isLoadingProperties ? (
            <div className="grid md:grid-cols-2 gap-4 w-full">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-[500px] w-full" />
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4 w-full">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.propertyId} property={property} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-6 mt-10 w-full">
              <Image src={emptyAssets} alt="empty assets" width={220} height={175} />
              <p className="text-center text-base text-[#A5AFAF] font-Raleway font-normal leading-normal">
                You don't have any property listed at the moment, start investing now!
              </p>
              <button
                type="button"
                onClick={() => openModal("Create Property Listing", <AddPropertyCardDrawer />)}
                className="flex py-3 px-5 items-center justify-center gap-2 rounded-md border border-opacityClr-100 bg-transparent cursor-pointer w-fit"
              >
                <span className="font-Geist font-semibold text-base text-primary-10 leading-[150%] tracking-[-0.16px] group-hover:text-primary-10">
                  Add Property
                </span>
                <MdArrowOutward size={20} className="text-primary-10 text-base group-hover:text-primary-10" />
              </button>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-6 w-full lg:w-[33%]">
          <h2 className="text-lg font-Raleway font-bold text-primary-10">
            Investment <span className="text-primary-20">History</span>
          </h2>
          <RecentActivities />
        </div>
      </div>
    </section>
  );
};

export default Overview;
