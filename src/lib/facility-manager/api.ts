import http from "@/lib/http";
import { normalizeProperty } from "@/lib/property/mappers";
import type { PropertyRecord } from "@/lib/property/types";
import {
  normalizeFacilityManager,
  normalizeFacilityManagerAssistant,
  normalizeFacilityManagerAssistants,
  normalizePaginatedFacilityManagers,
} from "./mappers";
import type {
  AssignPropertyToFacilityManagerResponse,
  CreateFacilityManagerPayload,
  CreateFacilityManagerResponse,
  FacilityManagerAssistant,
  FacilityManagerRecord,
  GetFacilityManagersParams,
  PaginatedFacilityManagers,
} from "./types";

const ADMIN_FACILITY_MANAGER_BASE = "/admin/facility-manager";

function unwrapData<T>(data: T | { data: T }): T {
  if (data && typeof data === "object" && "data" in data && (data as { data: T }).data) {
    return (data as { data: T }).data;
  }
  return data as T;
}

export function getFacilityManagerErrorMessage(error: any, fallback: string) {
  return (
    error?.response?.data?.responseDescription ||
    error?.response?.data?.responseMessage ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

export async function getFacilityManagers(
  params: GetFacilityManagersParams = {}
): Promise<PaginatedFacilityManagers> {
  const search = params.search?.trim();

  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(ADMIN_FACILITY_MANAGER_BASE, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      ...(search ? { search } : {}),
    },
  });

  return normalizePaginatedFacilityManagers(unwrapData(data) as Record<string, unknown>);
}

export async function getFacilityManagerById(id: string): Promise<FacilityManagerRecord> {
  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    `${ADMIN_FACILITY_MANAGER_BASE}/${id}`
  );
  return normalizeFacilityManager(unwrapData(data) as Record<string, unknown>);
}

export async function createFacilityManager(
  payload: CreateFacilityManagerPayload
): Promise<CreateFacilityManagerResponse> {
  const { data } = await http.post<CreateFacilityManagerResponse | { data: CreateFacilityManagerResponse }>(
    ADMIN_FACILITY_MANAGER_BASE,
    payload
  );
  return unwrapData(data);
}

export async function assignPropertyToFacilityManager(
  managerId: string,
  propertyId: string
): Promise<AssignPropertyToFacilityManagerResponse> {
  const { data } = await http.post<
    AssignPropertyToFacilityManagerResponse | { data: AssignPropertyToFacilityManagerResponse }
  >(`${ADMIN_FACILITY_MANAGER_BASE}/${managerId}/properties`, { propertyId });
  return unwrapData(data);
}

function normalizeAssignedProperties(data: Record<string, unknown> | unknown[]): PropertyRecord[] {
  if (Array.isArray(data)) {
    return data.map((item) => normalizeProperty(item as Record<string, unknown>));
  }

  const rawItems = data.pageItems || data.items || data.properties || data.data || [];

  if (!Array.isArray(rawItems)) {
    return [];
  }

  return rawItems.map((item) => normalizeProperty(item as Record<string, unknown>));
}

export async function getFacilityManagerProperties(managerId: string): Promise<PropertyRecord[]> {
  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    `${ADMIN_FACILITY_MANAGER_BASE}/${managerId}/properties`
  );
  return normalizeAssignedProperties(unwrapData(data) as Record<string, unknown> | unknown[]);
}

export async function removePropertyFromFacilityManager(
  managerId: string,
  propertyId: string
): Promise<AssignPropertyToFacilityManagerResponse> {
  const { data } = await http.delete<
    AssignPropertyToFacilityManagerResponse | { data: AssignPropertyToFacilityManagerResponse }
  >(`${ADMIN_FACILITY_MANAGER_BASE}/${managerId}/properties/${propertyId}`);
  return unwrapData(data);
}

export async function blockFacilityManager(
  id: string
): Promise<AssignPropertyToFacilityManagerResponse> {
  const { data } = await http.post<
    AssignPropertyToFacilityManagerResponse | { data: AssignPropertyToFacilityManagerResponse }
  >(`${ADMIN_FACILITY_MANAGER_BASE}/${id}/block`);
  return unwrapData(data);
}

export async function unblockFacilityManager(
  id: string
): Promise<AssignPropertyToFacilityManagerResponse> {
  const { data } = await http.post<
    AssignPropertyToFacilityManagerResponse | { data: AssignPropertyToFacilityManagerResponse }
  >(`${ADMIN_FACILITY_MANAGER_BASE}/${id}/unblock`);
  return unwrapData(data);
}

export async function getFacilityManagerAssistants(
  managerId: string
): Promise<FacilityManagerAssistant[]> {
  const { data } = await http.get<Record<string, unknown> | unknown[] | { data: Record<string, unknown> | unknown[] }>(
    `${ADMIN_FACILITY_MANAGER_BASE}/${managerId}/assistants`
  );
  return normalizeFacilityManagerAssistants(
    unwrapData(data) as Record<string, unknown> | unknown[]
  );
}

export async function getAssistantFacilityManagerById(
  id: string
): Promise<FacilityManagerAssistant> {
  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    `/admin/assistant-facility-manager/${id}`
  );
  return normalizeFacilityManagerAssistant(unwrapData(data) as Record<string, unknown>);
}
