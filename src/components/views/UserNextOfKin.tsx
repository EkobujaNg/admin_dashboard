"use client";
import React from "react";
import { Calendar } from "lucide-react";

const NextOfKin = ({ nextOfKinDetails, onInputChange, onGovernmentIdUpload }: { nextOfKinDetails?: any; onInputChange?: any; onGovernmentIdUpload?: any }) => {
  const handleChange = (e) => {
    onInputChange(e);
  };

  return (
    <div className="flex flex-col gap-6 w-full overflow-y-auto pb-24">
      <div className="flex flex-col gap-4 w-full">
        {/* First Name */}
        <div className="flex flex-col gap-2">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">First name</label>
          <input
            type="text"
            name="firstName"
            value={nextOfKinDetails.firstName}
            onChange={handleChange}
            placeholder="eg. Thomas"
            className="w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-opacityClr-10"
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-2">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">Last name</label>
          <input
            type="text"
            name="lastName"
            value={nextOfKinDetails.lastName}
            onChange={handleChange}
            placeholder="eg. Frank"
            className="w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-opacityClr-10"
          />
        </div>

        {/* Email address */}
        <div className="flex flex-col gap-2">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">Email address</label>
          <input
            type="email"
            name="email"
            value={nextOfKinDetails.email}
            onChange={handleChange}
            placeholder="eg. thomasfrank@email.com"
            className="w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-opacityClr-10"
          />
        </div>

        {/* Date Of Birth */}
        <div className="flex flex-col gap-2">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">Date Of Birth</label>
          <div className="flex items-center w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-opacityClr-10">
            <input
              type="text"
              name="dateOfBirth"
              value={nextOfKinDetails.dateOfBirth}
              onChange={handleChange}
              placeholder="XX-XX-XXXX"
              className="flex-1 border-none bg-transparent outline-none"
            />
            <Calendar className="cursor-pointer text-gray-500 w-[18px] h-[18px]" />
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%">Phone Number</label>
          <div className="flex items-center w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-transparent">
            <input
              type="text"
              name="phoneNumber"
              value={nextOfKinDetails.phoneNumber}
              onChange={handleChange}
              className="flex-1 border-none bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Relationship */}
        <div className="flex flex-col gap-2">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">Relationship</label>
          <input
            type="text"
            name="relationship"
            value={nextOfKinDetails.relationship}
            onChange={handleChange}
            placeholder="eg. Spouse"
            className="w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-opacityClr-10"
          />
        </div>
      </div>
    </div>
  );
};

export default NextOfKin;
