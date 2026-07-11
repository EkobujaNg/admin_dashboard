"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

type ActionItem = {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  variant?: "default" | "danger" | "warning" | "success";
  disabled?: boolean;
};

type ActionDropdownProps = {
  actions?: ActionItem[];
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  /** When set, shows a labeled button with chevron instead of the kebab icon. */
  label?: string;
};

const ActionDropdown = ({
  actions = [],
  className = "",
  triggerClassName = "",
  dropdownClassName = "",
  label,
}: ActionDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (action: ActionItem) => {
    if (action.disabled) return;
    action.onClick?.();
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          label
            ? "inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-neutral-lightGreen text-primary-10 font-Raleway font-semibold text-sm hover:bg-primary-10 hover:text-white transition-colors"
            : "p-2 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer",
          triggerClassName
        )}
      >
        {label ? (
          <>
            {label}
            <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
          </>
        ) : (
          <MoreVertical size={16} className="text-neutral-600" />
        )}
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-0 top-full mt-1 w-56 bg-white border border-neutral-200 rounded-md shadow-lg z-30 py-1",
            dropdownClassName
          )}
        >
          {actions.map((action, index) => (
            <button
              key={`${action.label}-${index}`}
              type="button"
              disabled={action.disabled}
              onClick={() => handleAction(action)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                action.variant === "danger" && "text-red-600 hover:bg-red-50",
                action.variant === "warning" && "text-orange-600 hover:bg-orange-50",
                action.variant === "success" && "text-green-700 hover:bg-green-50"
              )}
            >
              {action.icon && <action.icon className="w-4 h-4" />}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;
