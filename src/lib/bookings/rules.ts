import { site } from "@/lib/site";

import { addDays, isIsoDate, isSlotInFuture, slotsFor, zonedNow } from "./dates";

/**
 * Booking types and validation. This file has no server-only imports, so the
 * booking form runs the same checks in the browser for instant feedback. The
 * server always runs them again before saving anything.
 */

export type BookingStatus = "pending" | "confirmed" | "declined";

export type Booking = {
  id: string;
  /** Short code the guest can quote, e.g. ST-7K3QM */
  ref: string;
  name: string;
  /** E.164, e.g. +919876543210 */
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  occasion: string | null;
  notes: string | null;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  /** Seeded sample data, refreshed automatically so the admin never looks empty. */
  isDemo: boolean;
};

export const bookingFields = [
  "date",
  "time",
  "guests",
  "name",
  "phone",
  "email",
  "occasion",
  "notes",
] as const;

export type BookingField = (typeof bookingFields)[number];
export type BookingForm = Record<BookingField, string>;
export type FieldErrors = Partial<Record<BookingField, string>>;

export type CleanBooking = {
  date: string;
  time: string;
  guests: number;
  name: string;
  phone: string;
  email: string;
  occasion: string | null;
  notes: string | null;
};

export const emptyForm: BookingForm = {
  date: "",
  time: "",
  guests: "2",
  name: "",
  phone: "",
  email: "",
  occasion: "",
  notes: "",
};

export function readForm(data: FormData): BookingForm {
  const form = { ...emptyForm };
  for (const field of bookingFields) {
    const value = data.get(field);
    form[field] = typeof value === "string" ? value : "";
  }
  return form;
}

/** Accepts Indian mobiles in the usual ways people type them, or any +country number. */
export function normalisePhone(raw: string): string | null {
  const compact = raw.replace(/[\s\-().]/g, "");
  const indian = compact.match(/^(?:\+?91|0)?([6-9]\d{9})$/);
  if (indian) return `+91${indian[1]}`;
  if (/^\+[1-9]\d{7,14}$/.test(compact)) return compact;
  return null;
}

/** +919876543210 → +91 98765 43210 */
export function formatPhone(phone: string): string {
  const m = phone.match(/^\+91(\d{5})(\d{5})$/);
  return m ? `+91 ${m[1]} ${m[2]}` : phone;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;

/** Validates one field. Returns an error message, or null when it's fine. */
export function checkField(field: BookingField, form: BookingForm, now: Date = new Date()): string | null {
  const value = form[field].trim();
  const today = zonedNow(now);

  switch (field) {
    case "date": {
      if (!value) return "Pick a date.";
      if (!isIsoDate(value)) return "That date doesn't look right.";
      if (value < today.date) return "That date has already passed.";
      if (value > addDays(today.date, site.booking.daysAhead))
        return `We take bookings up to ${site.booking.daysAhead} days ahead.`;
      if (slotsFor(value).length === 0) return "We're closed that day.";
      if (!slotsFor(value).some((s) => isSlotInFuture(value, s.time, today)))
        return "There are no times left today. Try tomorrow.";
      return null;
    }
    case "time": {
      if (!value) return "Pick a time.";
      const date = form.date.trim();
      if (!isIsoDate(date)) return null; // the date error covers it
      if (!slotsFor(date).some((s) => s.time === value)) return "Pick one of the times listed.";
      if (!isSlotInFuture(date, value, today))
        return `Same-day bookings need ${site.booking.minNoticeMinutes} minutes' notice.`;
      return null;
    }
    case "guests": {
      const n = Number(value);
      if (!Number.isInteger(n) || n < 1) return "How many guests?";
      if (n > site.booking.maxGuestsOnline)
        return `For more than ${site.booking.maxGuestsOnline} guests, please call us.`;
      return null;
    }
    case "name": {
      if (value.length < 2) return "Please enter your name.";
      if (value.length > 60) return "That name is a bit long. Keep it under 60 characters.";
      if (!NAME.test(value)) return "Use letters only (spaces, dots and hyphens are fine).";
      return null;
    }
    case "phone": {
      if (!value) return "We need a number to reach you.";
      if (!normalisePhone(value)) return "Enter a 10-digit mobile number, e.g. 98765 43210.";
      return null;
    }
    case "email": {
      if (!value) return "We'll send your confirmation here.";
      if (value.length > 120 || !EMAIL.test(value)) return "That email address doesn't look right.";
      return null;
    }
    case "occasion": {
      if (value && !(site.booking.occasions as readonly string[]).includes(value))
        return "Pick an occasion from the list.";
      return null;
    }
    case "notes": {
      if (value.length > 300) return "Keep notes under 300 characters.";
      return null;
    }
  }
}

export type ValidationResult =
  | { ok: true; value: CleanBooking }
  | { ok: false; errors: FieldErrors };

export function validateBooking(form: BookingForm, now: Date = new Date()): ValidationResult {
  const errors: FieldErrors = {};
  for (const field of bookingFields) {
    const error = checkField(field, form, now);
    if (error) errors[field] = error;
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      date: form.date.trim(),
      time: form.time.trim(),
      guests: Number(form.guests),
      name: form.name.trim().replace(/\s+/g, " "),
      phone: normalisePhone(form.phone)!,
      email: form.email.trim().toLowerCase(),
      occasion: form.occasion.trim() || null,
      notes: form.notes.trim() || null,
    },
  };
}
