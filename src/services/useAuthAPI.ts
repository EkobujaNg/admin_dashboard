import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  forgotPassword,
  login,
  resendForgotPasswordCode,
  resetPasswordWithCode,
} from "@/lib/auth/api";
import type { ForgotPasswordPayload, ForgotPasswordResetPayload, LoginResponse } from "@/lib/auth/types";

type MutationOptions<T = void> = {
  onSuccess?: (data?: T) => void;
  onError?: (error?: any) => void;
  onSettled?: () => void;
};

function getErrorMessage(error: any, fallback: string) {
  return (
    error?.response?.data?.responseDescription ||
    error?.response?.data?.message ||
    fallback
  );
}

export const useAuthAPI = () => {
  const loginMutation = useMutation({
    mutationFn: login,
    onError: (error: any) => {
      toast.error(getErrorMessage(error, "An unexpected error occurred during login."));
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("Please check your email for the verification code.");
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, "An error occurred. Please try again."));
    },
  });

  const resendForgotPasswordMutation = useMutation({
    mutationFn: resendForgotPasswordCode,
    onSuccess: () => {
      toast.success("Verification code has been resent to your email.");
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, "Failed to resend verification code."));
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPasswordWithCode,
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, "An error occurred while changing the password."));
    },
  });

  return {
    login: (
      payload: { email: string; password: string },
      options?: MutationOptions<LoginResponse>
    ) => {
      loginMutation.mutate(payload, {
        onSuccess: (data) => {
          toast.success("Login successful!");
          options?.onSuccess?.(data);
        },
        onError: (error) => options?.onError?.(error),
        onSettled: () => options?.onSettled?.(),
      });
    },
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    forgotPassword: (payload: ForgotPasswordPayload, options?: MutationOptions) => {
      forgotPasswordMutation.mutate(payload, {
        onSuccess: () => options?.onSuccess?.(),
        onError: (error) => options?.onError?.(error),
        onSettled: () => options?.onSettled?.(),
      });
    },
    forgotPasswordAsync: forgotPasswordMutation.mutateAsync,
    isSendingForgotPassword: forgotPasswordMutation.isPending,

    resendForgotPasswordCode: (payload: ForgotPasswordPayload, options?: MutationOptions) => {
      resendForgotPasswordMutation.mutate(payload, {
        onSuccess: () => options?.onSuccess?.(),
        onError: (error) => options?.onError?.(error),
        onSettled: () => options?.onSettled?.(),
      });
    },
    isResendingForgotPassword: resendForgotPasswordMutation.isPending,

    resetPasswordWithCode: (payload: ForgotPasswordResetPayload, options?: MutationOptions) => {
      resetPasswordMutation.mutate(payload, {
        onSuccess: () => options?.onSuccess?.(),
        onError: (error) => options?.onError?.(error),
        onSettled: () => options?.onSettled?.(),
      });
    },
    resetPasswordAsync: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
  };
};

export default useAuthAPI;
