/**
 * All restaurant details live here, so the whole site updates from one file.
 * To reuse this project for a real client, change these values first.
 */

const BUILDER_WHATSAPP = "917411946909";

export type ServiceHours = { name: "Lunch" | "Dinner"; open: string; close: string };

export type OpeningDays = {
  label: string;
  /** Days of the week, 0 = Sunday … 6 = Saturday. */
  days: number[];
  services: ServiceHours[];
};

const hours: OpeningDays[] = [
  {
    label: "Mon – Thu",
    days: [1, 2, 3, 4],
    services: [
      { name: "Lunch", open: "12:00", close: "15:30" },
      { name: "Dinner", open: "19:00", close: "23:00" },
    ],
  },
  {
    label: "Fri – Sun",
    days: [5, 6, 0],
    services: [
      { name: "Lunch", open: "12:00", close: "16:00" },
      { name: "Dinner", open: "19:00", close: "23:30" },
    ],
  },
];

export const site = {
  name: "Saffron Table",
  tagline: "Modern Indian kitchen",
  description:
    "Slow-cooked curries, smoky tandoor classics and seasonal specials in Indiranagar, Bengaluru. Book a table online in seconds.",

  // Demo contact details point to the developer, so anyone who tries the
  // demo and wants a site like it can reach out. Replace for a real client.
  phone: { display: "+91 74119 46909", href: "tel:+917411946909" },
  email: "bhargav.angadi@gmail.com",
  whatsapp: BUILDER_WHATSAPP,
  /** Pre-filled text for the floating WhatsApp button. */
  whatsappMessage:
    "Hi! I'm trying the WhatsApp button on the Saffron Table demo website.",

  address: {
    line1: "42 Lotus Lane, Indiranagar",
    line2: "Bengaluru, Karnataka 560038",
    street: "42 Lotus Lane, Indiranagar",
    locality: "Bengaluru",
    region: "Karnataka",
    postalCode: "560038",
    country: "IN",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Indiranagar%2C%20Bengaluru",
    /** Keyless Google Maps embed. Point it at the real address for a client. */
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Indiranagar%2C%20Bengaluru&z=15&output=embed",
  },

  /** Restaurant's local time zone. Booking dates and slots use it. */
  timeZone: "Asia/Kolkata",
  hours,

  booking: {
    /** Gap between bookable times. */
    slotMinutes: 30,
    /** Last table is seated this long before the kitchen closes. */
    lastSeatingMinutes: 60,
    /** Bigger groups are asked to call. */
    maxGuestsOnline: 10,
    /** Seats available per time slot (pending + confirmed bookings count). */
    seatsPerSlot: 24,
    /** How far ahead guests can book. */
    daysAhead: 60,
    /** Same-day bookings need at least this much notice. */
    minNoticeMinutes: 60,
    occasions: ["Birthday", "Anniversary", "Date night", "Business meal", "Family get-together"],
  },

  nav: [
    { label: "Menu", href: "/menu" },
    { label: "Gallery", href: "/gallery" },
    { label: "Visit us", href: "/#visit" },
  ],

  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
  ],

  /** Shown in the slim banner at the top. Set `show: false` for a real client. */
  demo: {
    show: true,
    builtBy: "Bhargav Angadi",
    contactUrl: `https://wa.me/${BUILDER_WHATSAPP}?text=${encodeURIComponent(
      "Hi Bhargav, I saw the Saffron Table demo. I'd like a website like this.",
    )}`,
  },
} as const;

export type Site = typeof site;

/** Public URL of the site, used for metadata, the sitemap and email links. */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

/** "19:30" → "7:30 pm" */
export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour} ${suffix}` : `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** "12:00", "15:30" → "12 pm – 3:30 pm" */
export function formatRange(open: string, close: string): string {
  return `${formatTime(open)} – ${formatTime(close)}`;
}

export function whatsappLink(text: string = site.whatsappMessage): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
