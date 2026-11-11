import type { Metadata } from "next";

import { site } from "./site";

/**
 * Title, description, canonical URL and Open Graph tags for a page.
 * Next.js replaces (rather than merges) a parent's openGraph object, so each
 * page gets the full set from here.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      locale: "en_IN",
      type: "website",
    },
  };
}
