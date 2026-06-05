"use client";

import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast text-neutral-700 border border-gray-100 shadow-lg rounded-xl",
          description: "text-accent-80",
          actionButton: "bg-primary-100 text-white hover:bg-primary-100/90",
          cancelButton: "bg-accent-10 text-accent-80 hover:bg-accent-20",
          success: "!bg-green-50 !border-green-200 !text-green-800 [&>svg]:text-green-600",
          error: "!bg-red-50 !border-red-200 !text-red-800 [&>svg]:text-red-600",
          warning: "!bg-amber-50 !border-amber-200 !text-amber-800 [&>svg]:text-amber-600",
          info: "!bg-blue-50 !border-blue-200 !text-blue-800 [&>svg]:text-blue-600",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
