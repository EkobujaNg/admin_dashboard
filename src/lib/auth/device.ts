export type DeviceType = "web" | "ios" | "android";

/**
 * Maps the browser environment to the auth API `deviceType` enum:
 * `web` | `ios` | `android`.
 *
 * Desktop browsers (Mac, Windows, Linux) → `web`.
 */
export function getDeviceType(): DeviceType {
  if (typeof navigator === "undefined") return "web";

  const ua = navigator.userAgent;

  if (/\bandroid\b/i.test(ua)) return "android";
  if (/\b(iphone|ipod|ipad)\b/i.test(ua)) return "ios";

  return "web";
}
