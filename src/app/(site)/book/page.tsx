import { OpeningHours } from "@/components/OpeningHours";
import { pageMetadata } from "@/lib/seo";
import { site, whatsappLink } from "@/lib/site";

import { BookingForm } from "./BookingForm";

export const metadata = pageMetadata({
  title: "Book a table",
  description:
    "Reserve a table at Saffron Table, Indiranagar. Pick a date and time, tell us how many, and we'll confirm by email.",
  path: "/book",
});

export default function BookPage() {
  return (
    <>
      <section className="bg-cocoa text-cream">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-6 md:pb-16 md:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-saffron">Reservations</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Book a table
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/70">
            Pick a time that suits you. We&apos;ll check the table plan and confirm by email,
            usually within the hour.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[1fr_20rem] lg:gap-16">
        <div className="min-w-0">
          <BookingForm />
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-sand/70 p-6">
            <h2 className="font-display text-xl font-semibold">Good to know</h2>
            <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted">
              <li>We hold tables for 15 minutes after the booking time.</li>
              <li>
                Groups of more than {site.booking.maxGuestsOnline}, please call so we can set up
                the long table.
              </li>
              <li>Tell us about allergies in the notes and the kitchen will plan around them.</li>
              <li>Walk-ins are welcome when there&apos;s space.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-chili">Opening hours</h2>
            <div className="mt-3">
              <OpeningHours />
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-chili">Rather talk to us?</h2>
            <p className="mt-3 text-[15px]">
              <a href={site.phone.href} className="font-semibold hover:underline">
                {site.phone.display}
              </a>
              <span className="text-muted"> or </span>
              <a
                href={whatsappLink("Hi! I'd like to book a table at Saffron Table.")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
              >
                WhatsApp
              </a>
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
