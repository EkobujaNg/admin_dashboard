export type AdminLogAction =
  | "withdrawal_completed"
  | "withdrawal_rejected"
  | "buyback_approved"
  | "buyback_declined"
  | "buyback_balance_topped_up"
  | "settings_updated"
  | "user_blocked"
  | "user_unblocked"
  | "admin_blocked"
  | "admin_unblocked"
  | "admin_created"
  | "facility_manager_blocked"
  | "facility_manager_unblocked"
  | "facility_manager_created"
  | "facility_manager_property_assigned"
  | "facility_manager_property_removed"
  | "utility_bill_verified"
  | "property_task_affect_property_updated"
  | "property_created"
  | "property_updated"
  | "property_hidden_toggled"
  | "property_commission_updated"
  | "property_ekobuja_buyback_updated"
  | "property_featured_added"
  | "property_quarterly_report_uploaded"
  | "property_quarterly_report_updated"
  | string;

export type AdminLogResourceType =
  | "withdrawal_request"
  | "buyback_request"
  | "user"
  | "admin"
  | "facility_manager"
  | "property"
  | "property_task"
  | "settings"
  | "app_wallet"
  | string;

export type AdminLog = {
  id: string;
  action: AdminLogAction;
  resourceType: AdminLogResourceType;
  resourceId: string | null;
  adminUserId: string | null;
  adminEmail: string | null;
  adminName: string | null;
  description: string | null;
  remark: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string | null;
};

export type PaginatedAdminLogs = {
  pageItems: AdminLog[];
  currentPage: number;
  numberOfPages: number;
  totalItems: number;
  hasMore: boolean;
  pageSize: number;
};

export type GetAdminLogsParams = {
  page?: number;
  limit?: number;
  action?: string;
  resourceType?: string;
  adminUserId?: string;
};

export const ADMIN_LOG_ACTION_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All actions" },
  { value: "withdrawal_completed", label: "Withdrawal completed" },
  { value: "withdrawal_rejected", label: "Withdrawal rejected" },
  { value: "buyback_approved", label: "Buyback approved" },
  { value: "buyback_declined", label: "Buyback declined" },
  { value: "buyback_balance_topped_up", label: "Buyback balance topped up" },
  { value: "settings_updated", label: "Settings updated" },
  { value: "user_blocked", label: "User blocked" },
  { value: "user_unblocked", label: "User unblocked" },
  { value: "admin_blocked", label: "Admin blocked" },
  { value: "admin_unblocked", label: "Admin unblocked" },
  { value: "admin_created", label: "Admin created" },
  { value: "facility_manager_blocked", label: "FM blocked" },
  { value: "facility_manager_unblocked", label: "FM unblocked" },
  { value: "facility_manager_created", label: "FM created" },
  { value: "facility_manager_property_assigned", label: "FM property assigned" },
  { value: "facility_manager_property_removed", label: "FM property removed" },
  { value: "utility_bill_verified", label: "Utility bill verified" },
  { value: "property_task_affect_property_updated", label: "Property task impact updated" },
  { value: "property_created", label: "Property created" },
  { value: "property_updated", label: "Property updated" },
  { value: "property_hidden_toggled", label: "Property hidden toggled" },
  { value: "property_commission_updated", label: "Property commission updated" },
  { value: "property_ekobuja_buyback_updated", label: "Property buyback updated" },
  { value: "property_featured_added", label: "Property featured" },
  { value: "property_quarterly_report_uploaded", label: "Quarterly report uploaded" },
  { value: "property_quarterly_report_updated", label: "Quarterly report updated" },
];

export const ADMIN_LOG_RESOURCE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All resources" },
  { value: "withdrawal_request", label: "Withdrawal request" },
  { value: "buyback_request", label: "Buyback request" },
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
  { value: "facility_manager", label: "Facility manager" },
  { value: "property", label: "Property" },
  { value: "property_task", label: "Property task" },
  { value: "settings", label: "Settings" },
  { value: "app_wallet", label: "App wallet" },
];

export function formatAdminLogAction(action?: string | null): string {
  if (!action) return "—";
  const match = ADMIN_LOG_ACTION_OPTIONS.find((option) => option.value === action);
  if (match && match.value !== "all") return match.label;
  return action.replace(/_/g, " ");
}

export function formatAdminLogResourceType(resourceType?: string | null): string {
  if (!resourceType) return "—";
  const match = ADMIN_LOG_RESOURCE_OPTIONS.find((option) => option.value === resourceType);
  if (match && match.value !== "all") return match.label;
  return resourceType.replace(/_/g, " ");
}
