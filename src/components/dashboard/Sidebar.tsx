"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "../../../public/assets/images/logo-main.svg";
import LogoutAction from "@/components/global/LogoutAction";
import {
  X,
  LayoutDashboard,
  Users,
  Building2,
  Banknote,
  Briefcase,
  ChartColumn,
  ClipboardList,
  ArrowDownToLine,
  Settings,
  PieChart,
  RefreshCcw,
  type LucideIcon,
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: any; setIsOpen: any }) {
  const pathname = usePathname();

  const links: Array<{ href: string; label: string; icon: LucideIcon }> = [
    { href: "/overview", label: "Overview", icon: LayoutDashboard },
    { href: "/accounts", label: "Accounts", icon: Users },
    { href: "/properties", label: "Properties", icon: Building2 },
    { href: "/earnings", label: "Earnings", icon: Banknote },
    { href: "/profit-sharing", label: "Profit Sharing", icon: PieChart },
    { href: "/investments", label: "Investments", icon: Briefcase },
    { href: "/analytics-metrics", label: "Reports Analytics", icon: ChartColumn },
    { href: "/facility-admin", label: "FM Manager", icon: ClipboardList },
    { href: "/withdrawals", label: "Withdrawals", icon: ArrowDownToLine },
    { href: "/buyback", label: "Buyback", icon: RefreshCcw },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const iconClass = (isActive: boolean) =>
    `w-[18px] h-[18px] transition-colors duration-300 ${
      isActive ? "text-primary-20" : "text-opacityClr-40 group-hover:text-primary-20"
    }`;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 w-[256px] h-full bg-white text-white flex flex-col justify-between px-4 border-r border-[#D2D7D7] z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col items-center gap-14 pt-8">
          <div className="px-4 self-start w-full flex justify-between items-center">
            <Link href="/" className="text-white flex items-center space-x-2">
              <Image src={Logo} alt="EkoBuja Logo" />
            </Link>
            <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <ul className="flex flex-col gap-3 items-start w-full border-b border-dashed border-[#D2D7D7] pb-2 overflow-y-auto max-h-[60vh]">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;

              return (
                <li key={link.href} className="w-full">
                  <Link
                    href={link.href}
                    onClick={handleLinkClick}
                    className={`group flex items-center gap-4 px-4 py-3 w-full font-Raleway transition-all duration-300 ease-in-out ${
                      isActive
                        ? "bg-[#EFF1F1] text-primary-20 rounded-[100px]"
                        : "hover:bg-[#EFF1F1] hover:text-primary-20 hover:rounded-[100px]"
                    }`}
                  >
                    <Icon className={iconClass(isActive)} strokeWidth={isActive ? 2.25 : 1.75} />
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

        <div className="mb-14 w-full">
          <ul className="flex flex-col gap-3 items-start w-full">
            <li className="w-full">
              <Link
                href="/settings"
                onClick={handleLinkClick}
                className={`group flex items-center space-x-4 px-4 py-2 ${
                  pathname === "/settings"
                    ? "bg-[#EFF1F1] text-primary-20 rounded-[100px]"
                    : "hover:bg-[#EFF1F1] hover:text-primary-20 hover:rounded-[100px]"
                }`}
              >
                <Settings
                  className={iconClass(pathname === "/settings")}
                  strokeWidth={pathname === "/settings" ? 2.25 : 1.75}
                />
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
              <LogoutAction variant="sidebar" />
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
