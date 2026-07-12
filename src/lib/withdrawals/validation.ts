import { z } from "zod";
import { formatZodErrors } from "@/lib/validation/common";

export { formatZodErrors };

export const withdrawalRejectReasonSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, "Enter a rejection reason (at least 3 characters).")
    .max(500, "Rejection reason is too long."),
});
