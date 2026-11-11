import Link from "next/link";

import { site } from "@/lib/site";

export function BookingCta() {
  return (
    <section className="bg-cream pb-20 md:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-chili px-6 py-12 text-cream sm:px-12 md:flex md:items-center md:justify-between md:gap-10 md:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-saffron/30 blur-3xl"
          />
          <div className="relative max-w-xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Planning dinner? Book in under a minute.
            </h2>
            <p className="mt-3 text-lg text-cream/80">
              Pick a time, tell us how many, and we&apos;ll confirm by email. Groups of more
              than {site.booking.maxGuestsOnline}, call us on {site.phone.display}.
            </p>
          </div>
          <Link
            href="/book"
            className="relative mt-8 inline-flex shrink-0 items-center rounded-full bg-cream px-7 py-3.5 font-semibold text-ink transition-colors hover:bg-white md:mt-0"
          >
            Book a table
          </Link>
        </div>
      </div>
    </section>
  );
}
