"use client";

import React from "react";
import Image from "next/image";
import { avatar } from "../../../../public/assets/images";
import { useRouter, usePathname } from "next/navigation";
import { ChevronRight, FileText, Lock, Bell, SlidersHorizontal } from "lucide-react";
import useAdminProfileAPI from "@/services/useAdminProfileAPI";
import { getAdminProfileDisplayName } from "@/lib/admin-profile/mappers";
import { formatAdminRoles } from "@/lib/admins/types";

const settingsLinks = [
  {
    id: 1,
    name: "Account Information",
    icon: <FileText className="text-primary-20 w-5 h-5" />,
    path: "/settings/account-information",
  },
  {
    id: 2,
    name: "Security",
    icon: <Lock className="text-primary-20 w-5 h-5" />,
    path: "/settings/security",
  },
  {
    id: 3,
    name: "Platform Settings",
    icon: <SlidersHorizontal className="text-primary-20 w-5 h-5" />,
    path: "/settings/platform",
  },
  {
    id: 4,
    name: "Notifications & Alerts",
    icon: <Bell className="text-primary-20 w-5 h-5" />,
    path: "/settings/notifications-and-alerts",
  },
];

const SettingsLayout = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, isLoadingProfile } = useAdminProfileAPI({ enableProfile: true });

  const displayName = isLoadingProfile
    ? "Loading..."
    : getAdminProfileDisplayName(profile);
  const email = profile?.email || "—";
  const rolesLabel = formatAdminRoles(profile?.roles || []);

  return (
    <section className="flex flex-col items-start gap-4">
      <div className="flex flex-col gap-1 items-start">
        <h2 className="text-primary-10 font-Raleway font-bold leading-normal text-[28px]">My account</h2>
      </div>
      <div className="flex items-start gap-8 w-full">
        <div className="flex flex-col items-start gap-4 w-full h-full sticky top-30">
          <div className="flex items-center gap-4">
            <Image src={avatar} alt="User Avatar" width={56} height={56} className="rounded-full object-cover" />
            <div className="flex flex-col items-start min-w-0">
              <h3 className="text-primary-10 text-xl font-bold font-Raleway leading-normal truncate">
                {displayName}
              </h3>
              <p className="text-primary-10 text-sm font-medium font-Raleway leading-normal truncate">
                {email}
              </p>
              {rolesLabel !== "—" && (
                <p className="text-opacityClr-60 text-xs font-medium font-Raleway leading-normal mt-0.5">
                  {rolesLabel}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 w-full">
            {settingsLinks.map((link) => {
              return (
                <div
                  key={link.id}
                  onClick={() => router.push(link.path)}
                  className={`flex items-center justify-between gap-4 px-6 py-4 w-full rounded-[100px] transition-all duration-300 ease-linear cursor-pointer
                ${pathname === link.path ? "bg-[#F3F4F4]" : "bg-transparent hover:bg-[#F3F4F4]"}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-12 h-12 p-[10px] gap-[10px] rounded-lg bg-opacityClr-10">
                      {link.icon}
                    </span>
                    <p className="text-primary-10 text-base font-semibold font-Raleway leading-normal">{link.name}</p>
                  </div>

                  <ChevronRight className="text-primary-20 font-light w-5 h-5" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SettingsLayout;
