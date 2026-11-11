import Link from "next/link";

import { SiteShell } from "@/components/SiteShell";
import { ThaliIllustration } from "@/components/ThaliIllustration";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1fr_0.8fr] md:py-28">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-chili">Page not found</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            This plate isn&apos;t on the menu
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            The page you&apos;re looking for has moved or never existed. Here&apos;s where you
            probably meant to go.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="rounded-full bg-cocoa px-6 py-3 font-semibold text-cream hover:bg-cocoa-light">
              Home
            </Link>
            <Link href="/menu" className="rounded-full border border-ink/15 px-6 py-3 font-semibold hover:border-ink">
              Menu
            </Link>
            <Link href="/book" className="rounded-full border border-ink/15 px-6 py-3 font-semibold hover:border-ink">
              Book a table
            </Link>
          </div>
        </div>
        <ThaliIllustration className="mx-auto w-full max-w-[320px] drop-shadow-[0_20px_40px_rgba(36,26,21,0.25)]" />
      </section>
    </SiteShell>
  );
}
