"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useDrawerModal } from "@/context/DrawerModalContext";
import PasswordRequirementsChecklist from "@/components/ui/PasswordRequirementsChecklist";
import { changePassword } from "@/lib/auth/api";
import { changePasswordSchema, formatZodErrors } from "@/lib/validation/auth";

function getChangePasswordErrorMessage(error: any) {
  const message = error?.response?.data?.message;
  if (Array.isArray(message)) return message.join(", ");
  return (
    error?.response?.data?.responseDescription ||
    error?.response?.data?.responseMessage ||
    message ||
    error?.message ||
    "Failed to change password."
  );
}

const ResetPasswordDrawer = () => {
  const { closeModal } = useDrawerModal();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully.");
      closeModal?.();
    },
    onError: (error) => {
      toast.error(getChangePasswordErrorMessage(error));
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = changePasswordSchema.safeParse(formData);
    if (!result.success) {
      setErrors(formatZodErrors(result.error));
      return;
    }

    changePasswordMutation.mutate({
      oldPassword: result.data.oldPassword,
      newPassword: result.data.newPassword,
    });
  };

  const isLoading = changePasswordMutation.isPending;

  return (
    <div className="flex flex-col items-start gap-6 relative h-full">
      <p className="font-Raleway font-normal text-opacityClr-100 text-base leading-[150%]">
        Enter your current password and choose a new password below.
      </p>

      <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-6 w-full overflow-y-auto pb-24">
        <div className="flex flex-col gap-2 items-start w-full">
          <label htmlFor="oldPassword" className="text-base font-Raleway font-semibold leading-[150%] text-opacityClr-100">
            Current Password
          </label>
          <div className="relative w-full">
            <input
              type={oldPasswordVisible ? "text" : "password"}
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              className={`w-full flex items-center gap-2 p-4 rounded-lg border ${
                errors.oldPassword ? "border-red-500" : "border-opacityClr-50"
              } text-opacityClr-100 outline-none focus:border focus:border-opacityClr-100 placeholder:text-opacityClr-50 placeholder:font-normal placeholder:font-Raleway transition-all duration-300 ease-in-out`}
            />
            <button
              type="button"
              className="absolute right-4 top-4 cursor-pointer"
              onClick={() => setOldPasswordVisible((prev) => !prev)}
            >
              {oldPasswordVisible ? (
                <Eye className={`w-6 h-6 ${formData.oldPassword ? "text-opacityClr-100" : "text-[#BBC3C3]"}`} />
              ) : (
                <EyeOff className={`w-6 h-6 ${formData.oldPassword ? "text-opacityClr-100" : "text-[#BBC3C3]"}`} />
              )}
            </button>
          </div>
          {errors.oldPassword && <p className="text-red-500 text-sm">{errors.oldPassword}</p>}
        </div>

        <div className="flex flex-col gap-2 items-start w-full">
          <label htmlFor="newPassword" className="text-base font-Raleway font-semibold leading-[150%] text-opacityClr-100">
            New Password
          </label>
          <div className="relative w-full">
            <input
              type={passwordVisible ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className={`w-full flex items-center gap-2 p-4 rounded-lg border ${
                errors.newPassword ? "border-red-500" : "border-opacityClr-50"
              } text-opacityClr-100 outline-none focus:border focus:border-opacityClr-100 placeholder:text-opacityClr-50 placeholder:font-normal placeholder:font-Raleway transition-all duration-300 ease-in-out`}
            />
            <button
              type="button"
              className="absolute right-4 top-4 cursor-pointer"
              onClick={() => setPasswordVisible((prev) => !prev)}
            >
              {passwordVisible ? (
                <Eye className={`w-6 h-6 ${formData.newPassword ? "text-opacityClr-100" : "text-[#BBC3C3]"}`} />
              ) : (
                <EyeOff className={`w-6 h-6 ${formData.newPassword ? "text-opacityClr-100" : "text-[#BBC3C3]"}`} />
              )}
            </button>
          </div>
          <PasswordRequirementsChecklist password={formData.newPassword} />
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
              placeholder="Confirm new password"
              className={`w-full flex items-center gap-2 p-4 rounded-lg border ${
                errors.confirmPassword ? "border-red-500" : "border-opacityClr-50"
              } text-opacityClr-100 outline-none focus:border focus:border-opacityClr-100 placeholder:text-opacityClr-50 placeholder:font-normal placeholder:font-Raleway transition-all duration-300 ease-in-out`}
            />
            <button
              type="button"
              className="absolute right-4 top-4 cursor-pointer"
              onClick={() => setConfirmPasswordVisible((prev) => !prev)}
            >
              {confirmPasswordVisible ? (
                <Eye className={`w-6 h-6 ${formData.confirmPassword ? "text-opacityClr-100" : "text-[#BBC3C3]"}`} />
              ) : (
                <EyeOff className={`w-6 h-6 ${formData.confirmPassword ? "text-opacityClr-100" : "text-[#BBC3C3]"}`} />
              )}
            </button>
          </div>
          <p className="text-opacityClr-50 text-sm font-Raleway font-normal leading-normal">
            Must match the password above.
          </p>
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </div>
      </form>

      <div className="absolute bottom-0 left-0 right-0 bg-white py-3 border-t border-opacityClr-20">
        <button
          type="button"
          className="flex items-center justify-center w-full rounded-md border border-transparent py-3 px-5 bg-opacityClr-100 text-base text-white font-semibold leading-[150%] transition-all duration-300 ease-in-out hover:bg-opacityClr-80 cursor-pointer disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <span className="spinner mr-2" />
              Updating...
            </div>
          ) : (
            "Change Password"
          )}
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordDrawer;
