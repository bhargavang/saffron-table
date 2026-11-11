import "server-only";

import { site } from "@/lib/site";

import { addDays, isSlotInFuture, slotsFor, zonedNow, type Slot } from "./dates";
import { makeDemoBookings } from "./demo-data";
import { makeRef } from "./ref";
import type { Booking, BookingStatus, CleanBooking } from "./rules";
import { getStore, type BookingStore } from "./store";

let lastDemoCheck = 0;

/** The store, with the demo bookings topped up if they've gone stale. */
async function ready(): Promise<BookingStore> {
  const store = await getStore();
  // Checking at most every 10 minutes per server instance keeps this cheap.
  // The store itself makes sure only one instance reseeds.
  if (Date.now() - lastDemoCheck > 10 * 60_000) {
    const today = zonedNow().date;
    await store.refreshDemo(addDays(today, 3), () => makeDemoBookings(today));
    lastDemoCheck = Date.now();
  }
  return store;
}

export type SlotState = "open" | "few" | "full" | "past";
export type SlotAvailability = Slot & { state: SlotState };

/** Which times can still be booked on a date for a group of this size. */
export async function getAvailability(date: string, guests: number): Promise<SlotAvailability[]> {
  const now = zonedNow();
  const store = await ready();
  const taken = await store.seatsTaken(date);
  const { seatsPerSlot } = site.booking;

  return slotsFor(date).map((slot) => {
    const left = seatsPerSlot - (taken[slot.time] ?? 0);
    let state: SlotState = "open";
    if (!isSlotInFuture(date, slot.time, now)) state = "past";
    else if (left < guests) state = "full";
    else if (left <= 6) state = "few";
    return { ...slot, state };
  });
}

export type CreateResult =
  | { ok: true; booking: Booking }
  | { ok: false; reason: "full" | "rate_limited" | "unavailable" };

export async function createBooking(input: CleanBooking, clientKey: string): Promise<CreateResult> {
  try {
    const store = await ready();

    // Five requests per visitor per 10 minutes is plenty for real guests.
    if ((await store.hit(`booking:${clientKey}`, 600)) > 5) {
      return { ok: false, reason: "rate_limited" };
    }

    for (let attempt = 0; attempt < 3; attempt++) {
      const now = new Date().toISOString();
      const booking: Booking = {
        id: crypto.randomUUID(),
        ref: makeRef(),
        ...input,
        status: "pending",
        createdAt: now,
        updatedAt: now,
        isDemo: false,
      };
      try {
        const result = await store.create(booking, site.booking.seatsPerSlot);
        if (result === "full") return { ok: false, reason: "full" };
        return { ok: true, booking };
      } catch (error) {
        // A reference clash is very unlikely; pick a new one and retry.
        if ((error as { code?: string }).code === "23505") continue;
        throw error;
      }
    }
    throw new Error("Could not generate a unique booking reference");
  } catch (error) {
    console.error("[bookings] could not save a booking", error);
    return { ok: false, reason: "unavailable" };
  }
}

export async function listBookings(): Promise<Booking[]> {
  const store = await ready();
  return store.list();
}

export async function setBookingStatus(id: string, status: BookingStatus): Promise<Booking | null> {
  const store = await getStore();
  return store.updateStatus(id, status, new Date().toISOString());
}

/** Counts one attempt for `key` and says whether it's within the limit. */
export async function withinLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const store = await getStore();
  return (await store.hit(key, windowSeconds)) <= limit;
}

export function ownerEmail(): string {
  return process.env.OWNER_EMAIL || site.email;
}
