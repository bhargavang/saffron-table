"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";

import { addDays, formatDate } from "@/lib/bookings/dates";
import { formatPhone, type Booking, type BookingStatus } from "@/lib/bookings/rules";
import { formatTime } from "@/lib/site";

import { updateBookingStatus } from "./actions";

type Tab = "pending" | "upcoming" | "past" | "all";

const tabs: { id: Tab; label: string }[] = [
  { id: "pending", label: "Needs a reply" },
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "all", label: "All" },
];

export function BookingsBoard({ bookings, today }: { bookings: Booking[]; today: string }) {
  const [list, setOptimistic] = useOptimistic(
    bookings,
    (state, change: { id: string; status: BookingStatus }) =>
      state.map((b) => (b.id === change.id ? { ...b, status: change.status } : b)),
  );
  const [tab, setTab] = useState<Tab>("upcoming");
  const [query, setQuery] = useState("");
  const [failed, setFailed] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const update = (booking: Booking, status: BookingStatus) => {
    setFailed(null);
    startTransition(async () => {
      setOptimistic({ id: booking.id, status });
      const result = await updateBookingStatus(booking.id, status);
      if (!result.ok) setFailed(`Couldn't update ${booking.name}'s booking. Please try again.`);
    });
  };

  const counts = useMemo(() => {
    const upcoming = list.filter((b) => b.date >= today);
    const todays = upcoming.filter((b) => b.date === today && b.status !== "declined");
    const week = upcoming.filter((b) => b.date <= addDays(today, 6) && b.status !== "declined");
    return {
      pending: upcoming.filter((b) => b.status === "pending").length,
      upcoming: upcoming.length,
      past: list.length - upcoming.length,
      all: list.length,
      todayBookings: todays.length,
      todayGuests: todays.reduce((n, b) => n + b.guests, 0),
      weekBookings: week.length,
      weekGuests: week.reduce((n, b) => n + b.guests, 0),
    };
  }, [list, today]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const digits = q.replace(/\D/g, "");
    const shown = list
      .filter((b) => {
        if (tab === "pending") return b.status === "pending" && b.date >= today;
        if (tab === "upcoming") return b.date >= today;
        if (tab === "past") return b.date < today;
        return true;
      })
      .filter(
        (b) =>
          !q ||
          b.name.toLowerCase().includes(q) ||
          b.ref.toLowerCase().includes(q) ||
          b.email.includes(q) ||
          (digits.length >= 3 && b.phone.includes(digits)),
      )
      .sort((a, b) => {
        const byDate = tab === "past" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
        return byDate || a.time.localeCompare(b.time);
      });

    const byDate = new Map<string, Booking[]>();
    for (const b of shown) byDate.set(b.date, [...(byDate.get(b.date) ?? []), b]);
    return [...byDate.entries()];
  }, [list, tab, query, today]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Bookings</h1>
          <p className="mt-1 text-muted">{formatDate(today, { long: true })}</p>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <Stat label="Today" value={counts.todayBookings} detail={`${counts.todayGuests} guests`} />
        <Stat
          label="Needs a reply"
          value={counts.pending}
          detail={counts.pending === 1 ? "request waiting" : "requests waiting"}
          highlight={counts.pending > 0}
        />
        <Stat
          label="Next 7 days"
          value={counts.weekBookings}
          detail={`${counts.weekGuests} guests`}
          className="col-span-2 sm:col-span-1"
        />
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Filter bookings" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t.id ? "bg-cocoa text-cream" : "text-muted hover:bg-sand hover:text-ink"
              }`}
            >
              {t.label}
              <span className={`ml-1.5 tabular-nums ${tab === t.id ? "text-cream/60" : "text-muted/70"}`}>
                {counts[t.id]}
              </span>
            </button>
          ))}
        </div>
        <label className="relative block sm:w-72">
          <span className="sr-only">Search bookings</span>
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, phone or reference"
            className="w-full rounded-full border border-sand bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-ink/30 focus:ring-2 focus:ring-saffron/40"
          />
        </label>
      </div>

      {failed && (
        <p role="alert" className="mt-4 rounded-xl bg-chili/10 px-4 py-3 text-sm font-medium text-chili">
          {failed}
        </p>
      )}

      <div className="mt-6 space-y-8">
        {groups.length === 0 && (
          <p className="rounded-2xl border border-dashed border-ink/15 bg-white/60 px-6 py-12 text-center text-muted">
            {query ? "No bookings match that search." : tab === "pending" ? "All caught up. No requests waiting." : "No bookings here yet."}
          </p>
        )}

        {groups.map(([date, items]) => {
          const active = items.filter((b) => b.status !== "declined");
          return (
            <section key={date} aria-labelledby={`day-${date}`}>
              <h2 id={`day-${date}`} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-sand pb-2">
                <span className="font-display text-xl font-semibold">
                  {date === today ? "Today" : date === addDays(today, 1) ? "Tomorrow" : formatDate(date)}
                </span>
                {(date === today || date === addDays(today, 1)) && (
                  <span className="text-sm text-muted">{formatDate(date)}</span>
                )}
                <span className="ml-auto text-sm text-muted">
                  {active.length} {active.length === 1 ? "table" : "tables"} · {active.reduce((n, b) => n + b.guests, 0)} guests
                </span>
              </h2>
              <ul className="mt-3 space-y-3">
                {items.map((b) => (
                  <BookingRow key={b.id} booking={b} past={b.date < today} onChange={update} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  detail,
  highlight,
  className = "",
}: {
  label: string;
  value: number;
  detail: string;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${highlight ? "border-saffron bg-saffron/15" : "border-sand bg-white"} ${className}`}>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1">
        <span className="font-display text-3xl font-semibold tabular-nums">{value}</span>
        <span className="ml-2 text-sm text-muted">{detail}</span>
      </dd>
    </div>
  );
}

