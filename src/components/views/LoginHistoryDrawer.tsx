"use client";
import React, { useState } from "react";
import { Laptop, MinusCircle, Smartphone } from "lucide-react";

const LoginHistoryDrawer = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-6 p-6 relative h-full">
      <p className="font-Raleway font-normal text-opacityClr-100 text-base leading-[150%]">
        Get a report showing when users logged in to your account.
      </p>

      <div className="flex flex-col gap-6 w-full overflow-y-auto pb-24">
        <div className="flex flex-col items-start gap-4 border-t border-[#E8EBEB] py-4 w-full">
          <div className="flex items-center justify-between w-full">
            <span className="flex p-2.5 items-center justify-center gap-2.5 border border-opacityClr-10 rounded">
              <Laptop className="w-8 h-8" />
            </span>

            <div className="flex flex-col items-end gap-2">
              <p className="font-Raleway font-semibold text-base text-primary-10 leading-normal ">Current session</p>
              <div className="flex items-center justify-center gap-2">
                <button type="button" className="outline-none bg-transparent">
                  <MinusCircle className="w-5 h-5" />
                </button>
                <span className="font-Raleway font-medium text-sm text-opacityClr-40 leading-normal">Remove device</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="font-Raleway font-medium text-sm text-opacityClr-40 leading-normal">
              Lagos, Nigeria Feb 02, 2024 at 11:44am
            </span>
            <p className="font-Raleway font-semibold text-base text-primary-10 leading-normal ">Windows 10 Chrome</p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="font-Raleway font-medium text-sm text-opacityClr-40 leading-normal">Login succeeded </span>
            <p className="font-Raleway font-semibold text-base text-primary-10 leading-normal ">Yes</p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="font-Raleway font-medium text-sm text-opacityClr-40 leading-normal">IP address</span>
            <p className="font-Raleway font-semibold text-base text-primary-10 leading-normal ">105.235.194.62</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 border-t  border-[#E8EBEB] py-4 w-full">
          <div className="flex items-center justify-between w-full">
            <span className="flex p-2.5 items-center justify-center gap-2.5 border border-opacityClr-10 rounded">
              <Smartphone className="w-8 h-8" />
            </span>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center justify-center gap-2">
                <button type="button" className="outline-none bg-transparent cursor-pointer">
                  <MinusCircle className="w-5 h-5" />
                </button>
                <span className="font-Raleway font-medium text-sm text-opacityClr-40 leading-normal">Remove device</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="font-Raleway font-medium text-sm text-opacityClr-40 leading-normal">
              Lagos, Nigeria Feb 02, 2024 at 2:14pm
            </span>
            <p className="font-Raleway font-semibold text-base text-primary-10 leading-normal ">Android 10 Chrome</p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="font-Raleway font-medium text-sm text-opacityClr-40 leading-normal">Login succeeded </span>
            <p className="font-Raleway font-semibold text-base text-primary-10 leading-normal ">Yes</p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="font-Raleway font-medium text-sm text-opacityClr-40 leading-normal">IP address</span>
            <p className="font-Raleway font-semibold text-base text-primary-10 leading-normal ">105.68.10.112</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 border-t  border-[#E8EBEB] py-4 w-full">
          <div className="flex items-center justify-between w-full">
            <span className="flex p-2.5 items-center justify-center gap-2.5 border border-opacityClr-10 rounded">
              <Smartphone className="w-8 h-8" />
            </span>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center justify-center gap-2">
                <button type="button" className="outline-none bg-transparent cursor-pointer">
                  <MinusCircle className="w-5 h-5" />
                </button>
                <span className="font-Raleway font-medium text-sm text-opacityClr-40 leading-normal">Remove device</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="font-Raleway font-medium text-sm text-opacityClr-40 leading-normal">
              Lagos, Nigeria Feb 02, 2024 at 2:14pm
            </span>
            <p className="font-Raleway font-semibold text-base text-primary-10 leading-normal ">IOS 10 Safari</p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="font-Raleway font-medium text-sm text-opacityClr-40 leading-normal">Login succeeded </span>
            <p className="font-Raleway font-semibold text-base text-primary-10 leading-normal ">Yes</p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="font-Raleway font-medium text-sm text-opacityClr-40 leading-normal">IP address</span>
            <p className="font-Raleway font-semibold text-base text-primary-10 leading-normal ">105.68.10.112</p>
          </div>
        </div>
      </div>

      {/* Fixed buttons at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white py-3 px-6 border-t border-opacityClr-20">
        <div className="flex items-center gap-4 w-full">
          <button
            type="button"
            className="flex items-center justify-center w-full rounded-md border border-transparent py-3 px-5 bg-opacityClr-100 text-base text-white font-semibold leading-[150%] transition-all duration-300 ease-in-out hover:bg-opacityClr-80 cursor-pointer"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <span className="spinner mr-2"></span>
                Processing...
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginHistoryDrawer;
