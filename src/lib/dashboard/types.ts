export type DashboardChartPeriod = "daily" | "weekly" | "monthly";

export type DashboardChartPoint = {
  period: string;
  amount: number;
};

export type DashboardIncomeCharts = {
  daily: DashboardChartPoint[];
  weekly: DashboardChartPoint[];
  monthly: DashboardChartPoint[];
};

export type DashboardStats = {
  properties: number;
  activeUsers: number;
  totalCommission: number;
  appWalletBalance: number;
};

export type DashboardActionsNeeded = {
  payoutRequests: number;
  buybackRequests: number;
  utilityBillApprovals: number;
  propertyTasksPending: number;
  newPropertyTasks: number;
};

export type AdminDashboard = {
  stats: DashboardStats;
  actionsNeeded: DashboardActionsNeeded;
  charts: {
    income: DashboardIncomeCharts;
  };
};

export type ActionNeededItem = {
  key: keyof DashboardActionsNeeded;
  label: string;
  count: number;
  href: string;
};
