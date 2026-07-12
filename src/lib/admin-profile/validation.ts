import { z } from "zod";
import { formatZodErrors } from "@/lib/validation/common";

export { formatZodErrors };

export const updateAdminProfileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  phoneCode: z.string().trim().min(1, "Country code is required."),
  phoneNumber: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number.")
    .max(15, "Phone number is too long.")
    .regex(/^\d+$/, "Phone number should contain digits only."),
});

export type UpdateAdminProfileFormInput = z.infer<typeof updateAdminProfileSchema>;
