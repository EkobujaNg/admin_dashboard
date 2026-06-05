"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import Tooltip from "@/components/ui/Tooltip";
import defaultAvatar from "../../../../../public/assets/images/avatar.svg";
import Breadcrumb from "@/components/ui/Breadcrumb";

const PersonalInformation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    profilePic: null,
    organizationName: "Ekobuja",
    accessType: "Owner",
    dateAndTime: "Nigeria",
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle File Upload for Profile Picture
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePic: URL.createObjectURL(file) });
    }
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-6 px-6 w-full">
      <Breadcrumb items={[{ label: "Settings", href: "/settings" }, { label: "Account Information" }]} />

      <form className="flex flex-col gap-6  pb-10 w-full" onSubmit={handleSubmit} autoComplete="off">
        <div className="flex flex-col gap-6 w-full">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center gap-2">
            <label htmlFor="profilePic" className="relative cursor-pointer">
              <Image
                src={formData.profilePic || defaultAvatar}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full object-cover border-2 border-dashed border-primary-10 bg-opacityClr-40 w-[120px] h-[120px]"
              />
              <input type="file" id="profilePic" accept="image/*" onChange={handleProfilePicChange} className="hidden" />
            </label>

            <p className="text-base text-primary-10 text-center font-Raleway font-bold leading-normal">Tap to change image</p>
          </div>

          {/* organizationName */}
          <div className="flex flex-col gap-2 items-start w-full">
            <label htmlFor="organizationName" className="text-base font-Raleway font-semibold leading-[150%] text-opacityClr-100">
              Organization Name
            </label>

            <input
              type="text"
              id="organizationName"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              placeholder="eg. Ekobuja"
              readOnly
              className={`w-full flex items-center gap-2 p-4 rounded-lg  bg-[#E8EBEB] border-none 
         border-opacityClr-50 text-opacityClr-100 outline-none focus:border focus:border-opacityClr-100 placeholder:text-opacityClr-30 placeholder:font-normal placeholder:font-Raleway transition-all duration-300 ease-in-out ${
           formData.organizationName ? "bg-[#E8EBEB] border-none" : ""
         }`}
            />
          </div>

          {/* accessType */}
          <div className="flex flex-col gap-2 items-start w-full">
            <label htmlFor="accessType" className="text-base font-Raleway font-semibold leading-[150%] text-opacityClr-100">
              Access Type
            </label>

            <input
              type="text"
              id="accessType"
              name="accessType"
              value={formData.accessType}
              onChange={handleChange}
              placeholder="eg. Frank"
              readOnly
              className={`w-full flex items-center gap-2 p-4 rounded-lg bg-[#E8EBEB] border-none
         border-opacityClr-50 text-opacityClr-100 outline-none focus:border focus:border-opacityClr-100 placeholder:text-opacityClr-30 placeholder:font-normal placeholder:font-Raleway transition-all duration-300 ease-in-out ${
           formData.accessType ? "bg-[#E8EBEB] border-none" : ""
         }`}
            />
          </div>

          {/* dateAndTime */}
          <div className="flex flex-col gap-2 items-start w-full">
            <label
              htmlFor="dateAndTime"
              className="text-base font-Raleway font-semibold leading-[150%] text-opacityClr-100 flex items-center justify-center"
            >
              Date, time, and number format{" "}
              <Tooltip text="This is for verification purposes! ">
                <span className="ml-2 flex items-center justify-center bg-opacityClr-10 px-2 py-1 rounded-full">
                  <HiOutlineInformationCircle className="cursor-pointer text-gray-500" size={18} />
                  Why?
                </span>
              </Tooltip>
            </label>
            <select
              id="dateAndTime"
              name="dateAndTime"
              value={formData.dateAndTime}
              onChange={handleChange}
              className="w-full p-4 rounded-lg bg-[#E8EBEB] border-none text-opacityClr-100 outline-none focus:border focus:border-opacityClr-100"
            >
              <option value="24-hour">24-hour format</option>
              <option value="12-hour">12-hour format</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          {/* account number */}
          <div className="flex flex-col items-start">
            <h3 className="text-primary-10 text-base font-bold font-Raleway leading-normal">Account Overview</h3>
            <p className="text-opacityClr-80 text-base font-medium font-Raleway leading-normal">1 account created (default)</p>
            <Link
              href="/settings/account-sharing"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-neutral-lightGreen rounded-md text-primary-10 font-geist text-base font-semibold leading-[150%] mt-2"
            >
              Manage Accounts
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`border bg-opacityClr-100 text-white font-Raleway font-bold text-base py-4 rounded-lg transition-all duration-500 ease-in-out hover:border hover:border-opacityClr-100 hover:bg-transparent hover:text-opacityClr-100 ${
            isLoading ? "bg-opacityClr-80 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="spinner"></span>
              <span className="text-opacityClr-10">Submitting...</span>
            </div>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
};

export default PersonalInformation;
