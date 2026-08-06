import { uploadMediaFile } from "@/lib/storage/api";

const MAX_PROPERTY_IMAGE_SIZE = 10 * 1024 * 1024;

const PROPERTY_VIDEO_URL_PATTERN = /youtube\.com|youtu\.be/i;

export function isPropertyVideoUrl(url: string): boolean {
  return PROPERTY_VIDEO_URL_PATTERN.test(url);
}

export function buildPropertyMediaPayload(
  images: string[],
  videoLink: string,
  thumbnailIdx = 0
): string[] {
  const orderedMedia = [...images];
  if (thumbnailIdx > 0 && orderedMedia[thumbnailIdx]) {
    const [thumbnail] = orderedMedia.splice(thumbnailIdx, 1);
    orderedMedia.unshift(thumbnail);
  }

  const trimmedVideoLink = videoLink.trim();
  if (trimmedVideoLink) {
    orderedMedia.push(trimmedVideoLink);
  }

  return orderedMedia;
}

export async function uploadPropertyMedia(file: File): Promise<string> {
  const { publicUrl } = await uploadMediaFile(file, {
    kind: "properties",
    maxSizeBytes: MAX_PROPERTY_IMAGE_SIZE,
  });
  return publicUrl;
}
