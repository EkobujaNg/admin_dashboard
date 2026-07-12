"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import {
  ArrowUpRight,
  Building2,
  Users,
  Briefcase,
  Wallet,
  ArrowDownToLine,
  RefreshCcw,
  FileText,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import { useDrawerModal } from "@/context/DrawerModalContext";
import PropertyCard from "@/components/views/PropertyCard";
import AddPropertyCardDrawer from "@/components/views/AddPropertyCardDrawer";
import { usePropertyAPI } from "@/services/usePropertyAPI";
import useDashboardAPI from "@/services/useDashboardAPI";
import { emptyAssets } from "../../../../public/assets/images";
import type { AuthUser } from "@/lib/auth/types";
import type { ActionNeededItem } from "@/lib/dashboard/types";
import {
  formatDashboardMoney,
  getActionNeededItems,
  pluralizeLabel,
} from "@/lib/dashboard/mappers";

const InvestmentRevenueChart = dynamic(() => import("@/components/views/InvestmentRevenueChart"), {
  ssr: false,
  loading: () => <div className="h-[420px] w-full rounded-2xl bg-opacityClr-20 animate-pulse" />,
});

const ACTION_ICONS: Record<ActionNeededItem["key"], LucideIcon> = {
  payoutRequests: ArrowDownToLine,
  buybackRequests: RefreshCcw,
  utilityBillApprovals: FileText,
  propertyTasksPending: ClipboardList,
  newPropertyTasks: ClipboardList,
};

function displayNameFromUser(user: AuthUser | null | undefined) {
  if (!user) return "Admin";
  if (user.fullName?.trim()) return user.fullName.trim();
  const local = user.email?.split("@")[0]?.trim();
  return local || "Admin";
}

