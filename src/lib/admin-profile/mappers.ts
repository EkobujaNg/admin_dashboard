import type { AdminProfile, AdminProfilePhoneNumber } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asNullableString(value: unknown): string | null {
  if (value == null || value === "") return null;
  return String(value);
}

function normalizePhoneNumber(raw: unknown): AdminProfilePhoneNumber {
  const phone = asRecord(raw);
  return {
    code: String(phone.code ?? "+234"),
    number: String(phone.number ?? ""),
  };
}

export function normalizeAdminProfile(raw: Record<string, unknown>): AdminProfile {
  const roles = Array.isArray(raw.roles) ? raw.roles.map(String) : [];

  return {
    id: String(raw.id ?? ""),
    userId: String(raw.userId ?? ""),
    firstName: String(raw.firstName ?? ""),
    lastName: String(raw.lastName ?? ""),
    email: String(raw.email ?? ""),
    phoneNumber: normalizePhoneNumber(raw.phoneNumber),
    roles,
    isBlocked: Boolean(raw.isBlocked),
    blockedAt: asNullableString(raw.blockedAt),
    createdAt: asNullableString(raw.createdAt),
    emailVerifiedAt: asNullableString(raw.emailVerifiedAt),
    updatedAt: asNullableString(raw.updatedAt),
  };
}

export function getAdminProfileDisplayName(profile?: AdminProfile | null): string {
  if (!profile) return "Admin";
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();
  return fullName || profile.email?.split("@")[0] || "Admin";
}
