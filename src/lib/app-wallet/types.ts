export type AppWalletBalance = {
  balance: number;
  profitBalance: number;
  /** @deprecated Prefer profitBalance; kept for buyback screens if API still returns it */
  buyBackBalance: number;
  currency: string;
};
