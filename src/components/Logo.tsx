import Link from "next/link";

import { site } from "@/lib/site";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label={`${site.name}, home`}
    >
      <svg
        viewBox="0 0 32 32"
        className="h-8 w-8 shrink-0 text-saffron transition-transform duration-500 group-hover:rotate-45"
        aria-hidden="true"
      >
        {/* Stylised saffron flower */}
        <g fill="currentColor">
          <ellipse cx="16" cy="8" rx="4" ry="7" />
          <ellipse cx="16" cy="24" rx="4" ry="7" />
          <ellipse cx="8" cy="16" rx="7" ry="4" />
          <ellipse cx="24" cy="16" rx="7" ry="4" />
        </g>
        <circle cx="16" cy="16" r="4" className="fill-chili" />
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight">
        {site.name}
      </span>
    </Link>
  );
}
