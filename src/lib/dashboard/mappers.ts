import type {
  ActionNeededItem,
  AdminDashboard,
  DashboardActionsNeeded,
  DashboardChartPoint,
  DashboardIncomeCharts,
  DashboardStats,
} from "./types";

function parseAmount(value: unknown): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function normalizeChartPoints(raw: unknown): DashboardChartPoint[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    return {
      period: String(row.period ?? ""),
      amount: parseAmount(row.amount),
    };
  });
}

function normalizeIncomeCharts(raw: unknown): DashboardIncomeCharts {
  const charts = (raw ?? {}) as Record<string, unknown>;
  return {
    daily: normalizeChartPoints(charts.daily),
    weekly: normalizeChartPoints(charts.weekly),
    monthly: normalizeChartPoints(charts.monthly),
  };
}

function normalizeStats(raw: unknown): DashboardStats {
  const stats = (raw ?? {}) as Record<string, unknown>;
  return {
    properties: parseAmount(stats.properties),
    activeUsers: parseAmount(stats.activeUsers),
    totalCommission: parseAmount(stats.totalCommission),
    appWalletBalance: parseAmount(stats.appWalletBalance),
  };
}

function normalizeActionsNeeded(raw: unknown): DashboardActionsNeeded {
  const actions = (raw ?? {}) as Record<string, unknown>;
  return {
    payoutRequests: parseAmount(actions.payoutRequests),
    buybackRequests: parseAmount(actions.buybackRequests),
    utilityBillApprovals: parseAmount(actions.utilityBillApprovals),
    propertyTasksPending: parseAmount(actions.propertyTasksPending),
    newPropertyTasks: parseAmount(actions.newPropertyTasks),
  };
}

export function normalizeAdminDashboard(raw: Record<string, unknown>): AdminDashboard {
  const charts = (raw.charts ?? {}) as Record<string, unknown>;
  return {
    stats: normalizeStats(raw.stats),
    actionsNeeded: normalizeActionsNeeded(raw.actionsNeeded),
    charts: {
      income: normalizeIncomeCharts(charts.income),
    },
  };
}

export function getActionNeededItems(actions: DashboardActionsNeeded): ActionNeededItem[] {
  const items: ActionNeededItem[] = [
    {
      key: "payoutRequests",
      label: "payout request",
      count: actions.payoutRequests,
      href: "/withdrawals",
    },
    {
      key: "buybackRequests",
      label: "buyback request",
      count: actions.buybackRequests,
      href: "/buyback",
    },
    {
      key: "utilityBillApprovals",
      label: "utility bill approval",
      count: actions.utilityBillApprovals,
      href: "/accounts",
    },
    {
      key: "propertyTasksPending",
      label: "pending property task",
      count: actions.propertyTasksPending,
      href: "/properties",
    },
    {
      key: "newPropertyTasks",
      label: "new property task",
      count: actions.newPropertyTasks,
      href: "/properties",
    },
  ];

  return items.filter((item) => item.count > 0);
}

export function pluralizeLabel(count: number, label: string): string {
  if (count === 1) return label;
  if (label.endsWith("y") && !label.endsWith("ay")) {
    return `${label.slice(0, -1)}ies`;
  }
  return `${label}s`;
}

export function formatChartPeriodLabel(period: string, range: "daily" | "weekly" | "monthly"): string {
  if (!period) return "—";

  if (range === "monthly") {
    const [year, month] = period.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);
    if (Number.isNaN(date.getTime())) return period;
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  }

  const date = new Date(period);
  if (Number.isNaN(date.getTime())) return period;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDashboardMoney(amount: number): string {
  return `₦${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCompactMoney(amount: number): string {
  const value = Number(amount || 0);
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(1)}K`;
  return `₦${value.toLocaleString()}`;
}
