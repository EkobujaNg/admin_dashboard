"use client";

import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import Breadcrumb from "@/components/ui/Breadcrumb";
import useAdminProfileAPI from "@/services/useAdminProfileAPI";
import { formatAdminRoles } from "@/lib/admins/types";
import { getAdminProfileDisplayName } from "@/lib/admin-profile/mappers";
import {
  formatZodErrors,
  updateAdminProfileSchema,
} from "@/lib/admin-profile/validation";

type FormState = {
  firstName: string;
  lastName: string;
  phoneCode: string;
  phoneNumber: string;
};

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  phoneCode: "+234",
  phoneNumber: "",
};

function ProfileRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-4 border-b border-[#E8EBEB] last:border-b-0">
      <p className="text-sm font-medium text-opacityClr-60 font-Raleway">{label}</p>
      <p className="text-base font-semibold text-primary-10 font-Raleway break-words">{value || "—"}</p>
    </div>
  );
}

const PersonalInformation = () => {
  const { profile, isLoadingProfile, profileError, saveProfile, isUpdatingProfile } =
    useAdminProfileAPI({ enableProfile: true });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const syncFormFromProfile = () => {
    if (!profile) return;
    setFormData({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      phoneCode: profile.phoneNumber?.code || "+234",
      phoneNumber: profile.phoneNumber?.number || "",
    });
  };

  useEffect(() => {
    syncFormFromProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleCancel = () => {
    syncFormFromProfile();
    setErrors({});
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const validation = updateAdminProfileSchema.safeParse(formData);
    if (!validation.success) {
      const formatted = formatZodErrors(validation.error);
      setErrors(formatted);
      toast.error(Object.values(formatted)[0] || "Please fix the errors in the form.");
      return;
    }

    setErrors({});
    saveProfile(
      {
        firstName: validation.data.firstName,
        lastName: validation.data.lastName,
        phoneNumber: {
          code: validation.data.phoneCode,
          number: validation.data.phoneNumber,
        },
      },
      {
        onSuccess: () => setIsEditing(false),
      }
    );
  };

  if (isLoadingProfile) {
    return (
      <div className="flex flex-col gap-6 px-6 w-full">
        <Breadcrumb items={[{ label: "Settings", href: "/settings" }, { label: "Account Information" }]} />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-opacityClr-10 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (profileError && !profile) {
    return (
      <div className="flex flex-col gap-6 px-6 w-full">
        <Breadcrumb items={[{ label: "Settings", href: "/settings" }, { label: "Account Information" }]} />
        <p className="text-sm text-red-600 font-Raleway">Failed to load profile. Please try again.</p>
      </div>
    );
  }

  const phoneDisplay = profile
    ? `${profile.phoneNumber?.code || ""} ${profile.phoneNumber?.number || ""}`.trim() || "—"
    : "—";

  return (
    <div className="flex flex-col gap-6 px-6 w-full pb-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Breadcrumb items={[{ label: "Settings", href: "/settings" }, { label: "Account Information" }]} />
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-neutral-lightGreen text-primary-10 font-Raleway font-semibold text-sm hover:bg-primary-10 hover:text-white transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit profile
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="w-full rounded-2xl border border-opacityClr-30 bg-white px-6 py-2">
          <ProfileRow label="Full name" value={getAdminProfileDisplayName(profile)} />
          <ProfileRow label="First name" value={profile?.firstName} />
          <ProfileRow label="Last name" value={profile?.lastName} />
          <ProfileRow label="Email address" value={profile?.email} />
          <ProfileRow label="Phone number" value={phoneDisplay} />
          <ProfileRow label="Roles" value={formatAdminRoles(profile?.roles || [])} />
        </div>
      ) : (
        <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit} autoComplete="off">
          <div className="w-full rounded-2xl border border-opacityClr-30 bg-white p-6 flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="text-sm font-Raleway font-semibold text-primary-10">
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={`w-full p-4 rounded-lg border outline-none focus:border-primary-10 ${
                    errors.firstName ? "border-red-500" : "border-opacityClr-50"
                  }`}
                />
                {errors.firstName && <p className="text-xs text-red-600">{errors.firstName}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="text-sm font-Raleway font-semibold text-primary-10">
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className={`w-full p-4 rounded-lg border outline-none focus:border-primary-10 ${
                    errors.lastName ? "border-red-500" : "border-opacityClr-50"
                  }`}
                />
                {errors.lastName && <p className="text-xs text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-Raleway font-semibold text-primary-10">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={profile?.email || ""}
                disabled
                readOnly
                className="w-full p-4 rounded-lg bg-[#E8EBEB] border-none text-opacityClr-100 outline-none cursor-not-allowed"
              />
              <p className="text-xs text-opacityClr-60 font-Raleway">Email cannot be changed.</p>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phoneNumber" className="text-sm font-Raleway font-semibold text-primary-10">
                Phone number
              </label>
              <div className="flex w-full">
                <select
                  name="phoneCode"
                  value={formData.phoneCode}
                  onChange={handleChange}
                  className="w-24 px-3 py-4 border border-r-0 border-opacityClr-50 rounded-l-lg outline-none focus:border-primary-10 bg-white"
                >
                  <option value="+234">+234</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className={`flex-1 px-4 py-4 border border-l-0 rounded-r-lg outline-none focus:border-primary-10 ${
                    errors.phoneNumber ? "border-red-500" : "border-opacityClr-50"
                  }`}
                />
              </div>
              {(errors.phoneNumber || errors.phoneCode) && (
                <p className="text-xs text-red-600">{errors.phoneNumber || errors.phoneCode}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-Raleway font-semibold text-primary-10">Roles</label>
              <input
                type="text"
                value={formatAdminRoles(profile?.roles || [])}
                disabled
                readOnly
                className="w-full p-4 rounded-lg bg-[#E8EBEB] border-none text-opacityClr-100 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isUpdatingProfile}
              className="flex-1 px-5 py-4 rounded-lg border border-opacityClr-50 text-primary-10 font-Raleway font-bold text-base hover:bg-[#F3F4F4] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="flex-1 px-5 py-4 rounded-lg bg-opacityClr-100 text-white font-Raleway font-bold text-base hover:bg-primary-10 transition-colors disabled:opacity-50"
            >
              {isUpdatingProfile ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PersonalInformation;
