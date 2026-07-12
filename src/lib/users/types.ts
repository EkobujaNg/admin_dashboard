export type AdminUserFilter = "all" | "pending_utility_bill" | "blocked" | "kyc_complete";

type AdminUserPhoneNumber = {
  code: string;
  number: string;
};

export type AdminUserKyc = {
  nin: boolean;
  bvn: boolean;
  utilityBill: boolean;
};

export type AdminUserAddress = {
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
};

export type AdminUserProfile = {
  profilePicture: string | null;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  gender: string | null;
  address: AdminUserAddress;
  kyc: AdminUserKyc;
  utilityBillUrl: string | null;
};

export type AdminUserWallet = {
  balance: number;
  referralBalance: number;
  currency: string;
};

export type AdminUserNextOfKin = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string | AdminUserPhoneNumber | null;
  relationship?: string;
  dateOfBirth?: string;
  [key: string]: unknown;
} | null;

export type AdminUserRecord = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phone: AdminUserPhoneNumber | null;
  emailVerified: boolean;
  kyc: AdminUserKyc;
  hasPin: boolean;
  isBlocked: boolean;
  blockedAt: string | null;
  createdAt: string | null;
  [key: string]: unknown;
};

export type AdminUserDetail = {
  id: string;
  email: string;
  phoneNumber: string;
  phone: AdminUserPhoneNumber | null;
  referralCode: string;
  emailVerifiedAt: string | null;
  hasPin: boolean;
  isBlocked: boolean;
  blockedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  profile: AdminUserProfile;
  wallet: AdminUserWallet;
  nextOfKin: AdminUserNextOfKin;
};

export type PaginatedAdminUsers = {
  pageItems: AdminUserRecord[];
  currentPage: number;
  numberOfPages: number;
  totalItems: number;
  hasMore: boolean;
};

export type AdminUserStats = {
  allUsers: number;
  pendingUtilityBillReview: number;
  blockedUsers: number;
  kycCompleteUsers: number;
};

export type GetAdminUsersParams = {
  page?: number;
  limit?: number;
  q?: string;
  filter?: AdminUserFilter;
};
