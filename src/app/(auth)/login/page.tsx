"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import CustomCheckbox from "@/components/ui/CustomCheckBox";
import { setCookie } from "nookies";
import { login } from "@/lib/store/slices/authSlice";
import { AUTH_COOKIE_NAME } from "@/lib/auth/routes";
import { AUTHENTICATED_HOME, getSafeRedirect } from "@/lib/auth/proxy-config";
import useAuthAPI from "@/services/useAuthAPI";
import { formatZodErrors, loginSchema } from "@/lib/validation/auth";

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "cayomike@gmail.com", password: "SuperAdmin123!" });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({ email: "", password: "" });

  const { login: loginAsync, isLoggingIn } = useAuthAPI();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      setErrors({ email: "", password: "", ...formatZodErrors(result.error) });
      toast.error("Please fix the errors in the form.");
      return;
    }

    setErrors({ email: "", password: "" });
    loginAsync(result.data, {
      onSuccess: (data) => {
        if (!data?.accessToken) {
          toast.error("Login succeeded but no access token was returned.");
          return;
        }

        dispatch(login(data));
        setCookie(null, AUTH_COOKIE_NAME, data.accessToken, {
          maxAge: rememberMe ? 10 * 24 * 60 * 60 : 7 * 24 * 60 * 60,
          path: "/",
          sameSite: "lax",
        });
        router.push(getSafeRedirect(searchParams.get("from"), AUTHENTICATED_HOME));
      },
    });
  };

  return (
    <div className="flex flex-col gap-14 w-full max-w-[500px]">
      <div className="flex flex-col items-start gap-4">
        <h2 className="font-Raleway font-bold text-opacityClr-100 text-xl md:text-[32px] leading-[89%] tracking-[0.32px]">
          Login to your account
        </h2>
        <p className="font-Raleway font-normal text-opacityClr-100 text-base leading-[150%]">Enter your credentials below to continue:</p>
      </div>

      <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
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
            <button
              type="button"
              className="absolute right-4 top-4 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Eye className={`w-6 h-6 ${formData.password ? "text-opacityClr-100" : "text-[#BBC3C3]"}`} />
              ) : (
                <EyeOff className={`w-6 h-6 ${formData.password ? "text-opacityClr-100" : "text-[#BBC3C3]"}`} />
              )}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <div className="flex items-center justify-between w-full mt-2">
            <CustomCheckbox label="Remember me" checked={rememberMe} onChange={setRememberMe} />
            <Link
              href="/forgot-password"
              className="text-base font-Raleway font-normal text-opacityClr-100 cursor-pointer transition-colors duration-300 ease-in-out hover:text-opacityClr-60"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoggingIn}
          className={`md:mt-6 border bg-opacityClr-100 text-white font-Raleway font-semibold text-base py-4 rounded-lg transition-all duration-500 ease-in-out disabled:bg-opacityClr-50 cursor-pointer${
            isLoggingIn ? "bg-opacityClr-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoggingIn ? (
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
