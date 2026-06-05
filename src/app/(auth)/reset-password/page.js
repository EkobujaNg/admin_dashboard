"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import http from "@/lib/http";
import { toast } from "sonner";

const ResetPassword = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const passwordRequirements = {
      minLength: 8,
      uppercase: /[A-Z]/,
      number: /[0-9]/,
      specialCharacter: /[!@#$%^&*(),.?":{}|<>]/,
    };

    let validationErrors = {};
    if (!passwordRequirements.specialCharacter.test(formData.newPassword)) {
      validationErrors.newPassword = "Password must contain at least one special character.";
    }

    if (!passwordRequirements.number.test(formData.newPassword)) {
      validationErrors.newPassword = "Password must contain at least one number.";
    }
    if (!passwordRequirements.uppercase.test(formData.newPassword)) {
      validationErrors.newPassword = "Password must contain at least one uppercase letter.";
    }
    if (formData.newPassword.length < passwordRequirements.minLength) {
      validationErrors.newPassword = "Password must be at least 8 characters long.";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // Mutation for login using http
  const mutation = useMutation({
    mutationFn: async ({ newPassword, confirmPassword }) => {
      const { data } = await http.post("/Auth/reset-password", { newPassword, confirmPassword });
      return data?.data;
    },

    onSuccess: (data) => {
      toast.success("Password changed successfully!");
      router.push("/login");
    },

    onError: (error) => {
      const message = error?.response?.data?.responseDescription || "An error occurred while changing the password!";
      console.error("Error during password change:", message);
      toast.error(message);
    },

    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({ newPassword: "", confirmPassword: "" });

    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }
    setIsLoading(true);
    mutation.mutate({
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    });
  };

  return (
    <div className="flex flex-col gap-14 md:pt-14 h-full">
      {/* Header */}
      <div className="flex flex-col items-start gap-4 w-full md:w-[490px]">
        <h2 className="font-Raleway font-bold text-opacityClr-100 text-xl md:text-[32px] leading-[89%] tracking-[0.32px]">
          Enter new password?
        </h2>
        <p className="font-Raleway font-normal text-opacityClr-100 text-base leading-[150%]">
          An OTP has been sent to your email address. Enter OTP and new password below to change your password.
        </p>
        <Link href="/forgot-password" className="text-opacityClr-100 font-Raleway font-bold leading-[150%]">
          Change email address
        </Link>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-6" onSubmit={handleSubmit} autoComplete="off">
        {/* Password */}
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
              } text-opacityClr-100 outline-none focus:border focus:border-opacityClr-100 focus:bg-opacityClr-10 placeholder:text-opacityClr-50 placeholder:font-normal placeholder:font-Raleway transition-all duration-300 ease-in-out ${
                formData.newPassword ? "bg-[#E8EBEB]" : ""
              }`}
            />
            <button type="button" className="absolute right-4 top-4 cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? (
                <AiOutlineEye size={24} className={`${formData.newPassword ? "text-opacityClr-100" : "text-[#BBC3C3]"}`} />
              ) : (
                <AiOutlineEyeInvisible size={24} className={`${formData.newPassword ? "text-opacityClr-100" : "text-[#BBC3C3]"}`} />
              )}
            </button>
          </div>
          <p className="text-opacityClr-50 text-sm font-Raleway font-normal leading-normal">Must be at least 8 characters</p>
          {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
        </div>

        {/* Confirm Password */}
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
              } text-opacityClr-100 outline-none focus:border focus:border-opacityClr-100 focus:bg-opacityClr-10 placeholder:text-opacityClr-50 placeholder:font-normal placeholder:font-Raleway transition-all duration-300 ease-in-out ${
                formData.confirmPassword ? "bg-[#E8EBEB]" : ""
              }`}
            />
            <button
              type="button"
              className="absolute right-4 top-4 cursor-pointer"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? (
                <AiOutlineEye size={24} className={`${formData.confirmPassword ? "text-opacityClr-100" : "text-[#BBC3C3]"}`} />
              ) : (
                <AiOutlineEyeInvisible size={24} className={`${formData.confirmPassword ? "text-opacityClr-100" : "text-[#BBC3C3]"}`} />
              )}
            </button>
          </div>
          <p className="text-opacityClr-50 text-sm font-Raleway font-normal leading-normal">Must match the password above.</p>
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading} // Disable button while loading
          className={`md:mt-6 border bg-opacityClr-100 text-white font-Raleway font-semibold text-base py-4 rounded-lg transition-all duration-500 ease-in-out hover:border hover:border-opacityClr-100 hover:bg-transparent hover:text-opacityClr-100 ${
            isLoading ? "bg-opacityClr-80 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="spinner"></span>
              <span className="text-opacityClr-10">Updating...</span>
            </div>
          ) : (
            "Change Password"
          )}
        </button>

        <div className="flex items-center justify-center gap-2">
          <p className="text-primary-10 text-center font-Raleway text-sm md:text-base font-medium leading-[150%]">
            Haven’t received OTP yet?
          </p>
          <button
            type="button"
            className="text-primary-10 text-center font-Raleway text-sm md:text-base font-bold leading-[150%] tracking-[-0.16px] cursor-pointer"
          >
            Resend OTP code in 51s
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
