"use client";
import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ResetPasswordDrawer = () => {
  const [formData, setFormData] = useState<{ otp: string; newPassword: string; confirmPassword: string }>({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ otp: string; newPassword: string; confirmPassword: string }>({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const validateForm = () => {
    const passwordRequirements = {
      minLength: 8,
      uppercase: /[A-Z]/,
      number: /[0-9]/,
      specialCharacter: /[!@#$%^&*(),.?":{}|<>]/,
    };

    let validationErrors: { otp?: string; newPassword?: string; confirmPassword?: string } = {};
    if (!/^[0-9]{6}$/.test(formData.otp)) {
      validationErrors.otp = "OTP must be a 6-digit number.";
    }
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

    setErrors(validationErrors as { otp: string; newPassword: string; confirmPassword: string });

    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleResendOTP = () => {
    // Add your resend OTP API call here
    setCountdown(60);
    setCanResend(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (validateForm()) {
        // Replace this with your actual API call
        // await resetPasswordAPI(formData);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-6 p-6 relative h-full">
      <p className="font-Raleway font-normal text-opacityClr-100 text-base leading-[150%]">
        An OTP has been sent to your email address. Enter OTP and new password below to change your password.
      </p>

      <form onSubmit={handleSave} autoComplete="off" className="flex flex-col gap-6 w-full overflow-y-auto pb-24">
        {/* OTP */}
        <div className="flex flex-col gap-2 items-start w-full">
          <label htmlFor="otp" className="text-base font-Raleway font-semibold leading-[150%] text-opacityClr-100">
            OTP
          </label>
          <div className="relative w-full">
            <input
              type="text"
              id="otp"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="6-digits code"
              className={`w-full flex items-center gap-2 p-4 rounded-lg border ${
                errors.otp ? "border-red-500" : "border-opacityClr-50"
              } text-opacityClr-100 outline-none focus:border focus:border-opacityClr-100  placeholder:text-opacityClr-50 placeholder:font-normal placeholder:font-Raleway transition-all duration-300 ease-in-out`}
            />
          </div>
          {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
        </div>

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
              } text-opacityClr-100 outline-none focus:border focus:border-opacityClr-100  placeholder:text-opacityClr-50 placeholder:font-normal placeholder:font-Raleway transition-all duration-300 ease-in-out`}
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
              } text-opacityClr-100 outline-none focus:border focus:border-opacityClr-100 placeholder:text-opacityClr-50 placeholder:font-normal placeholder:font-Raleway transition-all duration-300 ease-in-out`}
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

        <div className="flex items-center justify-center gap-2">
          <p className="text-primary-10 text-center font-Raleway text-sm md:text-base font-medium leading-[150%]">
            Haven't received OTP yet?
          </p>
          <button
            type="button"
            className={`text-primary-10 text-center font-Raleway text-sm md:text-base font-bold leading-[150%] tracking-[-0.16px] cursor-pointer ${
              !canResend ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleResendOTP}
            disabled={!canResend}
          >
            {canResend ? "Resend OTP" : `Resend OTP code in ${countdown}s`}
          </button>
        </div>
      </form>

      {/* Fixed buttons at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white py-3 px-6 border-t border-opacityClr-20">
        <div className="flex items-center gap-4 w-full">
          <button
            type="button"
            className="flex items-center justify-center w-full rounded-md border border-transparent py-3 px-5 bg-opacityClr-100 text-base text-white font-semibold leading-[150%] transition-all duration-300 ease-in-out hover:bg-opacityClr-80 cursor-pointer"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <span className="spinner mr-2"></span>
                Processing...
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordDrawer;
