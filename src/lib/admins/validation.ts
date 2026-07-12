import { z } from "zod";
import { emailSchema, formatZodErrors } from "@/lib/validation/common";
import { facilityManagerPasswordSchema } from "@/lib/facility-manager/validation";

export { formatZodErrors };

const adminRoleSchema = z.enum(["super_admin", "admin", "moderator", "finance"]);

export const createAdminSchema = z.object({
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
  roles: z.array(adminRoleSchema).min(1, "Select at least one role."),
});

export type CreateAdminFormInput = z.infer<typeof createAdminSchema>;
