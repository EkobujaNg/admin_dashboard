import { z } from "zod";
import {
  emailSchema,
  formatZodErrors,
  loginPasswordSchema,
  passwordSchema,
  verificationCodeSchema,
} from "./common";

export { formatZodErrors };

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const forgotPasswordResetFormSchema = z
  .object({
    code: verificationCodeSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ForgotPasswordResetFormData = z.infer<typeof forgotPasswordResetFormSchema>;
