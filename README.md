# Saffron Table: restaurant website with online table booking

A fast, mobile-first website for a modern Indian restaurant, with menu, gallery, location and **online table booking** that confirms by email.

> **Demo project** by [Bhargav Angadi](mailto:bhargav.angadi@gmail.com), freelance full-stack developer.
> Saffron Table is a fictional restaurant. Want a site like this for your business? [Message me on WhatsApp](https://wa.me/917411946909).

**Live demo:** _coming soon_ <!-- add your Vercel URL here -->

<!-- Add a screenshot here once the home page is finished:
![Saffron Table home page](docs/screenshot-home.png) -->

---

## Features

- [x] Responsive layout with sticky header and mobile menu
- [x] Home page hero with an SVG thali illustration
- [x] All restaurant details (hours, address, contact) in one config file: `src/lib/site.ts`
- [ ] Menu with categories, prices and veg/non-veg tags
- [ ] Photo gallery
- [ ] Location with Google Maps, opening hours and WhatsApp chat button
- [ ] Online booking form with validation
- [ ] Bookings saved to PostgreSQL
- [ ] Confirmation emails to guest and owner
- [ ] Admin page to accept or decline bookings
- [ ] SEO: metadata, sitemap and Open Graph image

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- PostgreSQL (Neon or Supabase) *(coming in the booking step)*
- Resend or Nodemailer for email *(coming in the booking step)*
- Hosted on Vercel

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Project structure

```
src/
  app/
    layout.tsx        # fonts, metadata, header + footer on every page
    page.tsx          # home page
    book/page.tsx     # booking page (form coming soon)
    globals.css       # Tailwind + brand colors
  components/         # Header, Footer, Hero, Highlights, ThaliIllustration…
  lib/site.ts         # restaurant name, hours, address, contact, nav links
```

## Reusing this for a real client

1. Change the details in `src/lib/site.ts`
2. Set `demo.show` to `false` to hide the demo banner
3. Replace the illustration and placeholder content with the client's real photos and menu
