import { photos } from "@/lib/photos";
import { site, siteUrl } from "@/lib/site";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** schema.org Restaurant data, so search engines can show hours, address and booking info. */
export function RestaurantJsonLd() {
  const url = siteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.name,
    description: site.description,
    url,
    image: photos.thali.src,
    telephone: site.phone.href.replace("tel:", ""),
    servesCuisine: ["Indian", "North Indian", "Tandoor"],
    priceRange: "₹₹",
    acceptsReservations: `${url}/book`,
    hasMenu: `${url}/menu`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    openingHoursSpecification: site.hours.flatMap((h) =>
      h.services.map((s) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.days.map((d) => dayNames[d]),
        opens: s.open,
        closes: s.close,
      })),
    ),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
