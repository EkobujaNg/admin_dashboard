import http from "@/lib/http";
import { derivePropertyStatistics, normalizePaginatedProperties, normalizeProperty } from "./mappers";
import type {
  CreatePropertyPayload,
  UpdatePropertyPayload,
  GetPropertiesParams,
  PaginatedProperties,
  PropertyRecord,
  PropertyStatistics,
} from "./types";

const MAX_PROPERTY_PAGE_LIMIT = 50;

function clampLimit(limit?: number) {
  const value = limit ?? 10;
  return Math.min(Math.max(value, 1), MAX_PROPERTY_PAGE_LIMIT);
}

function unwrapData<T>(data: T | { data: T }): T {
  if (data && typeof data === "object" && "data" in data && (data as { data: T }).data) {
    return (data as { data: T }).data;
  }
  return data as T;
}

export type CreatePropertyResponse = {
  propertyId?: string;
  message?: string;
  responseDescription?: string;
  responseMessage?: string;
  [key: string]: unknown;
};

export function getPropertyErrorMessage(error: any, fallback: string) {
  return (
    error?.response?.data?.responseDescription ||
    error?.response?.data?.responseMessage ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

export async function getProperties(params: GetPropertiesParams = {}): Promise<PaginatedProperties> {
  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>("/properties", {
    params: {
      page: params.page ?? 1,
      limit: clampLimit(params.limit),
      ...(params.name ? { name: params.name } : {}),
    },
  });

  return normalizePaginatedProperties(unwrapData(data) as Record<string, unknown>);
}

export async function getPropertyStatistics(params: GetPropertiesParams = {}): Promise<PropertyStatistics> {
  const paginated = await getProperties({ ...params, page: 1, limit: MAX_PROPERTY_PAGE_LIMIT });
  return derivePropertyStatistics(paginated);
}

export async function getPropertyById(id: string): Promise<PropertyRecord> {
  const { data } = await http.get<PropertyRecord | { data: PropertyRecord }>(`/properties/${id}`);
  return normalizeProperty(unwrapData(data) as Record<string, unknown>);
}

export async function createProperty(payload: CreatePropertyPayload): Promise<CreatePropertyResponse> {
  const { data } = await http.post<CreatePropertyResponse | { data: CreatePropertyResponse }>(
    "/properties",
    payload
  );
  return unwrapData(data);
}

export async function updateProperty(id: string, payload: UpdatePropertyPayload): Promise<CreatePropertyResponse> {
  const { data } = await http.patch<CreatePropertyResponse | { data: CreatePropertyResponse }>(
    `/properties/${id}`,
    payload
  );
  return unwrapData(data);
}

export async function setPropertyVisibility(id: string, isHidden: boolean): Promise<CreatePropertyResponse> {
  const { data } = await http.patch<CreatePropertyResponse | { data: CreatePropertyResponse }>(
    `/properties/${id}/hide`,
    { isHidden }
  );
  return unwrapData(data);
}

export async function updatePropertyCommission(
  id: string,
  commission: number
): Promise<CreatePropertyResponse> {
  const { data } = await http.patch<CreatePropertyResponse | { data: CreatePropertyResponse }>(
    `/properties/${id}/commission`,
    { commission }
  );
  return unwrapData(data);
}
