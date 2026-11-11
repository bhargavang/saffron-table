import Link from "next/link";

import { Logo } from "@/components/Logo";
import { formatRange, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-cocoa text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/65">
            {site.tagline}. Family recipes and tandoor classics, cooked slow
            and served with warmth.
          </p>
          <ul className="mt-5 flex gap-4 text-sm">
            {site.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/75 underline-offset-4 hover:text-cream hover:underline"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-saffron">
            Visit
          </h2>
          <address className="mt-4 text-sm not-italic leading-relaxed text-cream/80">
            {site.address.line1}
            <br />
            {site.address.line2}
          </address>
          <a
            href={site.address.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-medium text-saffron hover:underline"
          >
            Get directions ↗
          </a>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-saffron">
            Hours
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            {site.hours.map((h) => (
              <div key={h.label}>
                <dt className="font-medium text-cream">{h.label}</dt>
                <dd className="text-cream/70">
                  {h.services.map((s) => (
                    <span key={s.name} className="block">
                      {s.name} {formatRange(s.open, s.close)}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-saffron">
            Reservations
          </h2>
          <p className="mt-3 text-sm text-cream/80">
            <a href={site.phone.href} className="block py-1 hover:underline">
              {site.phone.display}
            </a>
            <a href={`mailto:${site.email}`} className="block break-all py-1 hover:underline">
              {site.email}
            </a>
          </p>
          <Link
            href="/book"
            className="mt-5 inline-block rounded-full bg-saffron px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-saffron-dark"
          >
            Book a table
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        {/* Extra bottom space so the floating WhatsApp button never covers this row */}
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 pb-24 pt-5 text-xs text-cream/50 sm:flex-row sm:justify-between sm:px-6">
          <p>© {site.name}. A demo project, not a real restaurant.</p>
          <p>
            Website by{" "}
            <a
              href={site.demo.contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/75 hover:text-cream hover:underline"
            >
              {site.demo.builtBy}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
