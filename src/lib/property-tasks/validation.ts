import { z } from "zod";
import { formatZodErrors } from "@/lib/validation/common";

export { formatZodErrors };

export const propertyTaskAffectRemarkSchema = z.object({
  remark: z
    .string()
    .trim()
    .min(3, "Enter a remark (at least 3 characters).")
    .max(500, "Remark is too long."),
});
