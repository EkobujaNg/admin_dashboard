"use client";

import React, { useEffect, useRef, useState } from "react";
import { Copy, Upload, Info, Loader2, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { uploadFacilityManagerId } from "@/lib/facility-manager/media";
import { getPropertyErrorMessage } from "@/lib/property/api";
import {
  createFacilityManagerSchema,
  facilityManagerPasswordSchema,
  formatZodErrors,
} from "@/lib/facility-manager/validation";
import useFacilityManagerAPI from "@/services/useFacilityManagerAPI";

type CreateFacilityManagerDrawerProps = {
  closeModal?: () => void;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneCode: string;
  phone: string;
};

type UploadedId = {
  url: string;
  fileName: string;
  previewUrl: string;
};

function getSubmissionValues(form: HTMLFormElement, password: string) {
  const fd = new FormData(form);

  return {
    firstName: String(fd.get("firstName") ?? "").trim(),
    lastName: String(fd.get("lastName") ?? "").trim(),
    email: String(fd.get("email") ?? "").trim(),
    password,
    phoneCode: String(fd.get("phoneCode") ?? "+234").trim(),
    phoneNumber: String(fd.get("phone") ?? "").trim(),
  };
}

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
  };
}

const CreateFacilityManagerDrawer = ({ closeModal }: CreateFacilityManagerDrawerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createManager, isCreatingManager } = useFacilityManagerAPI();

  const [formData, setFormData] = useState<FormState>(createInitialFormState);
  const [uploadedId, setUploadedId] = useState<UploadedId | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [isUploadingId, setIsUploadingId] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev, [name]: "" };
      if (name === "phone") next.phoneNumber = "";
      return next;
    });
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => (prev[name as keyof FormState] === value ? prev : { ...prev, [name]: value }));
  };

  const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingId(true);
    setErrors((prev) => ({ ...prev, idDocument: "" }));

    const previewUrl = URL.createObjectURL(file);

    try {
      const url = await uploadFacilityManagerId(file);
      setUploadedId({ url, fileName: file.name, previewUrl });
      toast.success("ID document uploaded.");
    } catch (error: any) {
      URL.revokeObjectURL(previewUrl);
      setUploadedId(null);
      toast.error(getPropertyErrorMessage(error, "Failed to upload ID document."));
    } finally {
      setIsUploadingId(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveUploadedId = () => {
    if (uploadedId?.previewUrl) {
      URL.revokeObjectURL(uploadedId.previewUrl);
    }
    setUploadedId(null);
    setErrors((prev) => ({ ...prev, idDocument: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      if (uploadedId?.previewUrl) {
        URL.revokeObjectURL(uploadedId.previewUrl);
      }
    };
  }, [uploadedId?.previewUrl]);

  const handleGeneratePassword = () => {
    setFormData((prev) => ({ ...prev, password: generatePassword() }));
    setErrors((prev) => ({ ...prev, password: "" }));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formData.password);
      toast.success("Password copied to clipboard.");
    } catch {
      toast.error("Unable to copy password.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submission = getSubmissionValues(e.currentTarget, formData.password);
    setFormData((prev) => ({
      ...prev,
      firstName: submission.firstName,
      lastName: submission.lastName,
      email: submission.email,
      phoneCode: submission.phoneCode,
      phone: submission.phoneNumber,
    }));

    const validation = createFacilityManagerSchema.safeParse(submission);

    if (!validation.success) {
      const formattedErrors = formatZodErrors(validation.error);
      setErrors(formattedErrors);
      toast.error(Object.values(formattedErrors)[0] || "Please fix the errors in the form.");
      return;
    }

    if (!uploadedId?.url) {
      setErrors((prev) => ({ ...prev, idDocument: "Please upload a government-issued ID." }));
      toast.error("Please upload a government-issued ID.");
      return;
    }

    createManager(
      {
        firstName: validation.data.firstName,
        lastName: validation.data.lastName,
        email: validation.data.email,
        password: validation.data.password,
        phoneNumber: {
          code: validation.data.phoneCode,
          number: validation.data.phoneNumber,
        },
        idCard: uploadedId.url,
      },
      {
        onSuccess: () => {
          closeModal?.();
        },
      }
    );
  };

  const isSubmitting = isCreatingManager;

  const inputClassName = (field: string) =>
    `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-10 focus:border-transparent ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="flex flex-col gap-6 py-6 relative h-full">
      <div>
        <h3 className="text-xl font-Raleway font-bold text-primary-10">Create Facility Manager</h3>
        <p className="text-sm text-gray-600 mt-1">Fill in the details below to create a new facility manager account</p>
      </div>

      <form
        id="create-facility-manager-form"
        noValidate
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 pb-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              onInput={handleInput}
              className={inputClassName("firstName")}
              placeholder="Enter first name"
              autoComplete="given-name"
            />
            {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              onInput={handleInput}
              className={inputClassName("lastName")}
              placeholder="Enter last name"
              autoComplete="family-name"
            />
            {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onInput={handleInput}
            className={inputClassName("email")}
            placeholder="Enter email address"
            autoComplete="email"
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
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
              className={`w-full px-4 py-3 pr-24 border rounded-lg bg-gray-50 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <button type="button" onClick={copyToClipboard} className="p-1.5 text-gray-500 hover:text-primary-10" title="Copy password">
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
          {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Phone Number</label>
          <div className="flex">
            <select
              name="phoneCode"
              value={formData.phoneCode}
              onChange={handleInputChange}
              className="w-24 px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-10 focus:border-transparent"
            >
              <option value="+234">+234</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
            </select>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              onInput={handleInput}
              className={`flex-1 px-4 py-3 border border-l-0 rounded-r-lg focus:ring-2 focus:ring-primary-10 focus:border-transparent ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter phone number"
            />
          </div>
          {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Upload Any Government Issued ID</label>

          {uploadedId ? (
            <div className="rounded-lg border border-green-300 bg-green-50/60 p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-green-800">ID uploaded</p>
                    <p className="text-xs text-green-700 truncate">{uploadedId.fileName}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveUploadedId}
                  className="p-1.5 rounded-md border border-green-200 text-green-700 hover:bg-green-100"
                  aria-label="Remove uploaded ID"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <img
                src={uploadedId.previewUrl}
                alt="Uploaded government ID preview"
                className="w-full max-h-48 object-contain rounded-md border border-green-200 bg-white"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-medium text-primary-10 hover:underline self-start"
              >
                Replace document
              </button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                errors.idDocument ? "border-red-500" : "border-gray-300"
              }`}
            >
              <button
                type="button"
                onClick={() => !isUploadingId && fileInputRef.current?.click()}
                disabled={isUploadingId}
                className={`w-full flex flex-col items-center justify-center ${isUploadingId ? "cursor-wait opacity-60" : "cursor-pointer"}`}
              >
                {isUploadingId ? (
                  <>
                    <Loader2 className="w-8 h-8 text-primary-10 mb-2 animate-spin" />
                    <p className="text-sm text-gray-600">Uploading...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      <span className="text-primary-10 font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">JPEG, PNG, or WebP (max. 10MB)</p>
                  </>
                )}
              </button>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleIdUpload}
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            disabled={isUploadingId}
          />
          {errors.idDocument && <p className="text-xs text-red-500">{errors.idDocument}</p>}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting || isUploadingId}
            className="w-full bg-primary-10 text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Creating Facility Manager..." : "Create Facility Manager"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFacilityManagerDrawer;
