export type StorageKind = "profile" | "properties";

export type PresignUploadPayload = {
  kind: StorageKind;
  fileName: string;
  contentType: string;
};

export type PresignUploadResponse = {
  uploadUrl: string;
  key: string;
  publicUrl: string;
  expiresIn: number;
};

export type UploadMediaOptions = {
  kind: StorageKind;
  maxSizeBytes?: number;
  allowedTypes?: string[];
};
