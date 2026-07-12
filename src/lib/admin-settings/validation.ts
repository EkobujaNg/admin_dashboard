import { z } from "zod";
import { formatZodErrors } from "@/lib/validation/common";

export { formatZodErrors };

function amountField(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .refine((value) => !Number.isNaN(Number(value.replace(/,/g, ""))), `Enter a valid ${label.toLowerCase()}.`)
    .transform((value) => Number(value.replace(/,/g, "")))
    .refine((value) => value >= 0, `${label} must be 0 or more.`);
}

export const updateAdminSettingsSchema = z.object({
  referralRewardAmount: amountField("Referral reward amount"),
  maxCommissionAmount: amountField("Max commission amount"),
});

export type UpdateAdminSettingsFormInput = z.infer<typeof updateAdminSettingsSchema>;
