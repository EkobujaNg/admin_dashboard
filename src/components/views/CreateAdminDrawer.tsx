"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ChevronDown, Copy, Info } from "lucide-react";
import useAdminsAPI from "@/services/useAdminsAPI";
import { createAdminSchema, formatZodErrors } from "@/lib/admins/validation";
import { facilityManagerPasswordSchema } from "@/lib/facility-manager/validation";
import {
  ADMIN_ROLE_OPTIONS,
  formatAdminRoles,
  type AdminRole,
  type CreateAdminPayload,
} from "@/lib/admins/types";

type CreateAdminDrawerProps = {
  closeModal?: () => void;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneCode: string;
  phone: string;
  roles: AdminRole[];
};

function generatePassword() {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const special = "!@#$%^&*";
  const all = lower + upper + numbers + special;

  const pick = (chars: string) => chars.charAt(Math.floor(Math.random() * chars.length));

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const chars = [pick(lower), pick(upper), pick(numbers), pick(special)];
    while (chars.length < 10) {
      chars.push(pick(all));
    }

    const password = chars.sort(() => Math.random() - 0.5).join("");
    if (facilityManagerPasswordSchema.safeParse(password).success) {
      return password;
    }
  }

  return "Admin123!";
}

function createInitialFormState(): FormState {
  return {
    firstName: "",
    lastName: "",
    email: "",
    password: generatePassword(),
    phoneCode: "+234",
    phone: "",
    roles: ["admin"],
  };
}

export default function CreateAdminDrawer({ closeModal }: CreateAdminDrawerProps) {
  const { createAdminAccount, isCreatingAdmin } = useAdminsAPI();
  const rolesDropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormState>(createInitialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [rolesOpen, setRolesOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rolesDropdownRef.current && !rolesDropdownRef.current.contains(event.target as Node)) {
        setRolesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name] && !(name === "phone" && prev.phoneNumber) && !(name === "phoneCode" && prev.phoneCode)) {
        return prev;
      }
      const next = { ...prev };
      delete next[name];
      if (name === "phone") delete next.phoneNumber;
      return next;
    });
  };

  const toggleRole = (role: AdminRole) => {
    setFormData((prev) => {
      const exists = prev.roles.includes(role);
      const roles = exists ? prev.roles.filter((item) => item !== role) : [...prev.roles, role];
      return { ...prev, roles };
    });
    setErrors((prev) => {
      if (!prev.roles) return prev;
      const next = { ...prev };
      delete next.roles;
      return next;
    });
  };

  const handleGeneratePassword = () => {
    setFormData((prev) => ({ ...prev, password: generatePassword() }));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formData.password);
      toast.success("Password copied.");
    } catch {
      toast.error("Failed to copy password.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = createAdminSchema.safeParse({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phoneCode: formData.phoneCode,
      phoneNumber: formData.phone,
      roles: formData.roles,
    });

    if (!validation.success) {
      const formattedErrors = formatZodErrors(validation.error);
      setErrors(formattedErrors);
      toast.error(Object.values(formattedErrors)[0] || "Please fix the errors in the form.");
      return;
    }

    setErrors({});

    const payload: CreateAdminPayload = {
      firstName: validation.data.firstName,
      lastName: validation.data.lastName,
      email: validation.data.email,
      password: validation.data.password,
      phoneNumber: {
        code: validation.data.phoneCode,
        number: validation.data.phoneNumber,
      },
      roles: validation.data.roles,
    };

    createAdminAccount(payload, {
      onSuccess: () => closeModal?.(),
    });
  };

  const rolesLabel =
    formData.roles.length === 0 ? "Select roles" : formatAdminRoles(formData.roles);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4 h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">First name *</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-10 focus:border-transparent outline-none"
          />
          {errors.firstName && <p className="text-xs text-red-600">{errors.firstName}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Last name *</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-10 focus:border-transparent outline-none"
          />
          {errors.lastName && <p className="text-xs text-red-600">{errors.lastName}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Email Address *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-10 focus:border-transparent outline-none"
        />
        {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Default Password</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPasswordInfo(!showPasswordInfo)}
              className="text-primary-10 text-xs flex items-center gap-1"
              onMouseEnter={() => setShowPasswordInfo(true)}
              onMouseLeave={() => setShowPasswordInfo(false)}
            >
              Why?
              <Info className="w-3.5 h-3.5" />
            </button>
            {showPasswordInfo && (
              <div className="absolute right-0 mt-1 w-64 p-2 bg-white border border-gray-200 rounded-lg shadow-lg text-xs text-gray-600 z-10">
                This is a temporary password. The user will be prompted to change it on first login.
              </div>
            )}
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            value={formData.password}
            readOnly
            className="w-full px-4 py-3 pr-40 border border-gray-300 rounded-lg bg-gray-50 outline-none"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
            <button
              type="button"
              onClick={copyToClipboard}
              className="p-1.5 text-gray-500 hover:text-primary-10"
              title="Copy password"
            >
              <Copy className="w-[18px] h-[18px]" />
            </button>
            <button
              type="button"
              onClick={handleGeneratePassword}
              className="text-primary-10 text-sm font-medium px-3 py-1.5 bg-primary-10/10 rounded-md whitespace-nowrap"
            >
              Generate Code
            </button>
          </div>
        </div>
        {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Phone Number</label>
        <div className="flex">
          <select
            name="phoneCode"
            value={formData.phoneCode}
            onChange={handleChange}
            className="w-24 px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-10 focus:border-transparent outline-none"
          >
            <option value="+234">+234</option>
            <option value="+1">+1</option>
            <option value="+44">+44</option>
          </select>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="flex-1 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary-10 focus:border-transparent outline-none"
          />
        </div>
        {(errors.phoneNumber || errors.phoneCode) && (
          <p className="text-xs text-red-600">{errors.phoneNumber || errors.phoneCode}</p>
        )}
      </div>

      <div className="flex flex-col gap-2" ref={rolesDropdownRef}>
        <label className="text-sm font-medium text-gray-700">Roles *</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setRolesOpen((open) => !open)}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 border border-gray-300 rounded-lg bg-white text-left text-sm text-primary-10"
          >
            <span className={formData.roles.length ? "text-primary-10" : "text-gray-400"}>
              {rolesLabel}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${rolesOpen ? "rotate-180" : ""}`} />
          </button>

          {rolesOpen && (
            <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg border border-gray-200 bg-white shadow-lg py-1 max-h-56 overflow-y-auto">
              {ADMIN_ROLE_OPTIONS.map((role) => {
                const checked = formData.roles.includes(role.value);
                return (
                  <label
                    key={role.value}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-Raleway text-primary-10 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleRole(role.value)}
                      className="accent-primary-10"
                    />
                    {role.label}
                  </label>
                );
              })}
            </div>
          )}
        </div>
        {formData.roles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.roles.map((role) => {
              const label = ADMIN_ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-10/10 text-primary-10 text-xs font-Raleway font-semibold"
                >
                  {label}
                  <span aria-hidden>×</span>
                </button>
              );
            })}
          </div>
        )}
        {errors.roles && <p className="text-xs text-red-600">{errors.roles}</p>}
      </div>

      <div className="mt-auto pt-4 border-t border-opacityClr-20">
        <button
          type="submit"
          disabled={isCreatingAdmin}
          className="w-full px-5 py-[14px] rounded-md bg-neutral-lightGreen text-primary-10 font-Raleway font-bold text-base hover:bg-primary-10 hover:text-white transition-colors disabled:opacity-50"
        >
          {isCreatingAdmin ? "Creating..." : "Create admin"}
        </button>
      </div>
    </form>
  );
}
