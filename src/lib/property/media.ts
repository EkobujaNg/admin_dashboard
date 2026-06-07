import { uploadMediaFile } from "@/lib/storage/api";

const MAX_PROPERTY_IMAGE_SIZE = 10 * 1024 * 1024;

export async function uploadPropertyMedia(file: File): Promise<string> {
  const { publicUrl } = await uploadMediaFile(file, {
    kind: "properties",
    maxSizeBytes: MAX_PROPERTY_IMAGE_SIZE,
  });
  return publicUrl;
}
