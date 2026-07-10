const MAX_AMOUNT_DIGITS = 12;

/** Strip commas and keep digits with optional decimal (max 2 places). */
export function sanitizeAmountInput(input: string): string {
  const cleaned = input.replace(/,/g, "").replace(/[^\d.]/g, "");
  if (!cleaned) return "";

  const [intPart = "", ...rest] = cleaned.split(".");
  const decimalPart = rest.join("").slice(0, 2);
  const digits = intPart.replace(/\D/g, "").slice(0, MAX_AMOUNT_DIGITS);

  if (rest.length > 0) {
    return `${digits || "0"}.${decimalPart}`;
  }

  return digits;
}

/** Parse display/raw string to a finite number (0 if invalid). */
export function parseAmountToNumber(value: string): number {
  const sanitized = sanitizeAmountInput(value);
  if (!sanitized) return 0;
  const num = Number(sanitized);
  return Number.isFinite(num) ? num : 0;
}

/** Format raw amount string with thousand separators for display. */
export function formatAmountForDisplay(raw: string, options?: { showDecimals?: boolean }): string {
  const sanitized = sanitizeAmountInput(raw);
  if (!sanitized) return "";

  const [intPart, decimalPart] = sanitized.split(".");
  const intValue = Number(intPart || "0");
  const formattedInt = intValue.toLocaleString("en-NG");

  if (decimalPart !== undefined) {
    return `${formattedInt}.${decimalPart}`;
  }

  if (options?.showDecimals) {
    return intValue.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return formattedInt;
}
