// HEADER CODE
"use client";
import React, { useState, useEffect, memo, useMemo } from "react";
import { Bell, Menu } from "lucide-react";
import { useSelector } from "react-redux";
import Drawer from "../ui/Drawer";
import { useDrawerModal } from "@/context/DrawerModalContext";
import type { AuthUser } from "@/lib/auth/types";
import { formatAdminRole } from "@/lib/admins/types";
import useAdminProfileAPI from "@/services/useAdminProfileAPI";
import useNotificationsAPI from "@/services/useNotificationsAPI";
import NotificationDrawer from "@/components/views/NotificationDrawer";

function displayNameFromUser(user: AuthUser | null | undefined) {
  if (!user) return "Admin";
  if (user.fullName?.trim()) return user.fullName.trim();
  const local = user.email?.split("@")[0]?.trim();
  if (local) return local;
  return "Admin";
}

function roleLabelFromUser(user: AuthUser | null | undefined) {
  const primary = user?.roles?.[0] || user?.role;
  if (!primary) return null;
  return formatAdminRole(primary);
}

const Header = memo(({ toggleSidebar }: { toggleSidebar: any }) => {
  const { openModal } = useDrawerModal();
  const user = useSelector((state: { auth: { user: AuthUser | null } }) => state.auth.user);
  useAdminProfileAPI({ enableProfile: true });
  const { unreadCount } = useNotificationsAPI({ enableUnreadCount: true });
  const [greeting, setGreeting] = useState("Hello");
  const [mounted, setMounted] = useState(false);

  const displayName = useMemo(() => displayNameFromUser(user), [user]);
  const roleLabel = useMemo(() => roleLabelFromUser(user), [user]);

  // Prevent Hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) setGreeting("Good morning");
    else if (currentHour >= 12 && currentHour < 17) setGreeting("Good afternoon");
    else if (currentHour >= 17 && currentHour < 21) setGreeting("Good evening");
    else setGreeting("Good night");
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 md:left-[256px] right-0 flex p-4 md:p-6 items-center justify-between border-b border-[#D2D7D7] bg-white z-40 transition-all duration-300">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={toggleSidebar} className="block md:hidden text-gray-600 focus:outline-none shrink-0">
            <Menu className="w-6 h-6" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base md:text-lg font-semibold text-gray-800 truncate">
              {mounted ? greeting : "Hello"}, {mounted ? displayName : "Admin"}
            </h1>
            {(user?.email || roleLabel) && (
              <p className="hidden sm:block text-primary-10 text-xs font-semibold font-geist truncate">
                {user?.email}
                {user?.email && roleLabel ? " · " : ""}
                {roleLabel}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div
            className="relative cursor-pointer"
            onClick={() => openModal("Notifications Main", <NotificationDrawer />)}
          >
            <Bell className="w-5 h-5 md:w-6 md:h-6 text-gray-600 hover:text-black" />
            {mounted && unreadCount > 0 ? (
              <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full" />
            ) : null}
          </div>
        </div>
      </header>

      <Drawer />
    </>
  );
});

Header.displayName = "Header";

export default Header;
