import { uploadMediaFile } from "@/lib/storage/api";

const MAX_FACILITY_MANAGER_ID_SIZE = 10 * 1024 * 1024;

export async function uploadFacilityManagerId(file: File): Promise<string> {
  const { publicUrl } = await uploadMediaFile(file, {
    kind: "properties",
    maxSizeBytes: MAX_FACILITY_MANAGER_ID_SIZE,
  });
  return publicUrl;
}
