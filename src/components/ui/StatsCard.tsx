import React from "react";

const StatsCard = ({ title, count, bodyBg, footerBg, footerText, textColor, FTextColor }: { title?: any; count?: any; bodyBg?: any; footerBg?: any; footerText?: any; textColor?: any; FTextColor?: any }) => (
  <div className="w-full rounded-lg flex flex-col" style={{ backgroundColor: bodyBg }}>
    <div className="flex flex-col gap-2 px-6 py-4">
      <p className="font-Raleway font-semibold text-base" style={{ color: textColor }}>
        {title}
      </p>
      <h3 className="font-Raleway font-semibold text-[32px]" style={{ color: textColor }}>
        {count}
      </h3>
    </div>
    <div className="py-2 px-6 rounded-b-lg" style={{ backgroundColor: footerBg }}>
      <p className="font-Raleway font-semibold text-sm" style={{ color: FTextColor }}>
        {footerText}
      </p>
    </div>
  </div>
);

export default StatsCard;
