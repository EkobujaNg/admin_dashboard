"use client";
import React, { useState } from "react";
import Image from "next/image";
import { TiLocation } from "react-icons/ti";
import { FaSearch, FaTimes } from "react-icons/fa";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { MdArrowOutward } from "react-icons/md";
import {
  propertyA,
  propertyB,
  propertyC,
  emptyAssets,
  emptyStock,
} from "../../../public/assets/images";
import { useDrawerModal } from "@/context/DrawerModalContext";

// Trade Market Data
const tradeMarketArr = [
  {
    id: 1,
    name: "Winterfell Keep",
    location: "The North",
    image: propertyA,
    variants: [
      { pricePerUnit: "20,505.61", units: 13, margin: "-124.89" },
      { pricePerUnit: "20,280.61", units: 5, margin: "-465.07" },
    ],
  },
  {
    id: 2,
    name: "King’s Landing Tower",
    location: "Crownlands",
    image: propertyB,
    variants: [
      { pricePerUnit: "20,438.21", units: 2, margin: "-282.46" },
      { pricePerUnit: "20,689.08", units: 8, margin: "-0.00" },
    ],
  },
  {
    id: 3,
    name: "Storm’s End",
    location: "Stormlands",
    image: propertyC,
    variants: [
      { pricePerUnit: "20,180.61", units: 10, margin: "-507.15" },
      { pricePerUnit: "20,280.61", units: 10, margin: "-465.07" },
    ],
  },
  {
    id: 4,
    name: "The Red Keep",
    location: "King’s Landing",
    image: propertyB,
    variants: [
      { pricePerUnit: "19,999.99", units: 7, margin: "-320.50" },
      { pricePerUnit: "21,000.00", units: 6, margin: "-100.75" },
    ],
  },
  {
    id: 5,
    name: "Dragonstone Fortress",
    location: "Blackwater Bay",
    image: propertyA,
    variants: [
      { pricePerUnit: "20,450.75", units: 3, margin: "-280.90" },
      { pricePerUnit: "20,890.20", units: 4, margin: "-90.30" },
    ],
  },
  {
    id: 6,
    name: "Casterly Rock",
    location: "Westerlands",
    image: propertyC,
    variants: [
      // { pricePerUnit: "20,750.00", units: 8, margin: "-150.00" },
      // { pricePerUnit: "20,900.50", units: 5, margin: "-50.50" },
    ],
  },
];

const TradeMarketList = () => {
  const { openModal } = useDrawerModal();

  return (
    <div className="max-h-[600px] overflow-y-auto space-y-3 w-full">
      {tradeMarketArr.length > 0 ? (
        tradeMarketArr.map((market) => (
          <div
            key={market.id}
            onClick={() =>
              openModal(market.name, <p>{market.name}'s details</p>)
            }
            className="flex p-4 items-center justify-between gap-2 rounded-lg border border-opacityClr-10 bg-transparent w-full cursor-pointer transition-all duration-300 ease-linear hover:bg-opacityClr-10/50"
          >
            <div className="flex gap-2 items-center">
              <Image
                src={market.image}
                alt={market.name}
                width={64}
                height={46}
                className="rounded-lg w-16 h-auto"
              />

              <div className="flex flex-col gap-1 items-start">
                <h3 className="font-Raleway font-bold text-primary-10 text-base leading-normal">
                  {market.name}
                </h3>
                <div className="flex items-center gap-2">
                  <TiLocation className="text-[#325E62] font-bold" size={24} />
                  <p className="font-Raleway font-medium text-primary-10 text-base leading-normal">
                    {market.location}
                  </p>
                </div>
              </div>
            </div>

            <HiOutlineChevronRight size={20} className="text-primary-10" />
          </div>
        ))
      ) : (
        // Empty state design
        <div className="flex flex-col items-center gap-8 mt-10">
          <div className="flex flex-col items-center gap-6">
            <Image
              src={emptyAssets}
              alt="empty assets"
              width={220}
              height={175}
            />
            <p className="text-center text-base text-[#A5AFAF] font-Raleway font-normal leading-normal">
              You don't have any share listed at the moment, start investing
              now!
            </p>
          </div>

          <button
            type="button"
            className="flex py-3 px-5 items-center justify-center gap-2 rounded-md border border-opacityClr-100 bg-transparent w-full"
          >
            <span className="font-Geist font-semibold text-base text-primary-10 leading-[150%] tracking-[-0.16px]">
              Sell Stock
            </span>
            <MdArrowOutward size={20} className="text-primary-10 text-base" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TradeMarketList;
