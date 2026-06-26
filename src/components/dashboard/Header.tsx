// HEADER CODE
"use client";
import React, { useState, useEffect, memo } from "react";
import { Bell, Menu } from "lucide-react";
import Drawer from "../ui/Drawer";
import { useDrawerModal } from "@/context/DrawerModalContext";

const Header = memo(({ toggleSidebar }: { toggleSidebar: any }) => {
  const { openModal } = useDrawerModal();
  const [time, setTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const [mounted, setMounted] = useState(false);

  // Prevent Hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Africa/Lagos",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      const formatter = new Intl.DateTimeFormat("en-NG", options);
      setTime(formatter.format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) setGreeting("Good morning ");
    else if (currentHour >= 12 && currentHour < 17) setGreeting("Good afternoon ");
    else if (currentHour >= 17 && currentHour < 21) setGreeting("Good evening ");
    else setGreeting("Good night ");
  }, []);

  return (
    <>
      {/* Responsive Left Position: left-0 on mobile, left-[256px] on desktop
       */}
      <header className="fixed top-0 left-0 md:left-[256px] right-0 flex p-4 md:p-6 items-center justify-between border-b border-[#D2D7D7] bg-white z-40 transition-all duration-300">
        <div className="flex items-center gap-3">
          {/* Mobile Toggle Button */}
          <button onClick={toggleSidebar} className="block md:hidden text-gray-600 focus:outline-none">
            <Menu className="w-6 h-6" />
          </button>

          <div className="">
            {/* Greeting Message */}
            <h1 className="text-base md:text-lg font-semibold text-gray-800">{mounted ? greeting : "Hello "}, Admin</h1>
            <p className="hidden sm:block text-primary-10 text-xs md:text-xs font-semibold font-geist">{mounted ? time : "Loading..."}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer" onClick={() => openModal("Notifications Main", <p>Notification drawer...</p>)}>
            <Bell className="w-5 h-5 md:w-6 md:h-6 text-gray-600 hover:text-black" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full"></span>
          </div>
        </div>
      </header>

      <Drawer />
    </>
  );
});

Header.displayName = "Header";

export default Header;
