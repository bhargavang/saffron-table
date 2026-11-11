import type { NextRequest } from "next/server";

import { isIsoDate } from "@/lib/bookings/dates";
import { getAvailability } from "@/lib/bookings/service";
import { site } from "@/lib/site";

/**
 * GET /api/availability?date=2026-11-14&guests=4
 * Which times can be booked on a date. Used by the booking form.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const date = params.get("date") ?? "";
  const guests = Math.min(
    Math.max(Number.parseInt(params.get("guests") ?? "2", 10) || 2, 1),
    site.booking.maxGuestsOnline,
  );

  if (!isIsoDate(date)) {
    return Response.json({ error: "Use ?date=YYYY-MM-DD" }, { status: 400 });
  }

  try {
    const slots = await getAvailability(date, guests);
    return Response.json({ date, guests, slots }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[availability] store unavailable", error);
    return Response.json({ error: "Availability is unavailable right now" }, { status: 503 });
  }
}
