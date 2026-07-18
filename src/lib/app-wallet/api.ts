import http from "@/lib/http";
import type { AppWalletBalance } from "./types";

const ADMIN_APP_WALLET_BASE = "/admin/app-wallet";

function unwrapData<T>(data: T | { data: T }): T {
  if (data && typeof data === "object" && "data" in data && (data as { data: T }).data) {
    return (data as { data: T }).data;
  }
  return data as T;
}

function normalizeAppWalletBalance(raw: Record<string, unknown>): AppWalletBalance {
  const profitBalance = Number(raw.profitBalance ?? 0);
  return {
    balance: Number(raw.balance ?? 0),
    profitBalance,
    buyBackBalance: Number(raw.buyBackBalance ?? 0),
    currency: String(raw.currency ?? "NGN"),
  };
}

export async function getAppWalletBalance(): Promise<AppWalletBalance> {
  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    `${ADMIN_APP_WALLET_BASE}/balance`
  );
  return normalizeAppWalletBalance(unwrapData(data) as Record<string, unknown>);
}
