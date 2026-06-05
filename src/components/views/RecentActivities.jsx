"use client";
import React, { useState } from "react";
import Image from "next/image";
import { TiLocation } from "react-icons/ti";
import {
  propertyA,
  propertyB,
  propertyC,
  emptyWallet,
} from "../../../public/assets/images";
import { useDrawerModal } from "@/context/DrawerModalContext";

// Property Data
const propertiesHistory = [
  {
    id: 1,
    name: "WONDERLAND ESTATE",
    location: "FCT Abuja",
    currentPrice: "₦20,995",
    priceChange: { value: "0.1%", direction: "up" },
    image: propertyA,
  },

  {
    id: 2,
    name: "SKYLINE HOTEL",
    location: "Lekki, Lagos",
    currentPrice: "₦18,420",
    priceChange: { value: "0.2%", direction: "down" },
    image: propertyB,
  },
  {
    id: 3,
    name: "GOLDEN PLAZA",
    location: "Victoria Island, Lagos",
    currentPrice: "₦15,760",
    priceChange: { value: "0.5%", direction: "up" },

    image: propertyC,
  },
  {
    id: 4,
    name: "SKYLINE HOTEL",
    location: "Lekki, Lagos",
    currentPrice: "₦18,420",
    priceChange: { value: "0.2%", direction: "down" },
    image: propertyB,
  },
  {
    id: 5,
    name: "GOLDEN PLAZA",
    location: "Victoria Island, Lagos",
    currentPrice: "₦15,760",
    priceChange: { value: "0.5%", direction: "up" },

    image: propertyA,
  },
];

const RecentActivities = () => {
  const { openModal } = useDrawerModal();

  // Function to handle modal opening
  const handleOpenModal = (property) => {
    openModal(property.name, <p>{property.name}'s Recent Activities</p>);
  };

  return (
    <div className="flex flex-col gap-3 items-start w-full">
      {/* Show title only if properties exist */}
      {propertiesHistory.length > 0 && (
        <p className="font-Raleway font-bold text-primary-10 text-base leading-normal">
          Your co-owned assets
        </p>
      )}

      {/* Check if properties exist */}
      <div className="max-h-[600px] overflow-y-auto space-y-3 w-full">
        {propertiesHistory.length > 0 ? (
          propertiesHistory.map((property) => (
            <div
              key={property.id}
              onClick={() => handleOpenModal(property)}
              className="flex p-4 items-center justify-between gap-2 rounded-lg border border-opacityClr-10 bg-transparent w-full cursor-pointer transition-all duration-300 ease-linear hover:bg-opacityClr-10/50"
            >
              <div className="flex gap-2 items-center">
                <Image
                  src={property.image}
                  alt={property.name}
                  width={64}
                  height={46}
                  className="rounded-lg w-16 h-auto"
                />

                <div className="flex flex-col gap-1 items-start">
                  <h3 className="font-Raleway font-bold text-primary-10 text-base leading-normal">
                    {property.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <TiLocation
                      className="text-[#325E62] font-bold"
                      size={24}
                    />
                    <p className="font-Raleway font-medium text-primary-10 text-base leading-normal">
                      {property.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 items-start">
                <p className="font-Raleway font-medium text-primary-10 text-base leading-normal">
                  {property.currentPrice}
                </p>
                <div className="flex items-center gap-1">
                  <p
                    className={`font-Raleway font-medium text-sm ${
                      property.priceChange.direction === "up"
                        ? "text-[#6D9F1B]"
                        : "text-[#FF3D00]"
                    }`}
                  >
                    {property.priceChange.direction === "up" ? "▲" : "▼"}{" "}
                    {property.priceChange.value}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Empty state design
          <div className="flex flex-col items-center gap-8 mt-10">
            <div className="flex flex-col items-center gap-6">
              <Image
                src={emptyWallet}
                alt="empty wallet"
                width={220}
                height={175}
              />
              <p className="text-center text-base text-[#A5AFAF] font-Raleway font-normal leading-normal">
                You don't have any co-owned asset, start an investment and make
                sure to fund your wallet first.
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 w-full">
              <button
                type="button"
                className="flex py-3 px-5 items-center justify-center gap-2 rounded-md border border-opacityClr-100 bg-transparent w-full"
              >
                <span className="font-Geist font-semibold text-base text-primary-10 leading-[150%] tracking-[-0.16px]">
                  Sell Stocks
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivities;
