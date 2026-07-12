export type PropertyTaskStatus = "new" | "pending" | "complete" | "rejected";

export type AffectPropertyDirection = "plus" | "minus";

export type PropertyTask = {
  id: string;
  propertyId: string;
  propertyName?: string;
  taskAction: string;
  status: PropertyTaskStatus;
  imageUrls: string[];
  report?: string | null;
  remark?: string | null;
  affectProperty: boolean;
  affectPropertyBy: number | null;
  affectPropertyDirection?: AffectPropertyDirection | null;
  isAssistantReport?: boolean;
  createdAt?: string | null;
  submittedAt?: string | null;
  reviewedAt?: string | null;
};

export type PropertyTasksResponse = {
  items: PropertyTask[];
  totalCount: number;
};

export type SetTaskAffectPropertyPayload = {
  affectProperty: boolean;
  remark: string;
};

export function getTaskCreatedByLabel(isAssistantReport?: boolean): string {
  if (isAssistantReport === true) return "Assistant Manager";
  if (isAssistantReport === false) return "Facility Manager";
  return "—";
}

export function getAffectPropertyDirectionLabel(direction?: AffectPropertyDirection | null): string {
  if (direction === "plus") return "Positive";
  if (direction === "minus") return "Negative";
  return "—";
}

export function formatPropertyImpact(
  affectProperty: boolean,
  affectPropertyBy?: number | null,
  direction?: AffectPropertyDirection | null
): string {
  if (affectPropertyBy == null) return "—";
  const sign = direction === "minus" ? "-" : direction === "plus" ? "+" : "";
  const value = `${sign}${affectPropertyBy}%`;
  return affectProperty ? value : `${value} (disabled)`;
}
