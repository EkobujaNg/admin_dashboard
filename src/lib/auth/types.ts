export type LoginPayload = {
  email: string;
  password: string;
  portal: string;
};

export type LoginResponse = {
  userId: string;
  email: string;
  accountType?: string;
  role?: string;
  roles?: string[];
  fullName?: string;
  profilePicture?: string | null;
  hasPin?: boolean;
  accessToken: string;
  refreshToken: string;
};

export type AuthUser = {
  userId: string;
  email: string;
  fullName?: string;
  role?: string;
  roles?: string[];
  profilePicture?: string | null;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ForgotPasswordResetPayload = {
  email: string;
  code: string;
  newPassword: string;
};
