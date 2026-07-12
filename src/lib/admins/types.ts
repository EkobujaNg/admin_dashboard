export type AdminRole = "super_admin" | "admin" | "moderator" | "finance";

export const ADMIN_ROLE_OPTIONS: Array<{ value: AdminRole; label: string }> = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "moderator", label: "Moderator" },
  { value: "finance", label: "Finance" },
];

type PhoneNumberPayload = {
  code: string;
  number: string;
};

export type AdminAccount = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: PhoneNumberPayload;
  roles: AdminRole[];
  isBlocked: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

export type PaginatedAdmins = {
  pageItems: AdminAccount[];
  currentPage: number;
  numberOfPages: number;
  totalItems: number;
  hasMore: boolean;
  pageSize: number;
};

export type GetAdminsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type CreateAdminPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: PhoneNumberPayload;
  roles: AdminRole[];
};

export type CreateAdminResponse = {
  id?: string;
  message?: string;
  responseDescription?: string;
  responseMessage?: string;
  [key: string]: unknown;
};

export function formatAdminRole(role: string): string {
  return ADMIN_ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role.replace(/_/g, " ");
}

export function formatAdminRoles(roles: string[]): string {
  if (!roles.length) return "—";
  return roles.map(formatAdminRole).join(", ");
}
