"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setForgotPasswordEmail } from "@/lib/store/slices/authSlice";
import useAuthAPI from "@/services/useAuthAPI";
import { forgotPasswordSchema, formatZodErrors } from "@/lib/validation/auth";

const ForgetPassword = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({ email: "" });

  const { forgotPassword, isSendingForgotPassword } = useAuthAPI();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = forgotPasswordSchema.safeParse(formData);
    if (!result.success) {
      setErrors({ email: "", ...formatZodErrors(result.error) });
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setErrors({ email: "" });
    forgotPassword(result.data, {
      onSuccess: () => {
        dispatch(setForgotPasswordEmail({ email: result.data.email }));
        router.push("/reset-password");
      },
    });
  };

  return (
    <div className="flex flex-col gap-14 md:pt-14">
      <div className="flex flex-col items-start gap-4 w-full md:w-[490px]">
        <h2 className="font-Raleway font-bold text-opacityClr-100 text-xl md:text-[32px] leading-[89%] tracking-[0.32px]">
          Forgot your password?
        </h2>
        <p className="font-Raleway font-normal text-opacityClr-100 text-base leading-[150%]">
          Enter your email address and we&apos;ll send you a verification code to reset your password.
        </p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit} autoComplete="off">
        <div className="flex flex-col gap-2 items-start w-full">
          <label htmlFor="email" className="text-base font-Raleway font-semibold leading-[150%] text-opacityClr-100">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="eg. admin@ekobuja.com"
            className={`w-full flex items-center gap-2 p-4 rounded-lg border ${
              errors.email ? "border-red-500" : "border-opacityClr-50"
            } border-opacityClr-50 text-opacityClr-100 outline-none focus:border focus:border-opacityClr-100 focus:bg-opacityClr-10 placeholder:text-opacityClr-50 placeholder:font-normal placeholder:font-Raleway transition-all duration-300 ease-in-out ${
              formData.email ? "bg-[#E8EBEB]" : ""
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <button
          type="submit"
          disabled={isSendingForgotPassword}
          className={`md:mt-6 border bg-opacityClr-100 text-white font-Raleway font-semibold text-base py-4 rounded-lg transition-all duration-500 ease-in-out disabled:bg-opacityClr-50 cursor-pointer${
            isSendingForgotPassword ? "bg-opacityClr-50 cursor-not-allowed" : ""
          }`}
        >
          {isSendingForgotPassword ? (
            <div className="flex items-center justify-center gap-2">
              <span className="spinner"></span>
              <span className="text-opacityClr-10">Submitting...</span>
            </div>
          ) : (
            "Continue"
          )}
        </button>

        <div className="flex items-center justify-center gap-2">
          <p className="text-primary-10 text-center font-Raleway text-base font-medium leading-[150%]">Back to log in page?</p>
          <Link
            href="/login"
            className="text-primary-10 text-center font-Raleway text-base font-bold leading-[150%] tracking-[-0.16px] cursor-pointer transition-all duration-300 ease-in-out hover:text-primary-10 hover:font-normal"
          >
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgetPassword;
