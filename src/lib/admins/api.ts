import http from "@/lib/http";
import { normalizeAdminAccount, normalizePaginatedAdmins } from "./mappers";
import type {
  AdminAccount,
  CreateAdminPayload,
  CreateAdminResponse,
  GetAdminsParams,
  PaginatedAdmins,
} from "./types";

const ADMIN_ADMINS_BASE = "/admin/admins";

function unwrapData<T>(data: T | { data: T }): T {
  if (data && typeof data === "object" && "data" in data && (data as { data: T }).data) {
    return (data as { data: T }).data;
  }
  return data as T;
}

export function getAdminsErrorMessage(error: any, fallback: string) {
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

export async function getAdmins(params: GetAdminsParams = {}): Promise<PaginatedAdmins> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const search = params.search?.trim();

  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    ADMIN_ADMINS_BASE,
    {
      params: {
        page,
        limit,
        ...(search ? { search } : {}),
      },
    }
  );

  return normalizePaginatedAdmins(unwrapData(data) as Record<string, unknown>, page, limit);
}

export async function getAdminById(id: string): Promise<AdminAccount> {
  const { data } = await http.get<Record<string, unknown> | { data: Record<string, unknown> }>(
    `${ADMIN_ADMINS_BASE}/${id}`
  );
  return normalizeAdminAccount(unwrapData(data) as Record<string, unknown>);
}

export async function createAdmin(payload: CreateAdminPayload): Promise<CreateAdminResponse> {
  const { data } = await http.post<CreateAdminResponse | { data: CreateAdminResponse }>(
    ADMIN_ADMINS_BASE,
    payload
  );
  return unwrapData(data);
}

export async function blockAdmin(id: string): Promise<CreateAdminResponse> {
  const { data } = await http.post<CreateAdminResponse | { data: CreateAdminResponse }>(
    `${ADMIN_ADMINS_BASE}/${id}/block`
  );
  return unwrapData(data);
}

export async function unblockAdmin(id: string): Promise<CreateAdminResponse> {
  const { data } = await http.post<CreateAdminResponse | { data: CreateAdminResponse }>(
    `${ADMIN_ADMINS_BASE}/${id}/unblock`
  );
  return unwrapData(data);
}
