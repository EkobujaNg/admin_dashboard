"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Search, X } from "lucide-react";
import Link from "next/link";
import PropertyCard from "@/components/views/PropertyCard";
import StatsCard from "@/components/ui/StatsCard";
import { usePropertyAPI } from "@/services/usePropertyAPI";
import { useDebounce } from "use-debounce";
import { emptyAssets } from "../../../../public/assets/images";

const PropertiesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const searchTerm =
    debouncedSearchQuery.trim().length >= 2 ? debouncedSearchQuery.trim() : "";

  const { properties, isLoadingProperties, propertyStatistics, isLoadingStatistics } = usePropertyAPI({
    page: 1,
    limit: 20,
    searchTerm,
    enableProperties: true,
    enableStatistics: true,
  });

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
  const handleClearSearch = () => setSearchQuery("");

  const displayProperties = properties?.pageItems || [];

  return (
    <section className="flex flex-col gap-6 pb-5">
      <div className="flex flex-wrap items-center justify-between w-full gap-4">
        <div>
          <h2 className="text-[28px] font-Raleway font-bold text-primary-10">
            Property <span className="text-primary-20">Listings</span>
          </h2>
          <p className="text-sm font-Raleway font-medium text-primary-10">Create and manage your properties across all users</p>
        </div>
        <Link
          href="/properties/add"
          className="flex items-center justify-center gap-3 w-[251px] h-14 bg-primary-10 rounded-[100px] border border-transparent transition hover:bg-transparent hover:border-primary-10 group"
        >
          <span className="text-white font-Raleway font-semibold text-base group-hover:text-primary-10">Add Property</span>
          <ArrowUpRight className="text-white group-hover:text-primary-10 w-5 h-5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <StatsCard
          title="Total Property Listed"
          count={isLoadingStatistics ? "..." : propertyStatistics?.totalProperties?.toString() || "0"}
          textColor="#1d3638"
          bodyBg="#C2DF93"
          footerBg="#DAECBE"
          footerText={`Starts from ${formatDate(propertyStatistics?.startDate)}`}
        />
        <StatsCard
          title="Active Property"
          count={isLoadingStatistics ? "..." : propertyStatistics?.activeProperties?.toString() || "0"}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText={`Starts from ${formatDate(propertyStatistics?.startDate)}`}
        />
        <StatsCard
          title="Total Units Of Stocks"
          count={isLoadingStatistics ? "..." : propertyStatistics?.totalStocks?.toString() || "0"}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText={`Starts from ${formatDate(propertyStatistics?.startDate)}`}
        />
        <StatsCard
          title="Inactive Stocks"
          count={isLoadingStatistics ? "..." : propertyStatistics?.inactiveStocks?.toString() || "0"}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText={`Starts from ${formatDate(propertyStatistics?.startDate)}`}
        />
      </div>

      <div className="flex items-center gap-2 px-6 py-[14px] bg-[#ECECEC] rounded-[100px] w-full">
        {searchQuery ? (
          <X className="text-[#8C9394] cursor-pointer font-normal" onClick={handleClearSearch} />
        ) : (
          <Search className="text-[#8C9394]" />
        )}
        <input
          type="text"
          className="bg-transparent w-full outline-none focus:bg-transparent focus:border-none focus:text-primary-10 placeholder:text-[#8C9394] placeholder:text-sm placeholder:font-normal"
          placeholder="Search for property..."
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex flex-col gap-4 w-full">
        {isLoadingProperties ? (
          <div className="flex items-center justify-center w-full h-[250px]">
            <span className="font-Raleway text-opacityClr-60">Loading properties...</span>
          </div>
        ) : displayProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 mt-10 w-full">
            <Image src={emptyAssets} alt="empty assets" width={220} height={175} />
            <p className="text-center text-base text-[#A5AFAF] font-Raleway font-normal leading-normal">
              {searchTerm
                ? "No properties match your search."
                : "You don't have any property listed at the moment."}
            </p>
            <Link
              href="/properties/add"
              className="flex py-3 px-5 items-center justify-center gap-2 rounded-md border border-opacityClr-100 bg-transparent cursor-pointer w-fit"
            >
              <span className="font-Geist font-semibold text-base text-primary-10 leading-[150%] tracking-[-0.16px]">
                Add Property
              </span>
              <ArrowUpRight className="text-primary-10 text-base w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
            {displayProperties.map((property) => (
              <PropertyCard key={property.propertyId} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertiesPage;
