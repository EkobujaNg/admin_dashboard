import http from "@/lib/http";
import { normalizePropertyTaskDetail, normalizePropertyTasksResponse } from "./mappers";
import type { PropertyTask, PropertyTasksResponse, SetTaskAffectPropertyPayload } from "./types";

const ADMIN_PROPERTY_TASKS_BASE = "/admin/property-tasks";

export function getPropertyTaskErrorMessage(error: any, fallback: string) {
  const message = error?.response?.data?.message;
  if (Array.isArray(message)) return message.join(", ");
  return (
    error?.response?.data?.responseDescription ||
    error?.response?.data?.responseMessage ||
    message ||
    error?.message ||
    fallback
  );
}

export async function getPropertyTasksByPropertyId(propertyId: string): Promise<PropertyTasksResponse> {
  const { data } = await http.get(`${ADMIN_PROPERTY_TASKS_BASE}/property/${propertyId}`);
  return normalizePropertyTasksResponse(data);
}

export async function getPropertyTaskById(id: string): Promise<PropertyTask> {
  const { data } = await http.get(`${ADMIN_PROPERTY_TASKS_BASE}/${id}`);
  return normalizePropertyTaskDetail(data);
}

export async function setPropertyTaskAffectProperty(
  id: string,
  payload: SetTaskAffectPropertyPayload
): Promise<PropertyTask> {
  const { data } = await http.patch(`${ADMIN_PROPERTY_TASKS_BASE}/${id}/affect-property`, payload);
  return normalizePropertyTaskDetail(data);
}
