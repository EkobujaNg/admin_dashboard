import { z } from "zod";
import { formatZodErrors } from "@/lib/validation/common";

export { formatZodErrors };

export const topUpBuybackSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, "Amount is required.")
    .refine((value) => !Number.isNaN(Number(value.replace(/,/g, ""))), "Enter a valid amount.")
    .transform((value) => Number(value.replace(/,/g, "")))
    .refine((value) => value > 0, "Amount must be greater than 0."),
});
