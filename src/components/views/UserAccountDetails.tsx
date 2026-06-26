"use client";
import React, { useRef } from "react";
import Tooltip from "@/components/ui/Tooltip";
import { Info, Calendar, Upload, ChevronDown } from "lucide-react";

const AccountDetails = ({ userDetails, onInputChange, onAvatarUpload, onGovernmentIdUpload }: { userDetails?: any; onInputChange?: any; onAvatarUpload?: any; onGovernmentIdUpload?: any }) => {
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenderChange = (e) => {
    onInputChange(e);
  };

  return (
    <div className="flex flex-col gap-6 w-full overflow-y-auto pb-24">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl overflow-hidden">
          {/* Display uploaded avatar or placeholder */}
          {userDetails.avatarImage ? (
            <img src={userDetails.avatarImage} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21.75a8.966 8.966 0 01-5.982-2.975M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
        </div>
        <button type="button" onClick={handleAvatarClick} className="text-primary-500 text-sm font-medium cursor-pointer">
          Tap to change image
        </button>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-6 w-full">
        {/* First Name */}
        <div className="flex flex-col gap-2">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">First name</label>
          <input
            type="text"
            name="firstName"
            value={userDetails.firstName}
            onChange={onInputChange}
            className="w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-opacityClr-10"
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-2">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">Last name</label>
          <input
            type="text"
            name="lastName"
            value={userDetails.lastName}
            onChange={onInputChange}
            className="w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-opacityClr-10"
          />
        </div>

        {/* Email address */}
        <div className="flex flex-col gap-2">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">Email address</label>
          <input
            type="email"
            name="email"
            value={userDetails.email}
            onChange={onInputChange}
            className="w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-opacityClr-10"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">Password</label>
          <button className="w-fit px-5 py-2.5 text-sm text-white border rounded-lg bg-primary-10 cursor-pointer">Reset Password</button>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%">Phone Number</label>
          <div className="flex items-center w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-transparent">
            {/* Placeholder for country code dropdown/icon */}
            <span className="mr-2">🌍</span>
            <input
              type="text"
              name="phoneNumber"
              value={userDetails.phoneNumber}
              onChange={onInputChange}
              className="flex-1 border-none bg-transparent outline-none"
            />
          </div>
        </div>

        {/* BVN (Bank Verification Number) */}
        <div className="flex flex-col gap-2">
          <label className="flex font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%] items-center">
            BVN (Bank Verification Number)
            <Tooltip text="This is for verification purposes!">
              <span className="ml-2 flex items-center justify-center bg-opacityClr-10 px-2 py-1 rounded-full">
                <Info className="cursor-pointer text-gray-500 w-[18px] h-[18px]" />
                Why?
              </span>
            </Tooltip>
          </label>
          <input
            type="text"
            name="bvn"
            value={userDetails.bvn}
            onChange={onInputChange}
            className="w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-opacityClr-10"
          />
        </div>

        {/* Verification Status */}
        <div className="flex flex-col gap-2">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">Verification Status</label>
          {/* Placeholder for dropdown */}
          <div className="relative w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-opacityClr-10 flex items-center justify-between">
            Verified
            <ChevronDown />
          </div>
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold text-opacityClr-100">Gender</label>

          <div className="flex gap-6 ">
            <label className="flex items-center gap-2 cursor-pointer w-full p-4 rounded-lg border border-opacityClr-50">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={userDetails.gender === "male"}
                onChange={handleGenderChange}
                className="hidden peer"
              />

              <span className=" w-4 h-4 border border-opacityClr-50 rounded-full flex items-center justify-center peer-checked:bg-primary-10 peer-checked:border-primary-10"></span>

              <span className="text-opacityClr-100">Male</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer w-full p-4 rounded-lg border border-opacityClr-50">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={userDetails.gender === "female"}
                onChange={handleGenderChange}
                className="hidden peer"
              />
              <span className="w-4 h-4 border border-opacityClr-50 rounded-full flex items-center justify-center peer-checked:bg-primary-10 peer-checked:border-primary-10"></span>
              <span className="text-opacityClr-100">Female</span>
            </label>
          </div>
        </div>

        {/* Upload Any Government Issued ID */}
        <div className="flex flex-col gap-2">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">
            Upload Any Government Issued ID
          </label>
          <div className="flex items-center w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-opacityClr-10">
            <input
              type="text"
              name="governmentId"
              value={userDetails.governmentId}
              onChange={onInputChange}
              className="flex-1 border-none bg-transparent outline-none"
            />
            <Upload className="cursor-pointer text-gray-500 w-[18px] h-[18px]" />
          </div>
        </div>

        {/* Date Of Birth */}
        <div className="flex flex-col gap-2">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">Date Of Birth</label>
          <div className="flex items-center w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-transparent">
            <input
              type="text"
              name="dateOfBirth"
              value={userDetails.dateOfBirth}
              onChange={onInputChange}
              className="flex-1 border-none bg-transparent outline-none"
            />
            <Calendar className="cursor-pointer text-gray-500 w-[18px] h-[18px]" />
          </div>
        </div>

        {/* Residential Address */}
        <div className="flex flex-col gap-2">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">Residential Address</label>
          <input
            type="text"
            name="residentialAddress"
            value={userDetails.residentialAddress}
            onChange={onInputChange}
            className="w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
