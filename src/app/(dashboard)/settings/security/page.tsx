"use client";
import React from "react";

import { useDrawerModal } from "@/context/DrawerModalContext";
import ResetPasswordDrawer from "@/components/views/ResetPasswordDrawer";
import TwoFactorAuthDrawer from "@/components/views/TwoFactorAuthDrawer";
import LoginHistoryDrawer from "@/components/views/LoginHistoryDrawer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import useAdminProfileAPI from "@/services/useAdminProfileAPI";

const Security = () => {
  const { openModal } = useDrawerModal();
  const { profile, isLoadingProfile } = useAdminProfileAPI({ enableProfile: true });

  return (
    <div className="flex flex-col gap-6 px-6 w-full">
      <Breadcrumb items={[{ label: "Settings", href: "/settings" }, { label: "Security" }]} />

      <div className="flex flex-col gap-6 pb-10 w-full">
        <div className="flex flex-col gap-2 items-start w-full">
          <label htmlFor="email" className="text-base font-Raleway font-semibold leading-[150%] text-opacityClr-100">
            Email Address
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={isLoadingProfile ? "Loading..." : profile?.email || ""}
            readOnly
            className="w-full flex items-center gap-2 p-4 rounded-lg bg-opacityClr-10 border-none text-opacityClr-100 outline-none"
          />
        </div>

        <div className="flex flex-col items-start">
          <h3 className="text-primary-10 text-base font-bold font-Raleway leading-normal">Password</h3>
          <p className="text-opacityClr-80 text-base font-medium font-Raleway leading-normal">
            Change your password by clicking the button below
          </p>
          <button
            type="button"
            onClick={() => openModal("Change Password", <ResetPasswordDrawer />)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-neutral-lightGreen rounded-md text-primary-10 font-geist text-base font-semibold leading-[150%] mt-2 cursor-pointer"
          >
            Change Password
          </button>
        </div>

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

        <div className="flex flex-col items-start">
          <h3 className="text-primary-10 text-base font-bold font-Raleway leading-normal">Login history</h3>
          <p className="text-opacityClr-80 text-base font-medium font-Raleway leading-normal">
            Inspect history of login activity in your account from the last year.
          </p>
          <button
            type="button"
            onClick={() => openModal("Account login history", <LoginHistoryDrawer />)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-neutral-lightGreen rounded-md text-primary-10 font-geist text-base font-semibold leading-[150%] mt-2 cursor-pointer"
          >
            View login history
          </button>
        </div>
      </div>
    </div>
  );
};

export default Security;
