/**
 * All restaurant details live here, so the whole site updates from one file.
 * To reuse this project for a real client, change these values first.
 */

const BUILDER_WHATSAPP = "917411946909";

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

  address: {
    line1: "42 Lotus Lane, Indiranagar",
    line2: "Bengaluru, Karnataka 560038",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Indiranagar%2C%20Bengaluru",
  },

  hours: [
    { days: "Mon – Thu", lunch: "12:00 – 15:30", dinner: "19:00 – 23:00" },
    { days: "Fri – Sun", lunch: "12:00 – 16:00", dinner: "19:00 – 23:30" },
  ],

  nav: [
    { label: "Menu", href: "/#menu" },
    { label: "Gallery", href: "/#gallery" },
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
