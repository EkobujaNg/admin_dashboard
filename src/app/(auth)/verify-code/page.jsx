"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import http from "@/lib/http/index";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";

const VerifyCode = () => {
  const router = useRouter();

  const initiateEmail = useSelector((state) => state.auth.initiateEmail);

  const [isLoading, setIsLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", ""]);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (!initiateEmail) {
      toast.error("You must start the forget password process first.");
      router.push("/forgot-password");
    }
  }, [initiateEmail, router]);

  useEffect(() => {
    if (secondsLeft > 0) {
      setCanResend(false);
      const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [secondsLeft]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      // Only allow single digit numbers
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Move to the next input if the current one is filled
      if (index < 4 && value !== "") {
        inputsRef.current[index + 1].focus();
      }
    } else if (value === "") {
      // If input is cleared
      const newCode = [...verificationCode];
      newCode[index] = "";
      setVerificationCode(newCode);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...verificationCode];
        newCode[index] = "";
        setVerificationCode(newCode);
      } else if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 5).split("");
    if (paste.every((char) => /^\d$/.test(char))) {
      const newCode = paste.concat(Array(5 - paste.length).fill(""));
      setVerificationCode(newCode);
      newCode.forEach((char, index) => {
        inputsRef.current[index].value = char;
        if (index < 4 && char) inputsRef.current[index + 1].focus();
      });
    }
  };

  const mutation = useMutation({
    mutationFn: async ({ verificationCode }) => {
      const { data } = await http.post("/Auth/verify-code", {
        verificationCode: verificationCode.join(""),
      });
      return data.data;
    },

    onSuccess: (data) => {
      toast.success("Email verified successfully!");
      router.push("/reset-password");
    },

    onError: (error) => {
      console.error("Error during email verification:", error);
      toast.error(error?.response?.data?.responseDescription || "An error occurred while verifying your code!");
    },
  });

  const isCodeComplete = verificationCode.every((digit) => digit.length === 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!isCodeComplete) {
        toast.error("Please enter the full 5-digit verification code.");
        return;
      }
      mutation.mutate({ verificationCode: verificationCode });
      setIsLoading(false);
    } catch (error) {
      console.error("Error during email verification:", error);
      toast.error("An error occurred while verifying your email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      if (!initiateEmail) {
        toast.error("No email found to resend OTP.");
        return;
      }
      await http.post("/Auth/resend-otp", { email: initiateEmail });
      toast.success("OTP has been resent to your email.");
      setSecondsLeft(30);
    } catch (error) {
      console.error(error || "Failed to resend OTP.");
    }
  };

  return (
    <div className="flex flex-col gap-8 md:gap-14 md:pt-14">
      {/* Header  */}
      <div className="flex flex-col items-start gap-4 w-full md:w-[490px]">
        <h2 className="font-Raleway font-bold text-opacityClr-100 text-xl md:text-[32px] leading-[89%] tracking-[0.32px]">
          Verify your code
        </h2>
        <p className="font-Raleway font-normal text-opacityClr-100 text-base leading-[150%]">
          An OTP code has been sent to <span className="font-bold">{initiateEmail}</span>, enter code below to reset your password.
        </p>
        {/* {isLoading && ( */}
        <Link href="/forgot-password" className="text-opacityClr-100 font-Raleway font-bold leading-[150%]">
          Change email address
        </Link>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-6" onSubmit={handleSubmit} autoComplete="off">
        <div className="flex items-center justify-center gap-3 md:gap-6 w-full" onPaste={handlePaste}>
          {verificationCode.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="tel"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="flex items-center justify-center text-center rounded-lg text-opacityClr-100 border border-opacityClr-40 bg-transparent w-full md:w-14 h-14 p-[10px] placeholder:text-opacityClr-100 font-medium text-lg leading-5 outline-none focus:border-opacityClr-100 "
              aria-label={`Verification code digit ${index + 1}`}
            />
          ))}
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

        {/* {isLoading && ( */}
        <div className="flex items-center justify-center gap-2">
          <p className="text-primary-10 text-center font-Raleway text-sm md:text-base font-medium leading-[150%]">
            Haven’t received OTP yet?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            className={`text-primary-10 text-center font-Raleway text-sm md:text-base font-bold leading-[150%] tracking-[-0.16px] ${
              canResend ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
            }`}
          >
            {canResend ? "Resend OTP code" : `Resend OTP code in ${secondsLeft}s`}
          </button>
        </div>
        {/* )} */}
      </form>
    </div>
  );
};

export default VerifyCode;
