"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import CustomCheckbox from "@/components/ui/CustomCheckBox";
import http from "@/lib/http";
import { setCookie } from "nookies";
import { login } from "@/lib/store/slices/authSlice";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear errors on input change
  };

  const validate = () => {
    let isValid = true;
    const passwordRequirements = {
      minLength: 8,
      uppercase: /[A-Z]/,
      number: /[0-9]/,
      specialCharacter: /[!@#$%^&*(),.?":{}|<>]/,
    };
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    if (!passwordRequirements.specialCharacter.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character.";
      isValid = false;
    }

    if (!passwordRequirements.number.test(formData.password)) {
      newErrors.password = "Password must contain at least one number.";
      isValid = false;
    }

    if (!passwordRequirements.uppercase.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
      isValid = false;
    }

    if (formData.password.length < passwordRequirements.minLength) {
      newErrors.password = "Password must be at least 8 characters long.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Mutation for login using http
  const mutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await http.post("/Auth/login", { email, password });
      return data;
    },

    onSuccess: (data) => {
      dispatch(
        login({
          user: {
            userId: data?.data?.userId,
            fullName: data?.data?.fullName,
            email: data?.data?.email,
            role: data?.data?.role,
            profilePicture: data?.data?.profilePicture,
          },
          authToken: data?.data?.token,
        })
      );

      setCookie(null, "authToken", data?.data?.token, {
        maxAge: 10 * 24 * 60 * 60,
        path: "/",
      });

      toast.success("Login successful!");
      router.push("/");
    },

    onError: (error) => {
      const message = error?.response?.data?.responseDescription || "An unexpected error occurred during login.";
      toast.error(message);
    },

    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });

    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setIsLoading(true);
    mutation.mutate({ email: formData.email, password: formData.password });
  };

  return (
    <div className="flex flex-col gap-14 w-[500px] mx-auto">
      {/* Header */}
      <div className="flex flex-col items-start gap-4">
        <h2 className="font-Raleway font-bold text-opacityClr-100 text-xl md:text-[32px] leading-[89%] tracking-[0.32px]">
          Login to your account
        </h2>
        <p className="font-Raleway font-normal text-opacityClr-100 text-base leading-[150%]">Enter your credentials below to continue:</p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
        {/* Email */}
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
            placeholder="eg. Thomasfrank@gmail.com"
            className={`w-full flex items-center gap-2 p-4 rounded-lg border ${
              errors.email ? "border-red-500" : "border-opacityClr-50"
            } border-opacityClr-50 text-opacityClr-100 outline-none focus:border focus:border-opacityClr-100 focus:bg-opacityClr-10 placeholder:text-opacityClr-50 placeholder:font-normal placeholder:font-Raleway transition-all duration-300 ease-in-out ${
              formData.email ? "bg-[#E8EBEB]" : ""
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="flex flex-col gap-2 items-start w-full">
          {/* Password */}
          <div className="flex flex-col gap-2 items-start w-full">
            <label htmlFor="password" className="text-base font-Raleway font-semibold leading-[150%] text-opacityClr-100">
              Password
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full flex items-center gap-2 p-4 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-opacityClr-50"
                } border-opacityClr-50 text-opacityClr-100 outline-none focus:border focus:border-opacityClr-100 focus:bg-opacityClr-10 placeholder:text-opacityClr-50 placeholder:font-normal placeholder:font-Raleway transition-all duration-300 ease-in-out ${
                  formData.password ? "bg-[#E8EBEB]" : ""
                }`}
              />
              <span className="absolute right-4 top-4 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <AiOutlineEye size={24} className={`${formData.password ? "text-opacityClr-100" : "text-[#BBC3C3]"}`} />
                ) : (
                  <AiOutlineEyeInvisible size={24} className={`${formData.password ? "text-opacityClr-100" : "text-[#BBC3C3]"}`} />
                )}
              </span>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between w-full">
            <CustomCheckbox label="Remember me" checked={rememberMe} onChange={setRememberMe} />

            <Link
              href="/forgot-password"
              className="text-base font-Raleway font-normal text-opacityClr-100 cursor-pointer transition-colors duration-300 ease-in-out hover:text-opacityClr-60"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`md:mt-6 border bg-opacityClr-100 text-white font-Raleway font-semibold text-base py-4 rounded-lg transition-all duration-500 ease-in-out disabled:bg-opacityClr-50 cursor-pointer${
            isLoading ? "bg-opacityClr-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="spinner"></span>
              <span className="text-opacityClr-10">Continue...</span>
            </div>
          ) : (
            "Log in"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
