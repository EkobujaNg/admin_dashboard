export type AdminSettings = {
  id: string;
  referralRewardAmount: number;
  maxCommissionAmount: number;
  createdAt: string | null;
  updatedAt: string | null;
};

export type UpdateAdminSettingsPayload = {
  referralRewardAmount: number;
  maxCommissionAmount: number;
};
