// SIDEBAR CODE
"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/store/slices/authSlice";
import Logo from "../../../public/assets/images/logo-main.svg";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import {
  homeIcon,
  homeIconFilled,
  userIcon,
  userIconFilled,
  buildingIcon,
  buildingIconFilled,
  caseIcon,
  caseIconFilled,
  fileIcon,
  fileIconFilled,
  settingsIcon,
  settingsIconFilled,
  logoutIcon,
  logoutIconFilled,
  moneyIcon,
  moneyIconFilled,
  reportIcon,
  reportIconFilled,
} from "../../../public/assets/icons";
import nookies from "nookies";
import { FaTimes } from "react-icons/fa"; // Import Close Icon

// Receive isOpen and setIsOpen from Layout
export default function Sidebar({ isOpen, setIsOpen }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const links = [
    { href: "/overview", label: "Overview", normalIcon: homeIcon, filledIcon: homeIconFilled },
    { href: "/accounts", label: "Accounts", normalIcon: userIcon, filledIcon: userIconFilled },
    { href: "/properties", label: "Properties", normalIcon: buildingIcon, filledIcon: buildingIconFilled },
    { href: "/earnings", label: "Earnings", normalIcon: moneyIcon, filledIcon: moneyIconFilled },
    { href: "/investments", label: "Investments", normalIcon: caseIcon, filledIcon: caseIconFilled },
    { href: "/analytics-metrics", label: "Reports Analytics", normalIcon: reportIcon, filledIcon: reportIconFilled },
    { href: "/facility-admin", label: "FM Admins", normalIcon: fileIcon, filledIcon: fileIconFilled },
  ];

  const handleLogout = () => {
    dispatch(logout());
    nookies.destroy(null, "authToken", { path: "/" });
    setIsLogoutModalOpen(false);
    router.push("/login");
  };

  // Helper to close sidebar on mobile click
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* OVERLAY: Only visible on mobile when sidebar is open 
         Clicking this closes the menu
      */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* SIDEBAR CONTAINER 
         1. Fixed position
         2. Translate Logic: 
            - Mobile: translate-x-0 if Open, -translate-x-full if Closed
            - Desktop (md): Always translate-x-0
         3. z-50 to sit on top of Header on mobile
      */}
      <aside
        className={`fixed top-0 left-0 w-[256px] h-full bg-white text-white flex flex-col justify-between px-4 border-r border-[#D2D7D7] z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col items-center gap-14 pt-8">
          {/* Header of Sidebar: Logo + Close Button (Mobile) */}
          <div className="px-4 self-start w-full flex justify-between items-center">
            <Link href="/" className="text-white flex items-center space-x-2">
              <Image src={Logo} alt="EkoBuja Logo" />
            </Link>
            {/* Close button for mobile only */}
            <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500">
              <FaTimes size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <ul className="flex flex-col gap-3 items-start w-full border-b border-dashed border-[#D2D7D7] pb-2 overflow-y-auto max-h-[60vh]">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href} className="w-full">
                  <Link
                    href={link.href}
                    onClick={handleLinkClick} // Close sidebar on click
                    className={`group flex items-center gap-4 px-4 py-3 w-full font-Raleway transition-all duration-300 ease-in-out ${
                      isActive
                        ? "bg-[#EFF1F1] text-primary-20 rounded-[100px]"
                        : "hover:bg-[#EFF1F1] hover:text-primary-20 hover:rounded-[100px]"
                    }`}
                  >
                    {/* Icons Logic (Kept same as your original) */}
                    <span className="text-[15px] text-opacityClr-40 transition-all duration-500 ease-in-out">
                      {link.normalIcon ? (
                        <>
                          <Image
                            src={isActive ? link.filledIcon : link.normalIcon}
                            alt={link.label}
                            width={18}
                            height={18}
                            className="h-auto group-hover:hidden"
                          />
                          <Image src={link.filledIcon} alt={link.label} width={18} height={18} className="h-auto hidden group-hover:block" />
                        </>
                      ) : (
                        link.icon
                      )}
                    </span>
                    <span
                      className={`text-[15px] font-semibold leading-normal ${
                        isActive ? " text-primary-20" : "text-opacityClr-40"
                      } group-hover:text-primary-20`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Section */}
        <div className="mb-14 w-full">
          <ul className="flex flex-col gap-3 items-start w-full">
            <li className="w-full">
              <Link
                href="/settings"
                onClick={handleLinkClick}
                className={`flex items-center space-x-4 px-4 py-2 group ${
                  pathname === "/settings"
                    ? "bg-[#EFF1F1] text-primary-20 rounded-[100px]"
                    : "hover:bg-[#EFF1F1] hover:text-primary-20 hover:rounded-[100px]"
                }`}
              >
                {/* Settings Icons Logic */}
                <span className="text-[15px] text-opacityClr-40 transition-all duration-300 ease-in-out">
                  <Image
                    src={pathname === "/settings" ? settingsIconFilled : settingsIcon}
                    alt="Settings"
                    width={18}
                    height={18}
                    className="h-auto group-hover:hidden"
                  />
                  <Image src={settingsIconFilled} alt="Settings" width={18} height={18} className="h-auto hidden group-hover:block" />
                </span>
                <span
                  className={`text-[15px] font-Raleway font-semibold leading-normal group-hover:text-primary-20 ${
                    pathname === "/settings" ? " text-primary-20" : "text-opacityClr-40"
                  }`}
                >
                  Settings
                </span>
              </Link>
            </li>

            <li className="w-full">
              <button
                className="flex items-center space-x-4 px-4 py-2 group w-full hover:bg-[#EFF1F1] hover:text-primary-20 hover:rounded-[100px] cursor-pointer"
                onClick={() => setIsLogoutModalOpen(true)}
              >
                {/* Logout Icons Logic */}
                <span className="text-[15px]">
                  <Image src={logoutIcon} alt="Logout" width={18} height={18} className="h-auto group-hover:hidden" />
                  <Image src={logoutIconFilled} alt="Logout" width={18} height={18} className="h-auto hidden group-hover:block" />
                </span>
                <span className="text-[15px] text-opacityClr-40 font-Raleway font-semibold leading-normal group-hover:text-primary-20">
                  Log Out
                </span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        message="Are you sure you want to log out?"
        confirmMsg="Yes, Log Me Out"
        cancelMsg="No, Cancel Request"
      />
    </>
  );
}
