"use client";
import React, { useState } from "react";
import Tooltip from "@/components/ui/Tooltip";
import { Copy, CopyCheck, Info } from "lucide-react";

const TwoFactorAuthDrawer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
  });

  const [error, setError] = useState("");

  const handleGenerateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData((prev) => ({ ...prev, code }));
    setError("");
  };

  const handleCopyCode = () => {
    if (!formData.code) return;

    setIsCopied(true);
    navigator.clipboard.writeText(formData.code);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const validateForm = () => {
    if (!formData.code) {
      setError("Please generate a verification code first");
      return false;
    }
    return true;
  };

  const handleSetCode = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
    } catch (error) {
      console.error("Error setting 2FA code:", error);
      setError("Failed to set verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-6 p-6 relative h-full ">
      <p className="font-Raleway font-normal text-opacityClr-100 text-base leading-[150%] mt-6">
        The ability for users to sign in with an additional authentication factor, in addition to using their username and password (e.g. a
        verification code).
      </p>
      <form id="twoFactorForm" onSubmit={handleSetCode} autoComplete="off" className="flex flex-col gap-6 w-full overflow-y-auto pb-24">
        {/* Property Code */}
        <div className="flex flex-col gap-2">
          <label htmlFor="code" className="text-base font-Raleway font-semibold leading-[150%] text-opacityClr-100 flex items-start">
            Verification Code <span className="text-red-500">*</span>
            <Tooltip text="This is for verification purposes! ">
              <span className="ml-2 flex items-center justify-center bg-opacityClr-10 px-2 py-1 rounded-full">
                <Info className="cursor-pointer text-gray-500 w-[18px] h-[18px]" />
                Why?
              </span>
            </Tooltip>
          </label>

          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-opacityClr-10">
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full border-none bg-transparent outline-none "
              />
              <button type="button" onClick={handleCopyCode} className="border-none bg-transparent" disabled={!formData.code}>
                {isCopied ? (
                  <CopyCheck className="cursor-pointer text-opacityClr-100 w-[18px] h-[18px]" />
                ) : (
                  <Copy className="cursor-pointer text-opacityClr-100 w-[18px] h-[18px]" />
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={handleGenerateCode}
              className="px-5 py-4 text-base text-white border rounded-lg bg-opacityClr-50 cursor-pointer hover:bg-opacityClr-60 transition-all duration-300"
            >
              Generate Code
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </form>
      {/* Fixed buttons at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white py-3 px-6 border-t border-opacityClr-20">
        <div className="flex items-center gap-4 w-full">
          <button
            type="submit"
            form="twoFactorForm"
            className="flex items-center justify-center w-full rounded-md border border-transparent py-3 px-5 bg-opacityClr-100 text-base text-white font-semibold leading-[150%] transition-all duration-300 ease-in-out hover:bg-opacityClr-80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !formData.code}
          >
            {isLoading ? (
              <div className="flex items-center">
                <span className="spinner mr-2"></span>
                Processing...
              </div>
            ) : (
              "Set Code"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuthDrawer;
