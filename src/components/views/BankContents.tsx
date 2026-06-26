"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { map, emptyBank } from "../../../public/assets/images";
import { CheckCheck, Plus } from "lucide-react";
import { useDrawerModal } from "@/context/DrawerModalContext";

const bankDetails = [
  {
    id: 1,
    name: "CHINEDU OKWONKO",
    bankName: "Access Bank",
    accNumber: "1234567890",
  },
  {
    id: 2,
    name: "JOHN SNOW",
    bankName: "Stark Bank",
    accNumber: "1234567890",
  },
  {
    id: 3,
    name: "Jamie Lannister",
    bankName: "Lannister Bank",
    accNumber: "1234567890",
  },
];

const BankContents = () => {
  const { openModal } = useDrawerModal();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const cardWidth = scrollRef.current.clientWidth;
    const index = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(index);
  };

  return (
    <div className="flex flex-col items-start justify-center gap-6 w-full">
      {/* Header with Count */}
      <div className="flex items-center justify-between w-full px-2">
        <h2 className="text-primary-10 font-Raleway font-bold text-base leading-[140%]">
          Banks
        </h2>
        <span className="text-opacityClr-50 font-Raleway font-semibold text-sm leading-[140%]">
          {bankDetails.length > 0
            ? `${currentIndex + 1}/${bankDetails.length} Banks`
            : "No Banks Added"}
        </span>
      </div>

      {/* Show Banks or Empty State */}
      {bankDetails.length > 0 ? (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-4 w-full"
        >
          {bankDetails.map((bank, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 snap-center w-full flex items-center justify-center"
            >
              <div className="w-[255px] h-[156px] rounded-2xl custom-gradient relative">
                {/* Checkmark */}
                <CheckCheck
                  className="text-opacityClr-10 absolute top-4 right-4 w-5 h-5"
                />

                {/* Background Image */}
                <Image
                  src={map}
                  alt="Bank Map"
                  width={110}
                  height={102}
                  className="absolute right-0 top-10 z-10"
                />

                {/* Bank Details */}
                <div className="flex flex-col items-start gap-4 absolute top-20 z-20 px-6 w-full">
                  <h2 className="font-Raleway font-semibold text-white text-sm leading-[140%] uppercase">
                    {bank.name}
                  </h2>

                  <div className="flex items-start justify-between w-full">
                    <p className="font-Raleway font-semibold text-white text-sm leading-[140%]">
                      {bank.bankName}
                    </p>
                    <p className="font-Raleway font-semibold text-white text-sm leading-[140%]">
                      {bank.accNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty State UI
        <div className="flex flex-col items-center justify-center gap-6 mt-10 w-full">
          <Image
            src={emptyBank}
            alt="No Bank"
            width={334}
            height={201}
          />
          <p className="text-center text-base text-[#A5AFAF] font-Raleway font-normal leading-normal">
            Add a bank for easy and quick withdrawals.
          </p>
        </div>
      )}

      <button
        type="button"
        className=" border border-dashed border-primary-10 w-full flex items-center justify-center py-4 px-6 gap-3 rounded-lg mt-10"
        onClick={() => openModal("Add Bank", <p>Add bank form contents...</p>)}
      >
        <Plus className="w-5 h-5 text-primary-10 font-semibold" />
        <span className="font-Geist font-semibold text-primary-10 text-base leading-[150%] tracking-[-0.16px]">
          Add Bank
        </span>
      </button>
    </div>
  );
};

export default BankContents;
