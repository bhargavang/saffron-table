import Link from "next/link";

import { OpeningHours } from "@/components/OpeningHours";
import { SectionHeading } from "@/components/SectionHeading";
import { site, whatsappLink } from "@/lib/site";

export function VisitSection() {
  return (
    <section id="visit" className="scroll-mt-20 bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24">
        <SectionHeading eyebrow="Visit us" title="Find us in Indiranagar">
          Five minutes&apos; walk from Indiranagar metro station, just off 100 Feet Road.
          Valet parking from 7 pm.
        </SectionHeading>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-sand bg-sand">
            <iframe
              title={`Map showing ${site.name} in Indiranagar, Bengaluru`}
              src={site.address.mapEmbedUrl}
              className="block h-full min-h-[320px] w-full sm:min-h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-col gap-8 rounded-3xl border border-sand bg-white/70 p-7 sm:p-8">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-chili">Address</h3>
              <address className="mt-3 text-[15px] not-italic leading-relaxed">
                {site.address.line1}
                <br />
                {site.address.line2}
              </address>
              <a
                href={site.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-semibold text-chili hover:underline"
              >
                Open in Google Maps ↗
              </a>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-chili">Opening hours</h3>
              <div className="mt-3">
                <OpeningHours />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-chili">Get in touch</h3>
              <p className="mt-3 text-[15px]">
                <a href={site.phone.href} className="font-semibold hover:underline">
                  {site.phone.display}
                </a>
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/book"
                  className="rounded-full bg-cocoa px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-cocoa-light"
                >
                  Book a table
                </Link>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-ink"
                >
                  WhatsApp us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
