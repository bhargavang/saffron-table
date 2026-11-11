"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);
  const isCurrent = (href: string) => href === pathname;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-cocoa/95 text-cream backdrop-blur supports-[backdrop-filter]:bg-cocoa/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className="text-sm font-medium text-cream/75 transition-colors hover:text-cream aria-[current=page]:text-saffron"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="rounded-full bg-saffron px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-saffron-dark"
          >
            Book a table
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-white/10 px-4 pb-6 pt-2 md:hidden"
        >
          <ul className="flex flex-col">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className="block border-b border-white/10 py-3.5 text-base font-medium text-cream/85 aria-[current=page]:text-saffron"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/book"
            onClick={close}
            className="mt-5 block rounded-full bg-saffron py-3 text-center font-semibold text-ink"
          >
            Book a table
          </Link>
        </nav>
      )}
    </header>
  );
}
