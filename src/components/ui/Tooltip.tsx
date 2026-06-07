"use client";

import React, { useState } from "react";

const Tooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-2 text-xs text-primary-10 bg-[#F3F4F4] rounded-lg shadow-lg">
          {text}
          <div className="absolute left-1/2 -translate-x-1/2 top-full border-8 border-transparent border-t-[#F3F4F4]"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