const statusStyle: Record<BookingStatus, string> = {
  pending: "bg-saffron/25 text-[#7a4c0c]",
  confirmed: "bg-leaf/15 text-leaf",
  declined: "bg-ink/10 text-muted",
};

const statusLabel: Record<BookingStatus, string> = {
  pending: "Waiting",
  confirmed: "Confirmed",
  declined: "Declined",
};

function BookingRow({
  booking: b,
  past,
  onChange,
}: {
  booking: Booking;
  past: boolean;
  onChange: (b: Booking, status: BookingStatus) => void;
}) {
  return (
    <li
      className={`grid gap-4 rounded-2xl border bg-white p-4 sm:grid-cols-[6.5rem_1fr_auto] sm:items-center sm:p-5 ${
        b.status === "pending" && !past ? "border-saffron/60" : "border-sand"
      } ${b.status === "declined" ? "opacity-60" : ""}`}
    >
      <div className="flex items-center gap-3 sm:block">
        <p className="whitespace-nowrap font-display text-2xl font-semibold tabular-nums">{formatTime(b.time)}</p>
        <p className="text-sm text-muted">
          {b.guests} {b.guests === 1 ? "guest" : "guests"}
        </p>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold">{b.name}</p>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle[b.status]}`}>
            {statusLabel[b.status]}
          </span>
          {b.occasion && (
            <span className="rounded-full bg-chili/10 px-2.5 py-0.5 text-xs font-semibold text-chili">
              {b.occasion}
            </span>
          )}
          {b.isDemo && (
            <span className="rounded-full border border-dashed border-ink/20 px-2 py-0.5 text-[11px] text-muted" title="Seeded sample booking">
              Sample
            </span>
          )}
        </div>
        <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <a href={`tel:${b.phone}`} className="hover:text-ink hover:underline">
            {formatPhone(b.phone)}
          </a>
          <a href={`mailto:${b.email}`} className="truncate hover:text-ink hover:underline">
            {b.email}
          </a>
          <span className="font-mono text-xs leading-5">{b.ref}</span>
        </p>
        {b.notes && <p className="mt-2 rounded-lg bg-cream px-3 py-2 text-sm">“{b.notes}”</p>}
      </div>

      {!past && (
        <div className="flex gap-2 sm:justify-end">
          {b.status !== "confirmed" && (
            <button
              type="button"
              onClick={() => onChange(b, "confirmed")}
              className="flex-1 rounded-full bg-leaf px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#46602f] sm:flex-none"
            >
              {b.status === "declined" ? "Accept after all" : "Accept"}
            </button>
          )}
          {b.status !== "declined" && (
            <button
              type="button"
              onClick={() => onChange(b, "declined")}
              className="flex-1 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold transition-colors hover:border-chili hover:text-chili sm:flex-none"
            >
              Decline
            </button>
          )}
        </div>
      )}
    </li>
  );
}
