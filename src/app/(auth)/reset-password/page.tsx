"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { clearForgotPasswordFlow } from "@/lib/store/slices/authSlice";
import useAuthAPI from "@/services/useAuthAPI";
import { forgotPasswordResetFormSchema, formatZodErrors } from "@/lib/validation/auth";

const ResetPassword = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const initiateEmail = useSelector((state: any) => state.auth.initiateEmail);
  const isExitingRef = useRef(false);
  const emailRef = useRef<string | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const { resetPasswordWithCode, resendForgotPasswordCode, isResettingPassword, isResendingForgotPassword } = useAuthAPI();

  useEffect(() => {
    if (isExitingRef.current) return;

    if (initiateEmail) {
      emailRef.current = initiateEmail;
      return;
    }

    if (!emailRef.current) {
      toast.error("Please start the forgot password process first.");
      router.replace("/forgot-password");
    }
  }, [initiateEmail, router]);

  useEffect(() => {
    if (secondsLeft > 0) {
      setCanResend(false);
      const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
      return () => clearTimeout(timer);
    }
    setCanResend(true);
  }, [secondsLeft]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextValue = name === "code" ? value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) : value;
    setFormData({ ...formData, [name]: nextValue });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const email = emailRef.current ?? initiateEmail;
    if (!email) {
      toast.error("Missing email. Please start again.");
      router.replace("/forgot-password");
      return;
    }

    const result = forgotPasswordResetFormSchema.safeParse({
      code: formData.code.trim(),
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    });

    if (!result.success) {
      setErrors({ code: "", newPassword: "", confirmPassword: "", ...formatZodErrors(result.error) });
      toast.error("Please fix the errors in the form.");
      return;
    }

    setErrors({ code: "", newPassword: "", confirmPassword: "" });
    resetPasswordWithCode(
      {
        email,
        code: result.data.code.toUpperCase(),
        newPassword: result.data.newPassword,
      },
      {
        onSuccess: () => {
          isExitingRef.current = true;
          router.replace("/login");
          dispatch(clearForgotPasswordFlow());
        },
      }
    );
  };

  const handleResend = () => {
    const email = emailRef.current ?? initiateEmail;
    if (!email || !canResend || isResendingForgotPassword) return;

    resendForgotPasswordCode(
      { email },
      {
        onSuccess: () => {
          setSecondsLeft(30);
          setFormData((prev) => ({ ...prev, code: "" }));
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-14 md:pt-14 h-full">
      <div className="flex flex-col items-start gap-4 w-full md:w-[490px]">
        <h2 className="font-Raleway font-bold text-opacityClr-100 text-xl md:text-[32px] leading-[89%] tracking-[0.32px]">
          Set new password
        </h2>
        <p className="font-Raleway font-normal text-opacityClr-100 text-base leading-[150%]">
          An OTP has been sent to your email address. Enter the code and your new password below.
        </p>
        <Link href="/forgot-password" className="text-opacityClr-100 font-Raleway font-bold leading-[150%]">
          Change email address
        </Link>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit} autoComplete="off">
        <div className="flex flex-col gap-2 items-start w-full">
          <label htmlFor="code" className="text-base font-Raleway font-semibold leading-[150%] text-opacityClr-100">
            OTP
          </label>
          <input
            type="text"
            id="code"
            name="code"
            inputMode="text"
            autoComplete="one-time-code"
            value={formData.code}
            onChange={handleChange}
            placeholder="6-digits code"
            maxLength={6}
            className={`w-full p-4 rounded-lg border text-opacityClr-100 outline-none placeholder:text-opacityClr-50 placeholder:font-Raleway uppercase ${
              errors.code ? "border-red-500" : "border-opacityClr-50 focus:border-opacityClr-100"
            }`}
          />
          {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
        </div>

        <div className="flex flex-col gap-2 items-start w-full">
          <label htmlFor="newPassword" className="text-base font-Raleway font-semibold leading-[150%] text-opacityClr-100">
            Password
          </label>
          <div className="relative w-full">
            <input
              type={passwordVisible ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full flex items-center gap-2 p-4 rounded-lg border ${
                errors.newPassword ? "border-red-500" : "border-opacityClr-50"
              } text-opacityClr-100 outline-none focus:border focus:border-opacityClr-100 placeholder:text-opacityClr-50 ${
                formData.newPassword ? "bg-[#E8EBEB]" : ""
              }`}
            />
            <button type="button" className="absolute right-4 top-4 cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
            </button>
          </div>
          <p className="text-opacityClr-50 text-sm font-Raleway">
            Must be at least 8 characters with uppercase, number, and special character
          </p>
          {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
        </div>

        <div className="flex flex-col gap-2 items-start w-full">
          <label htmlFor="confirmPassword" className="text-base font-Raleway font-semibold leading-[150%] text-opacityClr-100">
            Confirm Password
          </label>
          <div className="relative w-full">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`w-full flex items-center gap-2 p-4 rounded-lg border ${
                errors.confirmPassword ? "border-red-500" : "border-opacityClr-50"
              } text-opacityClr-100 outline-none focus:border focus:border-opacityClr-100 placeholder:text-opacityClr-50 ${
                formData.confirmPassword ? "bg-[#E8EBEB]" : ""
              }`}
            />
            <button
              type="button"
              className="absolute right-4 top-4 cursor-pointer"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={isResettingPassword}
          className={`md:mt-6 border bg-opacityClr-100 text-white font-Raleway font-semibold text-base py-4 rounded-lg transition-all duration-500 ease-in-out hover:border hover:border-opacityClr-100 hover:bg-transparent hover:text-opacityClr-100 ${
            isResettingPassword ? "bg-opacityClr-80 cursor-not-allowed" : ""
          }`}
        >
          {isResettingPassword ? (
            <div className="flex items-center justify-center gap-2">
              <span className="spinner"></span>
              <span className="text-opacityClr-10">Updating...</span>
            </div>
          ) : (
            "Change Password"
          )}
        </button>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          <p className="text-primary-10 text-center font-Raleway text-sm md:text-base font-medium leading-[150%]">
            Haven&apos;t received OTP yet?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || isResendingForgotPassword}
            className={`text-primary-10 text-center font-Raleway text-sm md:text-base font-bold leading-[150%] tracking-[-0.16px] ${
              canResend && !isResendingForgotPassword ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
            }`}
          >
            {isResendingForgotPassword
              ? "Resending..."
              : canResend
                ? "Resend OTP code"
                : `Resend OTP code in ${secondsLeft}s`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
