"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CustomCheckBox from "@/components/ui/CustomCheckBox";
import { useDrawerModal } from "@/context/DrawerModalContext";
import LoginHistoryDrawer from "@/components/views/LoginHistoryDrawer";
import Breadcrumb from "@/components/ui/Breadcrumb";

const LogInDetails = () => {
  const { openModal } = useDrawerModal();
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  return (
    <div className="flex flex-col gap-6 px-6 w-full">
      <Breadcrumb items={[{ label: "Settings", href: "/settings" }, { label: "Log In Details" }]} />
      {/* header */}
      <div className="flex flex-col gap-6 items-start border-b border-[#E8EBEB] pb-4">
        <p className="text-primary-10 text-sm font-medium font-Raleway leading-normal">
          These settings will be applied to the entire account. To manage your personal security settings, go to 
          <Link href="/" className="underline">
            security preferences.
          </Link>
        </p>
      </div>

      {/* login */}
      <div className="flex flex-col gap-6 items-start border-b border-[#E8EBEB] pb-4">
        <h3 className="text-primary-10 text-xl font-bold font-Raleway leading-normal">Login</h3>

        <div className="flex gap-3 items-center w-full">
          <CustomCheckBox checked={isChecked} onChange={setIsChecked} />

          <div className="flex flex-col items-start w-full">
            <h3 className="text-primary-10 text-lg font-bold font-Raleway leading-normal">Require Two-Factor Authentication (2FA)</h3>
            <p className="text-opacityClr-80 text-sm font-medium font-Raleway leading-normal">
              When this is selected all users are required to use 2FA to log in.
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-center w-full">
          <CustomCheckBox checked={isChecked2} onChange={setIsChecked2} />

          <div className="flex flex-col items-start w-full">
            <h3 className="text-primary-10 text-lg font-bold font-Raleway leading-normal">Allow user to join from an invite link</h3>
            <p className="text-opacityClr-80 text-sm font-medium font-Raleway leading-normal">Allow users to join from an invite link</p>
          </div>
        </div>
      </div>

      {/* activity */}
      <div className="flex flex-col gap-8 items-start">
        <h3 className="text-primary-10 text-xl font-bold font-Raleway leading-normal">Activity Logs</h3>

        <div className="flex flex-col items-start w-full">
          <button
            type="button"
            onClick={() => openModal("Account login history", <LoginHistoryDrawer />)}
            className="text-primary-10 text-lg font-bold font-Raleway leading-normal outline-none underline cursor-pointer"
          >
            View account login history
          </button>
          <p className="text-opacityClr-80 text-sm font-medium font-Raleway leading-normal">
            Inspect history of login activity in your account from the last year.
          </p>
        </div>

        <div className="flex flex-col items-start w-full">
          <button
            type="button"
            onClick={() => openModal("Account login history", <p>Account login history drawer...</p>)}
            className="text-primary-10 text-lg font-bold font-Raleway leading-normal outline-none underline cursor-pointer"
          >
            View security activity history
          </button>
          <p className="text-opacityClr-80 text-sm font-medium font-Raleway leading-normal">
            Review insights into notable security actions taken in your account in the last year.
          </p>
        </div>
      </div>

      {/* Save Button */}
      <button
        type="submit"
        className="border bg-opacityClr-100 text-white font-Raleway font-bold text-base py-4 rounded-lg transition-all duration-500 ease-in-out hover:border hover:border-opacityClr-100 hover:bg-transparent hover:text-opacityClr-100 "
      >
        Save Changes
      </button>
    </div>
  );
};

export default LogInDetails;
