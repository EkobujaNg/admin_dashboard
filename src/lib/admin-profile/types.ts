export type AdminProfilePhoneNumber = {
  code: string;
  number: string;
};

export type AdminProfile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: AdminProfilePhoneNumber;
  roles: string[];
  isBlocked: boolean;
  blockedAt: string | null;
  createdAt: string | null;
  emailVerifiedAt: string | null;
  updatedAt: string | null;
};

export type UpdateAdminProfilePayload = {
  firstName: string;
  lastName: string;
  phoneNumber: AdminProfilePhoneNumber;
};
