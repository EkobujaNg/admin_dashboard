"use client";
import React from "react";

import { useDrawerModal } from "@/context/DrawerModalContext";
import ResetPasswordDrawer from "@/components/views/ResetPasswordDrawer";
import TwoFactorAuthDrawer from "@/components/views/TwoFactorAuthDrawer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import LogoutAction from "@/components/global/LogoutAction";

const Security = () => {
  const { openModal } = useDrawerModal();
  return (
    <div className="flex flex-col gap-6 px-6 w-full">
      <Breadcrumb items={[{ label: "Settings", href: "/settings" }, { label: "Security" }]} />

      <div className="flex flex-col gap-6  pb-10 w-full" {...({ autoComplete: "off" } as any)}>
        {/* email address */}
        <div className="flex flex-col gap-2 items-start w-full">
          <label htmlFor="organizationName" className="text-base font-Raleway font-semibold leading-[150%] text-opacityClr-100">
            Email Address
          </label>

          <input
            type="text"
            id="organizationName"
            name="organizationName"
            placeholder="admin@ekobuja.com"
            readOnly
            className="w-full flex items-center gap-2 p-4 rounded-lg  bg-opacityClr-10 border-none 
         border-opacityClr-50 text-opacityClr-100 outline-none focus:border focus:border-opacityClr-100 placeholder:text-opacityClr-30 placeholder:font-normal placeholder:font-Raleway transition-all duration-300 ease-in-out"
          />
        </div>

        {/* password */}
        <div className="flex flex-col items-start">
          <h3 className="text-primary-10 text-base font-bold font-Raleway leading-normal">Password</h3>
          <p className="text-opacityClr-80 text-base font-medium font-Raleway leading-normal">
            Reset your password by clicking button below
          </p>
          <button
            type="button"
            onClick={() => openModal("Reset Password", <ResetPasswordDrawer />)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-neutral-lightGreen rounded-md text-primary-10 font-geist text-base font-semibold leading-[150%] mt-2 cursor-pointer"
          >
            Reset Password
          </button>
        </div>

        {/* 2FA */}
        <div className="flex flex-col items-start">
          <h3 className="text-primary-10 text-base font-bold font-Raleway leading-normal">Two-factor authentication (2FA)</h3>
          <p className="text-opacityClr-80 text-base font-medium font-Raleway leading-normal">Set 2FA for this account.</p>
          <button
            type="button"
            onClick={() => openModal("Two Factor Authentication", <TwoFactorAuthDrawer />)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-neutral-lightGreen rounded-md text-primary-10 font-geist text-base font-semibold leading-[150%] mt-2 cursor-pointer"
          >
            Set 2FA
          </button>
        </div>

        {/* Session Reset */}
        <div className="flex flex-col gap-2 items-start w-full">
          <label htmlFor="organizationName" className="text-base font-Raleway font-semibold leading-[150%] text-[#171717]">
            Session Reset
          </label>

          <LogoutAction
            variant="session-reset"
            message="This will log you out of all devices and sessions, including this active one. Are you sure?"
          />

          <small className="text-base text-opacityClr-100 font-medium font-Raleway leading-[150%]">
            This will log you out of all devices and sessions, including this active one.
          </small>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="border bg-opacityClr-100 text-white font-Raleway font-bold text-base py-4 rounded-lg transition-all duration-500 ease-in-out hover:border hover:border-opacityClr-100 hover:bg-transparent hover:text-opacityClr-100 "
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Security;
