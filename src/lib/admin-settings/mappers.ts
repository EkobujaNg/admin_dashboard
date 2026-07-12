import type { AdminSettings } from "./types";

function parseAmount(value: unknown): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function asNullableString(value: unknown): string | null {
  if (value == null || value === "") return null;
  return String(value);
}

export function normalizeAdminSettings(raw: Record<string, unknown>): AdminSettings {
  return {
    id: String(raw.id ?? ""),
    referralRewardAmount: parseAmount(raw.referralRewardAmount),
    maxCommissionAmount: parseAmount(raw.maxCommissionAmount),
    createdAt: asNullableString(raw.createdAt),
    updatedAt: asNullableString(raw.updatedAt),
  };
}

export function formatSettingsMoney(amount: number): string {
  return `₦${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
