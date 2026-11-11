"use server";

import { after } from "next/server";

import { createBooking, ownerEmail } from "@/lib/bookings/service";
import { readForm, validateBooking, type FieldErrors } from "@/lib/bookings/rules";
import { sendEmail } from "@/lib/email/send";
import { guestRequestReceived, ownerNewBooking } from "@/lib/email/templates";
import { clientKey } from "@/lib/request";
import { site } from "@/lib/site";

export type BookingState =
  | { status: "idle" }
  | { status: "error"; message: string; reason?: "full" | "rate_limited" | "unavailable"; errors?: FieldErrors }
  | {
      status: "success";
      booking: { ref: string; name: string; email: string; date: string; time: string; guests: number };
    };

export async function requestBooking(_prev: BookingState, formData: FormData): Promise<BookingState> {
  // Hidden field that only bots fill in. Give them a vague error and save nothing.
  if (formData.get("hp_field")) {
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  // Validation runs again here: the browser checks are only for convenience.
  const result = validateBooking(readForm(formData));
  if (!result.ok) {
    return { status: "error", message: "Please check the highlighted fields.", errors: result.errors };
  }

  const created = await createBooking(result.value, await clientKey());

  if (!created.ok) {
    switch (created.reason) {
      case "full":
        return {
          status: "error",
          reason: "full",
          message: "Sorry, that time has just filled up. Please pick another time.",
          errors: { time: "This time is now full." },
        };
      case "rate_limited":
        return {
          status: "error",
          reason: "rate_limited",
          message: `You've sent a few requests in a short time. Please wait a few minutes, or call us on ${site.phone.display}.`,
        };
      case "unavailable":
        return {
          status: "error",
          reason: "unavailable",
          message: `Our booking system isn't responding right now. Please call us on ${site.phone.display} or message us on WhatsApp and we'll book you in.`,
        };
    }
  }

  const { booking } = created;

  // Send emails after the response, so the guest isn't kept waiting and an
  // email outage never loses a booking.
  after(async () => {
    const results = await Promise.allSettled([
      sendEmail(guestRequestReceived(booking)),
      sendEmail(ownerNewBooking(booking, ownerEmail())),
    ]);
    for (const r of results) {
      if (r.status === "rejected") console.error("[email] could not send booking email", r.reason);
    }
  });

  return {
    status: "success",
    booking: {
      ref: booking.ref,
      name: booking.name,
      email: booking.email,
      date: booking.date,
      time: booking.time,
      guests: booking.guests,
    },
  };
}
