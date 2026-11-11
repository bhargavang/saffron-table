import { site, type ServiceHours } from "@/lib/site";

/**
 * Date helpers that work in the restaurant's time zone, whatever time zone
 * the server or the guest's phone is in. Dates are "YYYY-MM-DD" strings and
 * times are "HH:MM" strings, so nothing shifts when it is stored or sent.
 */

export type ZonedNow = { date: string; minutes: number };

/** Today's date and minutes since midnight in the restaurant's time zone. */
export function zonedNow(now: Date = new Date()): ZonedNow {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: site.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 0 = Sunday … 6 = Saturday */
export function weekday(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(total: number): string {
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** "2026-11-14" → "Sat, 14 Nov" (or with the year when `long`). */
export function formatDate(date: string, opts: { long?: boolean } = {}): string {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: opts.long ? "long" : "short",
    day: "numeric",
    month: opts.long ? "long" : "short",
    year: opts.long ? "numeric" : undefined,
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export type Slot = { time: string; service: ServiceHours["name"] };

/** Bookable start times for a date, from the opening hours in site.ts. */
export function slotsFor(date: string): Slot[] {
  const day = weekday(date);
  const hours = site.hours.find((h) => h.days.includes(day));
  if (!hours) return [];

  const { slotMinutes, lastSeatingMinutes } = site.booking;
  const slots: Slot[] = [];
  for (const service of hours.services) {
    const last = toMinutes(service.close) - lastSeatingMinutes;
    for (let t = toMinutes(service.open); t <= last; t += slotMinutes) {
      slots.push({ time: fromMinutes(t), service: service.name });
    }
  }
  return slots;
}

/** Whether a slot can still be booked, given the notice period for same-day bookings. */
export function isSlotInFuture(date: string, time: string, now: ZonedNow): boolean {
  if (date > now.date) return true;
  if (date < now.date) return false;
  return toMinutes(time) - now.minutes >= site.booking.minNoticeMinutes;
}
