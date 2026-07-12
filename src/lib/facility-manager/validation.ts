import { z } from "zod";
import { emailSchema, formatZodErrors } from "@/lib/validation/common";

export { formatZodErrors };

export const facilityManagerPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character.");

export const createFacilityManagerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  email: emailSchema,
  password: facilityManagerPasswordSchema,
  phoneCode: z.string().trim().min(1, "Country code is required."),
  phoneNumber: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number.")
    .max(15, "Phone number is too long.")
    .regex(/^\d+$/, "Phone number should contain digits only."),
});
