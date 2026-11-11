"use client";

/**
 * All photos come from Unsplash, whose CDN (imgix) resizes and converts
 * images on the fly. So next/image asks Unsplash for the exact width each
 * screen needs and the browser downloads it straight from their CDN: the
 * app server never handles image bytes, which keeps it fast under load.
 *
 * When swapping in a client's own photos, put them in /public and return
 * `src` unchanged for local paths (handled below), or point this at the
 * image CDN they use.
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("https://images.unsplash.com/")) return src;
  const url = new URL(src);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 70));
  return url.toString();
}
