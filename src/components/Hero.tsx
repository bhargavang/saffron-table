import Image from "next/image";
import Link from "next/link";

import { photos } from "@/lib/photos";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cocoa text-cream">
      {/* Warm background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-saffron/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-chili/25 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-12 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:gap-14 md:pb-28 md:pt-20">
        <div>
          <p className="inline-flex rounded-full border border-white/15 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-saffron sm:text-xs sm:tracking-[0.16em]">
            {site.tagline} · Indiranagar
          </p>

          <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Slow-cooked flavours,{" "}
            <em className="font-normal text-saffron">served with warmth.</em>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-cream/75">
            Family recipes, smoky tandoor classics and seasonal specials, made
            fresh every day and best shared with the people you love.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-saffron px-5 py-3.5 font-semibold text-ink transition-colors hover:bg-saffron-dark sm:px-7"
            >
              Book a table
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center rounded-full border border-white/25 px-5 py-3.5 font-semibold text-cream transition-colors hover:border-cream sm:px-7"
            >
              View the menu
            </Link>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-7 text-sm">
            <div>
              <dt className="text-cream/55">Lunch</dt>
              <dd className="mt-1 font-medium">From 12 pm</dd>
            </div>
            <div>
              <dt className="text-cream/55">Dinner</dt>
              <dd className="mt-1 font-medium">From 7 pm</dd>
            </div>
            <div>
              <dt className="text-cream/55">Booking</dt>
              <dd className="mt-1 font-medium">Online, 24/7</dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-[420px] pb-6">
          {/* Arched frame, a nod to the jharokha windows of old Indian houses */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
            <Image
              src={photos.thali.src}
              alt={photos.thali.alt}
              fill
              preload
              sizes="(min-width: 768px) 420px, 92vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 rounded-2xl bg-cream px-5 py-4 text-ink shadow-xl sm:-left-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-chili">
              Lunch special
            </p>
            <p className="mt-1 font-display text-lg font-semibold">
              Saffron Table Thali
            </p>
            <p className="text-sm text-muted">Five curries, rice &amp; dessert · ₹449</p>
          </div>
        </div>
      </div>
    </section>
  );
}
