import type {
  AdminUserAddress,
  AdminUserDetail,
  AdminUserKyc,
  AdminUserNextOfKin,
  AdminUserProfile,
  AdminUserRecord,
  AdminUserStats,
  AdminUserWallet,
  PaginatedAdminUsers,
} from "./types";

function formatPhone(raw: unknown): { display: string; phone: { code: string; number: string } | null } {
  if (!raw) return { display: "", phone: null };

  if (typeof raw === "string") {
    return { display: raw, phone: null };
  }

  if (typeof raw === "object") {
    const phone = raw as Record<string, unknown>;
    const code = String(phone.code ?? "");
    const number = String(phone.number ?? "");
    return {
      display: [code, number].filter(Boolean).join(" ").trim(),
      phone: { code, number },
    };
  }

  return { display: String(raw), phone: null };
}

function normalizeKyc(raw: unknown): AdminUserKyc {
  const kyc = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  return {
    nin: Boolean(kyc.nin),
    bvn: Boolean(kyc.bvn),
    utilityBill: Boolean(kyc.utilityBill),
  };
}

function normalizeAddress(raw: unknown): AdminUserAddress {
  const address = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  return {
    address: address.address ? String(address.address) : null,
    city: address.city ? String(address.city) : null,
    state: address.state ? String(address.state) : null,
    country: address.country ? String(address.country) : null,
  };
}

function normalizeProfile(raw: unknown): AdminUserProfile {
  const profile = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  return {
    profilePicture: profile.profilePicture ? String(profile.profilePicture) : null,
    firstName: String(profile.firstName ?? ""),
    lastName: String(profile.lastName ?? ""),
    dateOfBirth: profile.dateOfBirth ? String(profile.dateOfBirth) : null,
    gender: profile.gender ? String(profile.gender) : null,
    address: normalizeAddress(profile.address),
    kyc: normalizeKyc(profile.kyc),
    utilityBillUrl: profile.utilityBillUrl ? String(profile.utilityBillUrl) : null,
  };
}

function normalizeWallet(raw: unknown): AdminUserWallet {
  const wallet = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  return {
    balance: Number(wallet.balance ?? 0),
    referralBalance: Number(wallet.referralBalance ?? 0),
    currency: String(wallet.currency ?? "NGN"),
  };
}

function normalizeNextOfKin(raw: unknown): AdminUserNextOfKin {
  if (!raw || typeof raw !== "object") return null;

  const kin = raw as Record<string, unknown>;
  const { display } = formatPhone(kin.phoneNumber);

  return {
    ...kin,
    firstName: kin.firstName ? String(kin.firstName) : "",
    lastName: kin.lastName ? String(kin.lastName) : "",
    email: kin.email ? String(kin.email) : "",
    phoneNumber: display || null,
    relationship: kin.relationship ? String(kin.relationship) : "",
    dateOfBirth: kin.dateOfBirth ? String(kin.dateOfBirth) : undefined,
  };
}

function normalizeAdminUser(raw: Record<string, unknown>): AdminUserRecord {
  const id = String(raw.id ?? "");
  const { display, phone } = formatPhone(raw.phoneNumber);
  const profile = raw.profile && typeof raw.profile === "object" ? (raw.profile as Record<string, unknown>) : null;

  return {
    ...raw,
    id,
    userId: id,
    firstName: String(raw.firstName ?? profile?.firstName ?? ""),
    lastName: String(raw.lastName ?? profile?.lastName ?? ""),
    email: String(raw.email ?? ""),
    phoneNumber: display,
    phone,
    emailVerified: Boolean(raw.emailVerified ?? raw.emailVerifiedAt),
    kyc: normalizeKyc(raw.kyc ?? profile?.kyc),
    hasPin: Boolean(raw.hasPin),
    isBlocked: Boolean(raw.isBlocked),
    blockedAt: raw.blockedAt ? String(raw.blockedAt) : null,
    createdAt: raw.createdAt ? String(raw.createdAt) : null,
  };
}

export function normalizeAdminUserDetail(raw: Record<string, unknown>): AdminUserDetail {
  const { display, phone } = formatPhone(raw.phoneNumber);
  const profile = normalizeProfile(raw.profile);

  return {
    id: String(raw.id ?? ""),
    email: String(raw.email ?? ""),
    phoneNumber: display,
    phone,
    referralCode: String(raw.referralCode ?? ""),
    emailVerifiedAt: raw.emailVerifiedAt ? String(raw.emailVerifiedAt) : null,
    hasPin: Boolean(raw.hasPin),
    isBlocked: Boolean(raw.isBlocked),
    blockedAt: raw.blockedAt ? String(raw.blockedAt) : null,
    createdAt: raw.createdAt ? String(raw.createdAt) : null,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : null,
    profile,
    wallet: normalizeWallet(raw.wallet),
    nextOfKin: normalizeNextOfKin(raw.nextOfKin),
  };
}

export function normalizePaginatedAdminUsers(data: Record<string, unknown>): PaginatedAdminUsers {
  const rawItems = data.items || data.pageItems || data.data || [];
  const pageItems = Array.isArray(rawItems)
    ? rawItems.map((item) => normalizeAdminUser(item as Record<string, unknown>))
    : [];

  return {
    pageItems,
    currentPage: Number(data.page ?? data.currentPage ?? data.pageNumber ?? 1),
    numberOfPages: Number(data.totalPages ?? data.numberOfPages ?? 1),
    totalItems: Number(data.total ?? data.totalItems ?? data.totalCount ?? pageItems.length),
    hasMore: Boolean(data.hasMore),
  };
}

export function normalizeAdminUserStats(data: Record<string, unknown>): AdminUserStats {
  return {
    allUsers: Number(data.allUsers ?? 0),
    pendingUtilityBillReview: Number(data.pendingUtilityBillReview ?? 0),
    blockedUsers: Number(data.blockedUsers ?? 0),
    kycCompleteUsers: Number(data.kycCompleteUsers ?? 0),
  };
}
