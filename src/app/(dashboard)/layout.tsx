// LAYOUT CODE
"use client"; // Needed for useState
import React, { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

const DashboardLayout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-auto w-full bg-gray-50">
      {/* Pass state and setter to Sidebar */}
      <Sidebar isOpen={isMobileSidebarOpen} setIsOpen={setIsMobileSidebarOpen} />

      {/* Adjust margin: ml-0 on mobile, ml-64 on desktop (md) 
          Added transition-all for smooth resizing
      */}
      <div className="flex flex-col flex-1 ml-0 md:ml-64 transition-all duration-300">
        {/* Pass toggle function to Header */}
        <Header toggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

        {/* Adjust padding for mobile */}
        <main className="p-4 md:p-6 mt-16 md:mt-24">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
