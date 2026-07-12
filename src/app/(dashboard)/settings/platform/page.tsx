"use client";

import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CurrencyAmountInput from "@/components/ui/CurrencyAmountInput";
import useAdminSettingsAPI from "@/services/useAdminSettingsAPI";
import { formatSettingsMoney } from "@/lib/admin-settings/mappers";
import {
  formatZodErrors,
  updateAdminSettingsSchema,
} from "@/lib/admin-settings/validation";

type FormState = {
  referralRewardAmount: string;
  maxCommissionAmount: string;
};

function SettingsRow({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1 py-4 border-b border-[#E8EBEB] last:border-b-0">
      <p className="text-sm font-medium text-opacityClr-60 font-Raleway">{label}</p>
      <p className="text-base font-semibold text-primary-10 font-Raleway break-words">{value || "—"}</p>
      {hint ? <p className="text-xs text-opacityClr-60 font-Raleway mt-0.5">{hint}</p> : null}
    </div>
  );
}

const PlatformSettingsPage = () => {
  const { settings, isLoadingSettings, settingsError, saveSettings, isUpdatingSettings } =
    useAdminSettingsAPI({ enableSettings: true });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    referralRewardAmount: "",
    maxCommissionAmount: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const syncFormFromSettings = () => {
    if (!settings) return;
    setFormData({
      referralRewardAmount: String(settings.referralRewardAmount ?? ""),
      maxCommissionAmount: String(settings.maxCommissionAmount ?? ""),
    });
  };

  useEffect(() => {
    syncFormFromSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const handleCancel = () => {
    syncFormFromSettings();
    setErrors({});
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = updateAdminSettingsSchema.safeParse(formData);
    if (!validation.success) {
      const formatted = formatZodErrors(validation.error);
      setErrors(formatted);
      toast.error(Object.values(formatted)[0] || "Please fix the errors in the form.");
      return;
    }

    setErrors({});
    saveSettings(
      {
        referralRewardAmount: validation.data.referralRewardAmount,
        maxCommissionAmount: validation.data.maxCommissionAmount,
      },
      {
        onSuccess: () => setIsEditing(false),
      }
    );
  };

  if (isLoadingSettings) {
    return (
      <div className="flex flex-col gap-6 px-6 w-full">
        <Breadcrumb items={[{ label: "Settings", href: "/settings" }, { label: "Platform Settings" }]} />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-opacityClr-10 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (settingsError && !settings) {
    return (
      <div className="flex flex-col gap-6 px-6 w-full">
        <Breadcrumb items={[{ label: "Settings", href: "/settings" }, { label: "Platform Settings" }]} />
        <p className="text-sm text-red-600 font-Raleway">Failed to load settings. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-6 w-full pb-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: "Settings", href: "/settings" }, { label: "Platform Settings" }]} />
          <p className="text-sm font-Raleway text-opacityClr-60 mt-2">
            Manage referral rewards and commission limits for the platform.
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-neutral-lightGreen text-primary-10 font-Raleway font-semibold text-sm hover:bg-primary-10 hover:text-white transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit settings
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="w-full rounded-2xl border border-opacityClr-30 bg-white px-6 py-2">
          <SettingsRow
            label="Referral reward amount"
            value={formatSettingsMoney(settings?.referralRewardAmount ?? 0)}
            hint="Amount credited when a referral converts."
          />
          <SettingsRow
            label="Max commission amount"
            value={formatSettingsMoney(settings?.maxCommissionAmount ?? 0)}
            hint="Upper limit for commission payouts."
          />
        </div>
      ) : (
        <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit} autoComplete="off">
          <div className="w-full rounded-2xl border border-opacityClr-30 bg-white p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="referralRewardAmount"
                className="text-sm font-Raleway font-semibold text-primary-10"
              >
                Referral reward amount (₦)
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-opacityClr-50 px-4 py-3 focus-within:border-primary-10">
                <span className="text-primary-10 font-Raleway font-semibold">₦</span>
                <CurrencyAmountInput
                  id="referralRewardAmount"
                  value={formData.referralRewardAmount}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, referralRewardAmount: value }));
                    setErrors((prev) => {
                      if (!prev.referralRewardAmount) return prev;
                      const next = { ...prev };
                      delete next.referralRewardAmount;
                      return next;
                    });
                  }}
                  placeholder="0.00"
                  disabled={isUpdatingSettings}
                  size="md"
                  inputClassName="!text-base font-Raleway"
                />
              </div>
              {errors.referralRewardAmount && (
                <p className="text-xs text-red-600">{errors.referralRewardAmount}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="maxCommissionAmount"
                className="text-sm font-Raleway font-semibold text-primary-10"
              >
                Max commission amount (₦)
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-opacityClr-50 px-4 py-3 focus-within:border-primary-10">
                <span className="text-primary-10 font-Raleway font-semibold">₦</span>
                <CurrencyAmountInput
                  id="maxCommissionAmount"
                  value={formData.maxCommissionAmount}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, maxCommissionAmount: value }));
                    setErrors((prev) => {
                      if (!prev.maxCommissionAmount) return prev;
                      const next = { ...prev };
                      delete next.maxCommissionAmount;
                      return next;
                    });
                  }}
                  placeholder="0.00"
                  disabled={isUpdatingSettings}
                  size="md"
                  inputClassName="!text-base font-Raleway"
                />
              </div>
              {errors.maxCommissionAmount && (
                <p className="text-xs text-red-600">{errors.maxCommissionAmount}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isUpdatingSettings}
              className="flex-1 px-5 py-4 rounded-lg border border-opacityClr-50 text-primary-10 font-Raleway font-bold text-base hover:bg-[#F3F4F4] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdatingSettings}
              className="flex-1 px-5 py-4 rounded-lg bg-opacityClr-100 text-white font-Raleway font-bold text-base hover:bg-primary-10 transition-colors disabled:opacity-50"
            >
              {isUpdatingSettings ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PlatformSettingsPage;
