"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { formatAmountForDisplay, sanitizeAmountInput } from "@/lib/currency/format";
import { cn } from "@/lib/utils";

type CurrencyAmountInputProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (rawValue: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  size?: "md" | "lg" | "xl";
  className?: string;
  inputClassName?: string;
  showDecimalsOnBlur?: boolean;
};

const sizeClasses = {
  md: "text-2xl",
  lg: "text-3xl md:text-4xl",
  xl: "text-4xl md:text-5xl",
};

export default function CurrencyAmountInput({
  id = "amount",
  name = "amount",
  value,
  onChange,
  placeholder = "0.00",
  disabled = false,
  autoFocus = false,
  size = "lg",
  className,
  inputClassName,
  showDecimalsOnBlur = true,
}: CurrencyAmountInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(() => formatAmountForDisplay(value));

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value ? formatAmountForDisplay(value, { showDecimals: showDecimalsOnBlur }) : "");
    }
  }, [value, isFocused, showDecimalsOnBlur]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = sanitizeAmountInput(event.target.value);
      onChange(raw);
      setDisplayValue(formatAmountForDisplay(raw));
    },
    [onChange]
  );

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(value ? formatAmountForDisplay(value) : "");
  };

  const handleBlur = () => {
    setIsFocused(false);
    setDisplayValue(value ? formatAmountForDisplay(value, { showDecimals: showDecimalsOnBlur }) : "");
  };

  return (
    <div className={cn("flex items-center min-w-0 flex-1", className)}>
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        id={id}
        name={name}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        autoComplete="off"
        aria-label="Amount in Naira"
        className={cn(
          "w-full min-w-0 bg-transparent border-none outline-none font-bold font-Raleway text-primary-10 text-center tabular-nums tracking-tight placeholder:text-opacityClr-30 placeholder:font-bold",
          sizeClasses[size],
          inputClassName
        )}
      />
    </div>
  );
}
