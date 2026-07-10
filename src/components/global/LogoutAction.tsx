"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/store/slices/authSlice";
import { signOut } from "@/lib/auth/api";
import { AUTH_COOKIE_NAME } from "@/lib/auth/routes";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

type LogoutActionProps = {
  variant?: "sidebar" | "session-reset";
  message?: string;
};

export default function LogoutAction({
  variant = "sidebar",
  message = "Are you sure you want to log out?",
}: LogoutActionProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await signOut();
    } catch {
      // Clear local session even if sign-out request fails
    } finally {
      dispatch(logout());
      nookies.destroy(null, AUTH_COOKIE_NAME, { path: "/" });
      setIsOpen(false);
      setIsLoggingOut(false);
      router.push("/login");
    }
  };

  return (
    <>
      {variant === "sidebar" ? (
        <button
          type="button"
          className="flex items-center space-x-4 px-4 py-2 group w-full hover:bg-red-50/60 hover:rounded-[100px] cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <LogOut className="w-[18px] h-[18px] text-red-600 group-hover:text-red-700" strokeWidth={1.75} />
          <span className="text-[15px] text-red-600 font-Raleway font-semibold leading-normal group-hover:text-red-700">
            Log Out
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex p-4 items-center justify-between w-full gap-2.5 rounded-lg bg-opacityClr-10 cursor-pointer group hover:bg-opacityClr-20 transition-all duration-300 ease-in-out"
        >
          <span className="text-base font-Raleway font-semibold leading-normal text-primary-10">
            Log Out Of All Sessions
          </span>
          <LogOut className="w-5 h-5 text-primary-10" />
        </button>
      )}

      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => !isLoggingOut && setIsOpen(false)}
        onConfirm={handleLogout}
        message={message}
        confirmMsg={isLoggingOut ? "Logging out..." : "Yes, Log Me Out"}
        cancelMsg="No, Cancel Request"
      />
    </>
  );
}
