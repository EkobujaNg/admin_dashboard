"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  map,
  emptyBank,
  cardReaderGold,
  cardReaderSilver,
} from "../../../public/assets/images";
import { IoCheckmarkDone } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { useDrawerModal } from "@/context/DrawerModalContext";

const cardDetails = [
  {
    id: 1,
    bankName: "Access Bank",
    cardName: "CHINEDU OKWONKO",
    cardNumber: "1234567812345678",
    cardExpiration: "04/2028",
  },
  {
    id: 2,
    bankName: "Stark Bank",
    cardName: "JOHN SNOW",
    cardNumber: "1234567812345678",
    cardExpiration: "05/2030",
  },
];

const CardContents = () => {
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
        <h2 className="text-primary-10 font-Raleway font-bold text-base leading-[140%]">Cards</h2>
        <span className="text-opacityClr-50 font-Raleway font-semibold text-sm leading-[140%]">
          {cardDetails.length > 0 ? `${currentIndex + 1}/${cardDetails.length} Cards` : "No Cards Added"}
        </span>
      </div>

      {/* Show Banks or Empty State */}
      {cardDetails.length > 0 ? (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-4 w-full no-scrollbar"
        >
          {cardDetails.map((card, idx) => (
            <div key={idx} className="flex-shrink-0 snap-center w-full flex items-center justify-center">
              <div
                className="w-[255px] h-[156px] rounded-2xl relative bg-no-repeat bg-cover bg-center bg-black custom-gradient"
                style={{ backgroundImage: "url(/assets/images/cardPath.png)" }}
              >
                <h2 className="font-Raleway font-semibold text-white text-sm leading-[140%] uppercase absolute top-4 right-4">
                  {card.bankName}
                </h2>

                <Image src={cardReaderGold} alt="Bank Map" className="absolute left-4 top-12" />

                {/* Bank Details */}
                <div className="flex flex-col items-start gap-4 px-6 w-full">
                  <h2 className="font-Geist font-semibold text-white text-sm leading-[140%] uppercase tracking-widest absolute top-20 z-20">
                    {card.cardNumber}
                  </h2>

                  <div className="flex flex-col items-start justify-between w-full absolute left-[8rem] top-[6.2rem] z-20 mt3">
                    <p className="font-Raleway font-light text-opacityClr-20 text-[8px] leading-[140%]">Month/Year</p>
                    <p className="font-Raleway font-light text-opacityClr-20 text-[8px] leading-[140%]">
                      <span className="font-bold">EXP</span> {card.cardExpiration}
                    </p>
                  </div>

                  <p className="font-Raleway font-semibold text-opacityClr-10 text-[10px] leading-[140%] absolute top-[8rem] z-20">
                    {card.cardName}
                  </p>
                </div>

                <Image src={cardReaderSilver} alt="Bank Map" className="absolute right-4 top-28" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty State UI
        <div className="flex flex-col items-center justify-center gap-6 mt-10 w-full">
          <Image src={emptyBank} alt="No Bank" width={334} height={201} />
          <p className="text-center text-base text-[#A5AFAF] font-Raleway font-normal leading-normal">
            Add a card for easy and quick withdrawals.
          </p>
        </div>
      )}

      <button
        type="button"
        className=" border border-dashed border-primary-10 w-full flex items-center justify-center py-4 px-6 gap-3 rounded-lg mt-20"
        onClick={() => openModal("Add Card", <p>Add card form contents...</p>)}
      >
        <GoPlus size={20} className="text-primary-10 font-semibold" />
        <span className="font-Geist font-semibold text-primary-10 text-base leading-[150%] tracking-[-0.16px]">Add Card</span>
      </button>
    </div>
  );
};

export default CardContents;
