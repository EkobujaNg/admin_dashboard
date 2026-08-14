import { uploadMediaFile } from "@/lib/storage/api";

const MAX_PROPERTY_IMAGE_SIZE = 10 * 1024 * 1024;

const PROPERTY_VIDEO_URL_PATTERN = /youtube\.com|youtu\.be/i;

export function isPropertyVideoUrl(url: string): boolean {
  return PROPERTY_VIDEO_URL_PATTERN.test(url);
}

export function splitPropertyMedia(media: string[]) {
  const videoLink = media.find(isPropertyVideoUrl) ?? "";
  const images = media.filter((url) => !isPropertyVideoUrl(url));
  return { images, videoLink };
}

export function getPropertyImageUrls(property: {
  imageUrls?: string[];
  media?: string[];
}): string[] {
  const fromImageUrls = (property.imageUrls ?? []).filter((url) => !isPropertyVideoUrl(url));
  if (fromImageUrls.length > 0) return fromImageUrls;

  return (property.media ?? []).filter((url) => !isPropertyVideoUrl(url));
}

export function getPropertyVideoLink(property: {
  videoLink?: string | null;
  media?: string[];
  imageUrls?: string[];
}): string {
  if (property.videoLink?.trim()) return property.videoLink.trim();

  return (property.media ?? []).find(isPropertyVideoUrl) ?? (property.imageUrls ?? []).find(isPropertyVideoUrl) ?? "";
}

export function getFirstPropertyImageUrl(
  property: {
    imageUrls?: string[];
    media?: string[];
  },
  fallback = ""
): string {
  const fromImageUrls = (property.imageUrls ?? []).find((url) => !isPropertyVideoUrl(url));
  if (fromImageUrls) return fromImageUrls;

  return (property.media ?? []).find((url) => !isPropertyVideoUrl(url)) ?? fallback;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    let videoId = "";

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.replace(/^\//, "").split("/")[0] ?? "";
    } else if (parsed.hostname.includes("youtube.com")) {
      videoId =
        parsed.searchParams.get("v") ||
        parsed.pathname.match(/\/embed\/([^/?]+)/)?.[1] ||
        parsed.pathname.match(/\/shorts\/([^/?]+)/)?.[1] ||
        "";
    }

    const cleanId = videoId.split("?")[0];
    return cleanId ? `https://www.youtube.com/embed/${cleanId}` : null;
  } catch {
    return null;
  }
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
