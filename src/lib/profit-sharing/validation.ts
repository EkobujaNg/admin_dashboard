import { z } from "zod";
import { formatZodErrors, verificationCodeSchema } from "@/lib/validation/common";

export { formatZodErrors };

const amountFieldSchema = z
  .string()
  .trim()
  .min(1, "Amount is required.")
  .refine((value) => !Number.isNaN(Number(value.replace(/,/g, ""))), "Enter a valid amount.")
  .transform((value) => Number(value.replace(/,/g, "")))
  .refine((value) => value > 0, "Amount must be greater than 0.");

export const loadProfitShareSchema = z.object({
  amount: amountFieldSchema,
});

export const confirmLoadProfitShareSchema = z.object({
  amount: amountFieldSchema,
  code: verificationCodeSchema,
});

export const confirmDistributeProfitShareSchema = z.object({
  code: verificationCodeSchema,
});

const ALLOWED_RATES = [1, 2, 3, 4, 6, 12] as const;

export const updateProfitSharingRateSchema = z.object({
  profitSharingRate: z
    .number({ error: "Select a profit sharing rate." })
    .refine(
      (value): value is (typeof ALLOWED_RATES)[number] =>
        (ALLOWED_RATES as readonly number[]).includes(value),
      "Rate must be 1, 2, 3, 4, 6, or 12."
    ),
});