const Overview = () => {
  const { openModal } = useDrawerModal();
  const user = useSelector((state: { auth: { user: AuthUser | null } }) => state.auth.user);
  const displayName = displayNameFromUser(user);

  const { dashboard, isLoadingDashboard } = useDashboardAPI({ enableDashboard: true });
  const { properties, isLoadingProperties } = usePropertyAPI({
    enableProperties: true,
    page: 1,
    limit: 6,
  });

  const featuredProperties = useMemo(() => {
    return (properties?.pageItems || []).slice(0, 6);
  }, [properties]);

  const stats = dashboard?.stats;
  const actionItems = useMemo(
    () => (dashboard ? getActionNeededItems(dashboard.actionsNeeded) : []),
    [dashboard]
  );
  const totalActions = useMemo(
    () => actionItems.reduce((sum, item) => sum + item.count, 0),
    [actionItems]
  );

  return (
    <section className="flex flex-col gap-6 ">
      <div className="flex flex-col gap-1 items-start">
        <h2 className="text-primary-10 font-Raleway font-bold text-[28px]">
          Hello <span className="text-primary-20">{displayName}</span>
        </h2>
        <p className="text-primary-10 font-Raleway text-sm">Welcome to EkoBuja Admin Dashboard.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <div
          className="w-full h-[195px] rounded-lg flex flex-col bg-cover bg-center bg-no-repeat bg-primary-10 "
          style={{ backgroundImage: "url('/assets/images/walletPattern.png')" }}
        >
          <div className="flex flex-col gap-4 px-6 py-4">
            <span className="w-12 h-12 flex p-2.5 items-center justify-center gap-2.5 rounded-[10px] bg-opacityClr-10">
              <Building2 className="w-6 h-6 text-primary-10" />
            </span>
            <div className="flex flex-col items-start">
              <p className="font-Raleway font-semibold text-base text-opacityClr-10">Total Properties</p>
              <h3 className="font-Raleway font-semibold text-[32px] text-opacityClr-10">
                {isLoadingDashboard ? "..." : stats?.properties ?? 0}
              </h3>
            </div>
          </div>
          <div className="py-2 px-6 rounded-b-lg bg-[#DBE5E5]">
            <Link href="/properties" className="font-Raleway font-semibold text-sm text-primary-10 underline">
              View listed properties
            </Link>
          </div>
        </div>

        <div className="w-full rounded-lg flex flex-col bg-[#EFF1F1] ">
          <div className="flex flex-col gap-4 px-6 py-4">
            <span className="w-12 h-12 flex p-2.5 items-center justify-center gap-2.5 rounded-[10px] bg-[#E1E7E7]">
              <Users className="w-6 h-6 text-primary-10" />
            </span>
            <div className="flex flex-col items-start">
              <p className="font-Raleway font-semibold text-base text-primary-10">Active Users</p>
              <h3 className="font-Raleway font-semibold text-[32px] text-primary-10">
                {isLoadingDashboard ? "..." : stats?.activeUsers ?? 0}
              </h3>
            </div>
          </div>
          <div className="py-2 px-6 rounded-b-lg bg-[#E1E7E7]">
            <Link href="/accounts" className="font-Raleway font-semibold text-sm text-primary-10 underline">
              View accounts
            </Link>
          </div>
        </div>

        <div className="w-full rounded-lg flex flex-col bg-[#EFF1F1] ">
          <div className="flex flex-col gap-4 px-6 py-4">
            <span className="w-12 h-12 flex p-2.5 items-center justify-center gap-2.5 rounded-[10px] bg-[#E1E7E7]">
              <Briefcase className="w-6 h-6 text-primary-10" />
            </span>
            <div className="flex flex-col items-start min-w-0">
              <p className="font-Raleway font-semibold text-base text-primary-10">Total Commission</p>
              <h3 className="font-Raleway font-semibold text-[28px] md:text-[32px] text-primary-10 truncate w-full">
                {isLoadingDashboard ? "..." : formatDashboardMoney(stats?.totalCommission ?? 0)}
              </h3>
            </div>
          </div>
          <div className="py-2 px-6 rounded-b-lg bg-[#E1E7E7]">
            <Link href="/earnings" className="font-Raleway font-semibold text-sm text-primary-10 underline">
              View earnings
            </Link>
          </div>
        </div>

        <div className="w-full rounded-lg flex flex-col bg-[#EFF1F1] ">
          <div className="flex flex-col gap-4 px-6 py-4">
            <span className="w-12 h-12 flex p-2.5 items-center justify-center gap-2.5 rounded-[10px] bg-[#E1E7E7]">
              <Wallet className="w-6 h-6 text-primary-10" />
            </span>
            <div className="flex flex-col items-start min-w-0">
              <p className="font-Raleway font-semibold text-base text-primary-10">App Wallet Balance</p>
              <h3 className="font-Raleway font-semibold text-[28px] md:text-[32px] text-primary-10 truncate w-full">
                {isLoadingDashboard ? "..." : formatDashboardMoney(stats?.appWalletBalance ?? 0)}
              </h3>
            </div>
          </div>
          <div className="py-2 px-6 rounded-b-lg bg-[#E1E7E7]">
            <p className="font-Raleway font-semibold text-sm text-primary-10">Platform wallet</p>
          </div>
        </div>
      </div>

      {isLoadingDashboard ? (
        <div className="w-full h-[140px] rounded-2xl bg-opacityClr-20 animate-pulse" />
      ) : totalActions > 0 ? (
        <div className="flex flex-col gap-4 py-4 px-6 w-full rounded-2xl bg-primary-10">
          <div className="flex gap-4 items-center">
            <span className="w-12 h-12 flex p-2.5 items-center justify-center rounded-[10px] bg-opacityClr-10 shrink-0">
              <ClipboardList className="w-6 h-6 text-primary-10" />
            </span>
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-opacityClr-10 text-sm font-Raleway leading-normal">
                <span className="font-bold">
                  {totalActions} action{totalActions === 1 ? "" : "s"} needed
                </span>
              </p>
              <p className="text-opacityClr-10 text-xs font-Raleway font-normal leading-normal">
                Open an item below to review it where action is needed.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {actionItems.map((item) => {
              const Icon = ACTION_ICONS[item.key];
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className="flex items-center justify-between gap-3 rounded-xl bg-opacityClr-10 px-4 py-3 transition hover:bg-white"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shrink-0">
                      <Icon className="w-4 h-4 text-primary-10" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-primary-10 text-sm font-Raleway font-bold truncate">
                        {item.count} {pluralizeLabel(item.count, item.label)}
                      </p>
                      <p className="text-primary-10/70 text-xs font-Raleway truncate">Review now</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-primary-10 shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-6 items-start mt-6 w-full">
        <h2 className="text-primary-10 font-Raleway font-bold text-lg">
          Statistics & <span className="text-primary-20"> Revenue Metrics </span>
        </h2>
        <InvestmentRevenueChart income={dashboard?.charts.income} isLoading={isLoadingDashboard} />
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between w-full gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-Raleway font-bold text-primary-10">
              Listing <span className="text-primary-20">Board</span>
            </h2>
            <span className="flex justify-center items-center gap-2.5 px-2 py-1 rounded bg-neutral-lightGreen font-Raleway font-bold text-[10px] text-primary-10 leading-[150%] uppercase">
              Newly Added
            </span>
          </div>

          <Link href="/properties">
            <button className="flex items-center justify-center gap-3 w-fit px-5 py-3 bg-primary-10 rounded-[100px] border border-transparent transition hover:bg-transparent hover:border-primary-10 group">
              <span className="text-white font-Raleway font-semibold text-base group-hover:text-primary-10">
                Explore all listings
              </span>
            </button>
          </Link>
        </div>
        {isLoadingProperties ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-[500px] w-full" />
            ))}
          </div>
        ) : featuredProperties.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.propertyId} property={property} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 mt-10 w-full">
            <Image src={emptyAssets} alt="empty assets" width={220} height={175} />
            <p className="text-center text-base text-[#A5AFAF] font-Raleway font-normal leading-normal">
              You don't have any property listed at the moment, start investing now!
            </p>
            <button
              type="button"
              onClick={() => openModal("Create Property Listing", <AddPropertyCardDrawer />)}
              className="flex py-3 px-5 items-center justify-center gap-2 rounded-md border border-opacityClr-100 bg-transparent cursor-pointer w-fit"
            >
              <span className="font-Geist font-semibold text-base text-primary-10 leading-[150%] tracking-[-0.16px] group-hover:text-primary-10">
                Add Property
              </span>
              <ArrowUpRight className="text-primary-10 text-base group-hover:text-primary-10 w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Overview;
