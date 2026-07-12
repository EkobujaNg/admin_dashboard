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

export const PASSWORD_SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

export const PASSWORD_REQUIREMENTS = [
  {
    id: "minLength",
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "At least one uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    id: "number",
    label: "At least one number",
    test: (password: string) => /[0-9]/.test(password),
  },
  {
    id: "special",
    label: "At least one special character",
    test: (password: string) => PASSWORD_SPECIAL_CHAR_REGEX.test(password),
  },
] as const;

export function getPasswordRequirementStatus(password: string) {
  return PASSWORD_REQUIREMENTS.map((requirement) => ({
    ...requirement,
    met: requirement.test(password),
  }));
}

export const passwordSchema = z
  .string()
  .min(1, "Password is required.")
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(PASSWORD_SPECIAL_CHAR_REGEX, "Password must contain at least one special character.");

export const verificationCodeSchema = z
  .string()
  .min(1, "Verification code is required.")
  .length(6, "Please enter the full verification code.")
  .regex(/^[A-Z0-9]{6}$/i, "Verification code must be 6 alphanumeric characters.");
