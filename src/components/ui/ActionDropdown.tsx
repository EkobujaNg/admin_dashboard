"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

const ActionDropdown = ({ actions = [], className = "", triggerClassName = "", dropdownClassName = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (action) => {
    if (action.onClick) {
      action.onClick();
    }
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn("p-2 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer", triggerClassName)}
      >
        <MoreVertical size={16} className="text-neutral-600" />
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
              key={index}
              onClick={() => handleAction(action)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-neutral-50 transition-colors cursor-pointer",
                action.variant === "danger" && "text-red-600 hover:bg-red-50",
                action.variant === "warning" && "text-orange-600 hover:bg-orange-50"
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
