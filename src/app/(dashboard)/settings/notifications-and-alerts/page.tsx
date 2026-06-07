"use client";
import React, { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";

const notifications = [
  {
    category: "Account",
    options: [
      {
        id: 1,
        title: "Bank Activity",
        description:
          "We will notify you about deposits, withdrawals, orders and dividends.",
      },
    ],
  },
  {
    category: "My Holdings",
    options: [
      {
        id: 2,
        title: "Price Movements",
        description:
          "We will notify you about price movements for the stocks you own.",
      },
      {
        id: 3,
        title: "Breaking News",
        comingSoon: true,
        description:
          "We will send you breaking and general market news about the stocks you own. We promise not to spam you.",
      },
    ],
  },
  {
    category: "My Watchlist",
    options: [
      {
        id: 4,
        title: "Price Movements",
        description:
          "We will notify you about price movements for the stocks you own.",
      },
      {
        id: 5,
        title: "Breaking News",
        comingSoon: true,
        description:
          "We will send you breaking and general market news about the stocks you own. We promise not to spam you.",
      },
    ],
  },
];

const NotificationsAndAlerts = () => {
  const [toggleStates, setToggleStates] = useState(
    notifications
      .flatMap((n) => n.options)
      .reduce((acc, item) => {
        acc[item.id] = true;
        return acc;
      }, {})
  );

  // Toggle Handler
  const handleToggle = (id) => {
    setToggleStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex flex-col gap-8 items-start w-full">
      <Breadcrumb items={[{ label: "Settings", href: "/settings" }, { label: "Notifications and Alerts" }]} />
      {notifications.map((section) => (
        <div
          key={section.category}
          className="flex flex-col gap-4 items-start w-full"
        >
          <h2 className="font-Raleway font-semibold text-opacityClr-100 text-base leading-normal border-b border-[#BBC3C3] pb-3 w-full">
            {section.category}
          </h2>

          {section.options.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-8 py-4 border-b border-[#BBC3C3] w-full"
            >
              <div className="flex flex-col gap-2 items-start justify-center">
                <div className="flex items-center gap-2">
                  <p className="font-Raleway font-semibold text-opacityClr-100 text-sm leading-normal">
                    {item.title}
                  </p>
                  {item.comingSoon && (
                    <span className="flex items-center justify-center gap-2 px-2 py-1 rounded bg-neutral-lightGreen font-Raleway font-bold text-opacityClr-100 text-[8px] leading-[150%] tracking-[0.08px]">
                      COMING SOON
                    </span>
                  )}
                </div>
                
                <p className="font-Raleway font-normal text-opacityClr-100 text-sm leading-normal">
                  {item.description}
                </p>
              </div>

              {/* Custom Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={toggleStates[item.id]}
                  onChange={() => handleToggle(item.id)}
                />
                <div
                  className={`w-10 h-5 bg-[#D2D7D7] rounded-full peer-checked:bg-[#325E62] relative transition-all duration-300`}
                >
                  <div
                    className={`absolute top-[3px] left-1 w-3.5 h-3.5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                      toggleStates[item.id] ? "translate-x-5" : ""
                    }`}
                  ></div>
                </div>
              </label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default NotificationsAndAlerts;
