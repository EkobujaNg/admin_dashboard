"use client";

import { useMemo, useState } from "react";
import Image, { type ImageProps } from "next/image";

const DIRECT_LOAD_HOSTS = ["ekobujamedia.com.ng"];

function resolveSrcString(src: ImageProps["src"]): string | null {
  if (typeof src === "string") return src;
  if (src && typeof src === "object" && "src" in src && typeof src.src === "string") {
    return src.src;
  }
  return null;
}

export function shouldLoadMediaDirectly(src: ImageProps["src"]): boolean {
  const value = resolveSrcString(src);
  if (!value || !value.startsWith("http")) return false;
  try {
    const { hostname } = new URL(value);
    return DIRECT_LOAD_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`));
  } catch {
    return false;
  }
}

/**
 * ekobujamedia.com.ng blocks Next's optimizer. Load those URLs with a plain <img>.
 */
export default function MediaImage({
  unoptimized,
  fill,
  style,
  className,
  alt,
  width,
  height,
  src,
  onError,
  ...rest
}: ImageProps) {
  const [failed, setFailed] = useState(false);
  const srcString = useMemo(() => resolveSrcString(src), [src]);
  const isDirect = shouldLoadMediaDirectly(src);

  if (failed || !srcString) {
    return (
      <div
        className={className}
        style={{
          width: fill ? "100%" : width,
          height: fill ? "100%" : height,
          backgroundColor: "#E8EBEB",
          borderRadius: "9999px",
          ...((style as object) || {}),
        }}
        aria-label={alt || "Avatar"}
      />
    );
  }

  if (isDirect) {
    const fillStyle = fill
      ? {
          position: "absolute" as const,
          inset: 0,
          width: "100%",
          height: "100%",
          ...style,
        }
      : style;

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={srcString}
        alt={alt ?? ""}
        width={fill ? undefined : typeof width === "number" ? width : undefined}
        height={fill ? undefined : typeof height === "number" ? height : undefined}
        className={className}
        style={fillStyle}
        referrerPolicy="no-referrer"
        loading="lazy"
        decoding="async"
        onError={(event) => {
          setFailed(true);
          onError?.(event);
        }}
      />
    );
  }

  return (
    <Image
      {...rest}
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      style={style}
      className={className}
      unoptimized={unoptimized}
      referrerPolicy={rest.referrerPolicy ?? "no-referrer"}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}
