"use client";

import React, { useState } from "react";
import Link from "next/link";
import http from "@/lib/http/index";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

const ForgetPassword = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({ email: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear errors on input change
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Mutation for initiating reg email using http
  const mutation = useMutation({
    mutationFn: async ({ email }) => {
      const { data } = await http.post("/Auth/forgot-password", {
        email,
      });
      return data.data;
    },

    onSuccess: (data) => {
      toast.success("Please check your email for verification code.");
      router.push("/verify-code");
    },

    onError: (error) => {
      toast.error(error?.response?.data?.responseDescription || "An error occurred again!");
    },

    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: "" });

    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    mutation.mutate({ email: formData.email });
  };

  return (
    <div className="flex flex-col gap-14 md:pt-14">
      {/* Header  */}
      <div className="flex flex-col items-start gap-4 w-full md:w-[490px]">
        <h2 className="font-Raleway font-bold text-opacityClr-100 text-xl md:text-[32px] leading-[89%] tracking-[0.32px]">
          Forgot your password?
        </h2>
        <p className="font-Raleway font-normal text-opacityClr-100 text-base leading-[150%]">
          Enter your email address, a default link will be send to you mail to initiate password change.
        </p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-6" onSubmit={handleSubmit} autoComplete="off">
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
