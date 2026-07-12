import http from "@/lib/http";
import type { PresignUploadPayload, PresignUploadResponse, UploadMediaOptions } from "./types";

const DEFAULT_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function unwrapData<T>(data: T | { data: T }): T {
  if (data && typeof data === "object" && "data" in data && (data as { data: T }).data) {
    return (data as { data: T }).data;
  }
  return data as T;
}

async function getPresignedUploadUrl(payload: PresignUploadPayload): Promise<PresignUploadResponse> {
  const { data } = await http.post<PresignUploadResponse | { data: PresignUploadResponse }>(
    "/storage/presign",
    payload
  );
  return unwrapData(data);
}

async function uploadFileToPresignedUrl(uploadUrl: string, file: File): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file to storage.");
  }
}

/**
 * Reusable media upload flow:
 * 1. POST /storage/presign → get uploadUrl + publicUrl
 * 2. PUT file bytes directly to uploadUrl (R2)
 * 3. Return publicUrl for use in the app API (e.g. property media array)
 */
export async function uploadMediaFile(
  file: File,
  { kind, maxSizeBytes, allowedTypes = DEFAULT_IMAGE_TYPES }: UploadMediaOptions
): Promise<PresignUploadResponse> {
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Please upload a JPEG, PNG, or WebP image.");
  }

  if (maxSizeBytes && file.size > maxSizeBytes) {
    throw new Error(`File must be ${Math.round(maxSizeBytes / (1024 * 1024))}MB or smaller.`);
  }

  const presign = await getPresignedUploadUrl({
    kind,
    fileName: file.name,
    contentType: file.type,
  });

  await uploadFileToPresignedUrl(presign.uploadUrl, file);
  return presign;
}
