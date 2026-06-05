"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { MdArrowOutward } from "react-icons/md";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useDrawerModal } from "@/context/DrawerModalContext";
import PropertyCard from "@/components/views/PropertyCard";
import AddPropertyCardDrawer from "@/components/views/AddPropertyCardDrawer";
import RecentActivities from "@/components/views/RecentActivities";
import TradeMarketList from "@/components/views/TradeMarketList";
import StatsCard from "@/components/ui/StatsCard";
import TabButton from "@/components/ui/TabButton";
import { usePropertyAPI } from "@/services/usePropertyAPI";
import { useDebounce } from "use-debounce";
import { emptyAssets } from "../../../../public/assets/images";
import { dummyPropertiesData, dummyPropertyStatistics } from "@/data";

const PropertiesPage = () => {
  const { openModal } = useDrawerModal();
  const [activeTab, setActiveTab] = useState("allProperties");
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search input
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  // Use dummy data when backend is down - set to true to use dummy data
  const USE_DUMMY_DATA = true;

  // Fetch properties data based on tab & search
  const { properties, isLoadingProperties, searchProperty, isLoadingSearch, propertyStatistics, isLoadingStatistics } = usePropertyAPI({
    searchTerm: debouncedSearchQuery && debouncedSearchQuery.trim().length >= 2 ? debouncedSearchQuery : "",
    enableProperties: activeTab === "allProperties" && !USE_DUMMY_DATA,
    enableStatistics: !USE_DUMMY_DATA,
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Input handling
  const handleInputChange = (e) => setSearchQuery(e.target.value);
  const handleClearSearch = () => setSearchQuery("");

  // Select which data to show
  const displayProperties = useMemo(() => {
    if (USE_DUMMY_DATA) {
      // Use dummy data
      if (debouncedSearchQuery.trim().length >= 2) {
        // Filter dummy data based on search
        return dummyPropertiesData.pageItems.filter(
          (prop) =>
            prop.propertyName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            prop.propertyLocation.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            prop.propertyCode.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
      }
      return dummyPropertiesData.pageItems;
    }
    // Use real API data
    if (debouncedSearchQuery.trim().length >= 2) {
      return searchProperty?.pageItems || [];
    }
    return properties?.pageItems || [];
  }, [debouncedSearchQuery, searchProperty, properties]);

  const isLoading = USE_DUMMY_DATA ? false : isLoadingProperties || isLoadingSearch;

  // Use dummy statistics if using dummy data
  const displayStatistics = USE_DUMMY_DATA ? dummyPropertyStatistics : propertyStatistics;
  const displayIsLoadingStatistics = USE_DUMMY_DATA ? false : isLoadingStatistics;

  return (
    <section className="flex flex-col gap-6 pb-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between w-full gap-4">
        <div>
          <h2 className="text-[28px] font-Raleway font-bold text-primary-10">
            Property <span className="text-primary-20">Listings</span>
          </h2>
          <p className="text-sm font-Raleway font-medium text-primary-10">Create and manage your properties across all users</p>
        </div>
        <button
          onClick={() => openModal("Create Property Listing", <AddPropertyCardDrawer />)}
          className="flex items-center justify-center gap-3 w-[251px] h-14 bg-primary-10 rounded-[100px] border border-transparent transition hover:bg-transparent hover:border-primary-10 group"
        >
          <span className="text-white font-Raleway font-semibold text-base group-hover:text-primary-10">Add Property</span>
          <MdArrowOutward className="text-white group-hover:text-primary-10 w-5 h-5" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <StatsCard
          title="Total Property Listed"
          count={displayStatistics?.totalProperties?.toString() || "0"}
          textColor="#1d3638"
          bodyBg="#C2DF93"
          footerBg="#DAECBE"
          footerText={`Starts from ${formatDate(displayStatistics?.startDate) || "N/A"}`}
          isLoading={displayIsLoadingStatistics}
        />
        <StatsCard
          title="Active Property"
          count={displayStatistics?.activeProperties?.toString() || "0"}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText={`Starts from ${formatDate(displayStatistics?.startDate) || "N/A"}`}
          isLoading={displayIsLoadingStatistics}
        />
        <StatsCard
          title="Total Units Of Stocks"
          count={displayStatistics?.totalStocks?.toString() || "0"}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText={`Starts from ${formatDate(displayStatistics?.startDate) || "N/A"}`}
          isLoading={displayIsLoadingStatistics}
        />
        <StatsCard
          title="Inactive Stocks"
          count={displayStatistics?.inactiveStocks?.toString() || "0"}
          textColor="#1d3638"
          bodyBg="#EFF1F1"
          footerBg="#E1E7E7"
          footerText={`Starts from ${formatDate(displayStatistics?.startDate) || "N/A"}`}
          isLoading={displayIsLoadingStatistics}
        />
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-center gap-2 w-full bg-[#ECECEC] rounded-[100px]">
          <TabButton label="All Properties" isActive={activeTab === "allProperties"} onClick={() => setActiveTab("allProperties")} />
          <TabButton label="Trade Market" isActive={activeTab === "tradeMarket"} onClick={() => setActiveTab("tradeMarket")} />
        </div>

        <div className="flex items-center gap-2 px-6 py-[14px] bg-[#ECECEC] rounded-[100px] w-full">
          {searchQuery ? (
            <FaTimes className="text-[#8C9394] cursor-pointer font-normal" onClick={handleClearSearch} />
          ) : (
            <FaSearch className="text-[#8C9394]" />
          )}
          <input
            type="text"
            className="bg-transparent w-full outline-none focus:bg-transparent focus:border-none focus:text-primary-10 placeholder:text-[#8C9394] placeholder:text-sm placeholder:font-normal"
            placeholder={`Search for ${activeTab === "allProperties" ? "property..." : "trade property..."}`}
            value={searchQuery}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* Left Section */}
        <div className="flex flex-col gap-4 w-full lg:w-[67%]">
          {activeTab === "allProperties" ? (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center w-full h-[250px]">
                  <span>loading...</span>
                </div>
              ) : displayProperties.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-6 mt-10 w-full">
                  <Image src={emptyAssets} alt="empty assets" width={220} height={175} />
                  <p className="text-center text-base text-[#A5AFAF] font-Raleway font-normal leading-normal">
                    You don't have any property listed at the moment, start investing now!
                  </p>
                  <button
                    type="button"
                    onClick={() => openModal("Create Property Listing", <AddPropertyCardDrawer />)}
                    className="flex py-3 px-5 items-center justify-center gap-2 rounded-md border border-opacityClr-100 bg-transparent cursor-pointer w-fit "
                  >
                    <span className="font-Geist font-semibold text-base text-primary-10 leading-[150%] tracking-[-0.16px] group-hover:text-primary-10">
                      Add Property
                    </span>
                    <MdArrowOutward size={20} className="text-primary-10 text-base group-hover:text-primary-10" />
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4 w-full">
                  {displayProperties.map((property) => (
                    <PropertyCard key={property.propertyId} property={property} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-base text-primary-10 font-Raleway">
                Sell, invest into property-stocks in minutes. Click on available property to view stocks sold by other users.
              </p>
              <TradeMarketList />
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-6 w-full lg:w-[33%]">
          <h2 className="text-lg font-Raleway font-bold text-primary-10">
            Recent <span className="text-primary-20">Activities</span>
          </h2>
          <RecentActivities />
        </div>
      </div>
    </section>
  );
};

export default PropertiesPage;
