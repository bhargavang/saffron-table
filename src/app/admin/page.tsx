import Link from "next/link";
import { Suspense } from "react";

import { requireAdmin } from "@/lib/admin-auth";
import { zonedNow } from "@/lib/bookings/dates";
import type { Booking } from "@/lib/bookings/rules";
import { listBookings } from "@/lib/bookings/service";
import { site } from "@/lib/site";

import { logout } from "./actions";
import { BookingsBoard } from "./BookingsBoard";

export default function AdminPage() {
  return (
    <>
      <header className="bg-cocoa text-cream">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 32 32" className="h-7 w-7 text-saffron" aria-hidden="true">
              <g fill="currentColor">
                <ellipse cx="16" cy="8" rx="4" ry="7" />
                <ellipse cx="16" cy="24" rx="4" ry="7" />
                <ellipse cx="8" cy="16" rx="7" ry="4" />
                <ellipse cx="24" cy="16" rx="7" ry="4" />
              </g>
              <circle cx="16" cy="16" r="4" className="fill-chili" />
            </svg>
            <span className="font-display text-lg font-semibold">{site.name}</span>
            <span className="hidden rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-cream/80 sm:inline">
              Bookings
            </span>
          </div>
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="rounded-full px-3 py-2 text-cream/75 hover:text-cream">
              View site
            </Link>
            <form action={logout}>
              <button className="rounded-full border border-white/20 px-4 py-2 font-medium hover:border-cream">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Suspense fallback={<BoardSkeleton />}>
          <Dashboard />
        </Suspense>
      </main>
    </>
  );
}

async function Dashboard() {
  await requireAdmin();

  let bookings: Booking[];
  try {
    bookings = await listBookings();
  } catch (error) {
    console.error("[admin] could not load bookings", error);
    return (
      <div role="alert" className="rounded-3xl border border-chili/30 bg-white p-8">
        <h1 className="font-display text-2xl font-semibold">Bookings can&apos;t be loaded right now</h1>
        <p className="mt-2 text-muted">
          The database isn&apos;t responding. The public website still works, and guests who
          try to book are pointed to your phone number and WhatsApp. Try again in a minute.
        </p>
      </div>
    );
  }

  return <BookingsBoard bookings={bookings} today={zonedNow().date} />;
}

function BoardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading bookings" className="animate-pulse space-y-6">
      <div className="h-9 w-48 rounded-lg bg-sand" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-sand/70" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-sand/50" />
    </div>
  );
}
