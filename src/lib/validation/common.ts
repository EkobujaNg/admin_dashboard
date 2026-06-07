import { z, type ZodError } from "zod";

export function formatZodErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return errors;
}

export const emailSchema = z
  .string()
  .min(1, "Email is required.")
  .email("Enter a valid email address.");

export const loginPasswordSchema = z.string().min(1, "Password is required.");

export const passwordSchema = z
  .string()
  .min(1, "Password is required.")
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character.");

export const verificationCodeSchema = z
  .string()
  .min(1, "Verification code is required.")
  .length(6, "Please enter the full verification code.")
  .regex(/^[A-Z0-9]{6}$/i, "Verification code must be 6 alphanumeric characters.");
