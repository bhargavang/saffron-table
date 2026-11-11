import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/menu`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/book`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${base}/gallery`, changeFrequency: "yearly", priority: 0.6 },
  ];
}
