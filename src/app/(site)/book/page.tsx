import type { Metadata } from "next";
import Link from "next/link";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a table",
};

// Evening 4: replace this placeholder with the booking form.
export default function BookPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-chili">
        Reservations
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        Online booking is almost ready
      </h1>
      <p className="mt-5 text-lg text-muted">
        Until then, call us on{" "}
        <a href={site.phone.href} className="font-semibold text-ink underline underline-offset-4">
          {site.phone.display}
        </a>{" "}
        and we&apos;ll save you a table.
      </p>
      <Link
        href="/"
        className="mt-10 inline-block rounded-full border border-ink/15 px-6 py-3 font-semibold transition-colors hover:border-ink"
      >
        ← Back to home
      </Link>
    </section>
  );
}
