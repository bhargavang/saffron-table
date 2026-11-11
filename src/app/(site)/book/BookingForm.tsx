"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { addDays, formatDate, isIsoDate, isSlotInFuture, slotsFor, zonedNow, type ZonedNow } from "@/lib/bookings/dates";
import {
  bookingFields,
  checkField,
  emptyForm,
  validateBooking,
  type BookingField,
  type BookingForm as FormValues,
  type FieldErrors,
} from "@/lib/bookings/rules";
import type { SlotAvailability, SlotState } from "@/lib/bookings/service";
import { formatTime, site, whatsappLink } from "@/lib/site";

import { requestBooking, type BookingState } from "./actions";

const QUICK_DAYS = 6;

/** Ticks once a minute, so "today" and past time slots stay correct. */
function subscribeMinute(onChange: () => void) {
  const id = setInterval(onChange, 60_000);
  return () => clearInterval(id);
}

/**
 * Today's date and time in the restaurant's time zone, read in the browser.
 * It's null while server rendering, since the page is prerendered.
 */
function useZonedNow(): ZonedNow | null {
  const key = useSyncExternalStore(
    subscribeMinute,
    () => {
      const n = zonedNow();
      return `${n.date}|${n.minutes}`;
    },
    () => "",
  );
  if (!key) return null;
  const [date, minutes] = key.split("|");
  return { date, minutes: Number(minutes) };
}

type Availability = { key: string; slots: Record<string, SlotState> };

export function BookingForm() {
  const [state, formAction, pending] = useActionState<BookingState, FormData>(requestBooking, { status: "idle" });
  const [values, setValues] = useState<FormValues>(emptyForm);
  // A field's own check: a message, null when it passed, or absent when not checked yet.
  const [checked, setChecked] = useState<Partial<Record<BookingField, string | null>>>({});
  const [availability, setAvailability] = useState<Availability | null>(null);
  const now = useZonedNow();
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const serverErrors: FieldErrors = state.status === "error" ? (state.errors ?? {}) : {};
  const errorFor = (field: BookingField): string | undefined =>
    field in checked ? (checked[field] ?? undefined) : serverErrors[field];
  const errors = Object.fromEntries(
    (Object.keys(values) as BookingField[]).map((f) => [f, errorFor(f)]),
  ) as FieldErrors;

  // Ask the server which times are full for this date and party size.
  // Refetched after each submission too, in case a slot just filled up.
  const availabilityKey = isIsoDate(values.date) ? `${values.date}|${values.guests}` : "";
  useEffect(() => {
    if (!availabilityKey) return;
    const [date, guests] = availabilityKey.split("|");
    const controller = new AbortController();
    fetch(`/api/availability?date=${date}&guests=${guests}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: { slots: SlotAvailability[] }) => {
        setAvailability({
          key: availabilityKey,
          slots: Object.fromEntries(data.slots.map((s) => [s.time, s.state])),
        });
      })
      .catch((error: Error) => {
        // If the check fails, still show every time: the server checks again on submit.
        if (error.name !== "AbortError") setAvailability({ key: availabilityKey, slots: {} });
      });
    return () => controller.abort();
  }, [availabilityKey, state]);

  // Move focus to the message after a failed submission.
  useEffect(() => {
    if (state.status === "error") statusRef.current?.focus();
  }, [state]);

  const set = (field: BookingField, value: string) => {
    const next = { ...values, [field]: value };
    // Changing the date can make the chosen time invalid.
    if (field === "date" && values.time && !slotsFor(value).some((s) => s.time === values.time)) {
      next.time = "";
    }
    setValues(next);
    // Re-check a field as soon as the guest starts fixing it.
    if (errorFor(field) || field === "date" || field === "time") {
      setChecked((c) => ({ ...c, [field]: checkField(field, next) }));
    }
  };

  const blur = (field: BookingField) => {
    setChecked((c) => ({ ...c, [field]: checkField(field, values) }));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const result = validateBooking(values);
    if (!result.ok) {
      event.preventDefault();
      setChecked(Object.fromEntries(bookingFields.map((f) => [f, result.errors[f] ?? null])));
      const first = Object.keys(result.errors)[0];
      formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    // Let the server's answer show through for this submission.
    setChecked({});
  };

  const slotStates = availability && availability.key === availabilityKey ? availability.slots : null;

  if (state.status === "success") return <Confirmation booking={state.booking} />;

  const quickDates = now ? Array.from({ length: QUICK_DAYS }, (_, i) => addDays(now.date, i)) : [];
  const slots = isIsoDate(values.date) ? slotsFor(values.date) : [];
  const services = (["Lunch", "Dinner"] as const)
    .map((name) => ({ name, slots: slots.filter((s) => s.service === name) }))
    .filter((s) => s.slots.length > 0);

  const slotState = (time: string): SlotState => {
    if (now && !isSlotInFuture(values.date, time, now)) return "past";
    return slotStates?.[time] ?? "open";
  };

  return (
    <form ref={formRef} action={formAction} onSubmit={onSubmit} noValidate className="space-y-10">
      {state.status === "error" && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="rounded-2xl border border-chili/30 bg-chili/5 p-4 text-[15px] text-chili outline-none"
        >
          <p>{state.message}</p>
          {state.reason === "unavailable" && (
            <p className="mt-3 flex flex-wrap gap-3">
              <a href={site.phone.href} className="rounded-full bg-chili px-4 py-2 text-sm font-semibold text-cream">
                Call {site.phone.display}
              </a>
              <a
                href={whatsappLink("Hi! I'd like to book a table at Saffron Table.")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-chili/40 px-4 py-2 text-sm font-semibold"
              >
                WhatsApp us
              </a>
            </p>
          )}
        </div>
      )}

      {/* Step 1: when */}
      <fieldset>
        <legend className="font-display text-2xl font-semibold">When would you like to come?</legend>

        <div className="mt-5 grid gap-6 sm:grid-cols-[1fr_auto]">
          <div>
            <span id="date-label" className="block text-sm font-semibold">
              Date
            </span>
            <div role="group" aria-labelledby="date-label" className="mt-2 flex flex-wrap gap-2">
              {/* Same-size placeholders until the browser knows today's date, so nothing jumps */}
              {quickDates.length === 0 &&
                ["w-[4.6rem]", "w-[6.6rem]", "w-[4.6rem]", "w-[4.6rem]", "w-[4.6rem]", "w-[4.6rem]"].map((w, i) => (
                  <span key={i} aria-hidden="true" className={`h-[3.25rem] rounded-xl border border-sand bg-white/60 ${w}`} />
                ))}
              {quickDates.map((date, i) => {
                const selected = values.date === date;
                const closed = slotsFor(date).length === 0;
                return (
                  <button
                    key={date}
                    type="button"
                    disabled={closed}
                    aria-pressed={selected}
                    onClick={() => set("date", date)}
                    data-field={i === 0 ? "date" : undefined}
                    className={`rounded-xl border px-3 py-2 text-left text-sm transition-colors disabled:opacity-40 ${
                      selected
                        ? "border-cocoa bg-cocoa text-cream"
                        : "border-sand bg-white hover:border-ink/30"
                    }`}
                  >
                    <span className="block text-[11px] uppercase tracking-wide opacity-70">
                      {i === 0 ? "Today" : i === 1 ? "Tomorrow" : formatDate(date).split(",")[0]}
                    </span>
                    <span className="font-semibold">{formatDate(date).split(", ")[1]}</span>
                    {closed && <span className="sr-only">, closed</span>}
                  </button>
                );
              })}
              <label className="relative flex items-center gap-2 rounded-xl border border-dashed border-ink/25 bg-white px-3 py-2 text-sm">
                <span className="sr-only">Pick another date</span>
                <input
                  type="date"
                  name="date"
                  value={values.date}
                  min={now?.date}
                  max={now ? addDays(now.date, site.booking.daysAhead) : undefined}
                  onChange={(e) => set("date", e.target.value)}
                  onBlur={() => values.date && blur("date")}
                  aria-invalid={Boolean(errors.date)}
                  aria-describedby={errors.date ? "date-error" : undefined}
                  className="w-[9.5rem] bg-transparent font-semibold outline-none"
                />
              </label>
            </div>
            <FieldError id="date-error" message={errors.date} />
          </div>

          <div>
            <span id="guests-label" className="block text-sm font-semibold">
              Guests
            </span>
            <div className="mt-2 inline-flex items-center gap-1 rounded-xl border border-sand bg-white p-1">
              <StepButton
                label="Fewer guests"
                disabled={Number(values.guests) <= 1}
                onClick={() => set("guests", String(Math.max(1, Number(values.guests) - 1)))}
                path="M5 12h14"
              />
              <output
                aria-labelledby="guests-label"
                aria-live="polite"
                className="w-10 text-center text-lg font-semibold tabular-nums"
              >
                {values.guests}
              </output>
              <input type="hidden" name="guests" value={values.guests} />
              <StepButton
                label="More guests"
                disabled={Number(values.guests) >= site.booking.maxGuestsOnline}
                onClick={() =>
                  set("guests", String(Math.min(site.booking.maxGuestsOnline, Number(values.guests) + 1)))
                }
                path="M12 5v14M5 12h14"
              />
            </div>
            <p className="mt-2 max-w-[11rem] text-xs text-muted">
              More than {site.booking.maxGuestsOnline}? Call us.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <span id="time-label" className="block text-sm font-semibold">
            Time
          </span>
          {!isIsoDate(values.date) ? (
            <p className="mt-2 rounded-xl bg-sand/60 px-4 py-3 text-sm text-muted">
              Pick a date to see the times.
            </p>
          ) : services.length === 0 ? (
            <p className="mt-2 rounded-xl bg-sand/60 px-4 py-3 text-sm text-muted">We&apos;re closed that day.</p>
          ) : (
            <div role="radiogroup" aria-labelledby="time-label" aria-busy={slotStates === null} className="mt-2 space-y-4">
              {services.map((service) => (
                <div key={service.name}>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{service.name}</p>
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                    {service.slots.map((slot, i) => {
                      const st = slotState(slot.time);
                      const disabled = st === "past" || st === "full";
                      const checked = values.time === slot.time;
                      return (
                        <label
                          key={slot.time}
                          className={`relative flex cursor-pointer flex-col items-center rounded-xl border px-2 py-2.5 text-sm font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${
                            checked
                              ? "border-saffron-dark bg-saffron text-ink"
                              : disabled
                                ? "cursor-not-allowed border-sand bg-sand/40 text-muted/60"
                                : "border-sand bg-white hover:border-ink/30"
                          }`}
                        >
                          <input
                            type="radio"
                            name="time"
                            value={slot.time}
                            checked={checked}
                            disabled={disabled}
                            onChange={() => set("time", slot.time)}
                            data-field={i === 0 && service === services[0] ? "time" : undefined}
                            className="sr-only"
                          />
                          <span className={st === "full" ? "line-through" : undefined}>{formatTime(slot.time)}</span>
                          {st === "full" && <span className="text-[10px] font-medium uppercase">Full</span>}
                          {st === "few" && !checked && (
                            <span className="text-[10px] font-medium uppercase text-chili">Few left</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          <FieldError id="time-error" message={errors.time} />
        </div>
      </fieldset>

      {/* Step 2: who */}
      <fieldset className="space-y-5">
        <legend className="font-display text-2xl font-semibold">Your details</legend>

        <TextField
          field="name"
          label="Full name"
          autoComplete="name"
          value={values.name}
          error={errors.name}
          onChange={set}
          onBlur={blur}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            field="phone"
            label="Mobile number"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="98765 43210"
            value={values.phone}
            error={errors.phone}
            onChange={set}
            onBlur={blur}
          />
          <TextField
            field="email"
            label="Email"
            type="email"
            autoComplete="email"
            hint="We'll send your confirmation here."
            value={values.email}
            error={errors.email}
            onChange={set}
            onBlur={blur}
          />
        </div>

        <div>
          <label htmlFor="occasion" className="text-sm font-semibold">
            Occasion <span className="font-normal text-muted">(optional)</span>
          </label>
          <select
            id="occasion"
            name="occasion"
            value={values.occasion}
            onChange={(e) => set("occasion", e.target.value)}
            className="mt-2 block w-full rounded-xl border border-sand bg-white px-4 py-3 text-[15px] outline-none focus:border-ink/40 focus:ring-2 focus:ring-saffron/40"
          >
            <option value="">No special occasion</option>
            {site.booking.occasions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="text-sm font-semibold">
            Anything we should know? <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            maxLength={300}
            value={values.notes}
            onChange={(e) => set("notes", e.target.value)}
            onBlur={() => blur("notes")}
            placeholder="Allergies, a high chair, a table by the window…"
            aria-invalid={Boolean(errors.notes)}
            className="mt-2 block w-full rounded-xl border border-sand bg-white px-4 py-3 text-[15px] outline-none placeholder:text-muted/60 focus:border-ink/40 focus:ring-2 focus:ring-saffron/40"
          />
          <FieldError id="notes-error" message={errors.notes} />
        </div>

        {/* Honeypot: hidden from people, bots tend to fill it in */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
          <label>
            Leave this empty
            <input type="text" name="hp_field" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </fieldset>

      <div className="border-t border-sand pt-6">
        {site.demo.show && (
          <p className="mb-4 rounded-xl bg-saffron/15 px-4 py-3 text-sm text-ink/80">
            <strong>This is a demo site.</strong> Please use made-up details: bookings here are visible
            to anyone with the demo admin login.
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cocoa px-8 py-4 text-base font-semibold text-cream transition-colors hover:bg-cocoa-light disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          {pending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/30 border-t-cream" aria-hidden="true" />
              Sending request…
            </>
          ) : (
            "Request booking"
          )}
        </button>
        <p className="mt-3 text-sm text-muted">
          We&apos;ll email you once your table is confirmed, usually within the hour.
        </p>
      </div>
    </form>
  );
}

function TextField({
  field,
  label,
  value,
  error,
  hint,
  onChange,
  onBlur,
  ...input
}: {
  field: BookingField;
  label: string;
  value: string;
  error?: string;
  hint?: string;
  onChange: (field: BookingField, value: string) => void;
  onBlur: (field: BookingField) => void;
} & Pick<React.InputHTMLAttributes<HTMLInputElement>, "type" | "autoComplete" | "inputMode" | "placeholder">) {
  const describedBy = [error && `${field}-error`, hint && `${field}-hint`].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={field} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={field}
        name={field}
        data-field={field}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        onBlur={() => onBlur(field)}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-[15px] outline-none placeholder:text-muted/50 focus:ring-2 focus:ring-saffron/40 ${
          error ? "border-chili/60" : "border-sand focus:border-ink/40"
        }`}
        {...input}
      />
      {hint && !error && (
        <p id={`${field}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      <FieldError id={`${field}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-chili">
      {message}
    </p>
  );
}

function StepButton({ label, onClick, disabled, path }: { label: string; onClick: () => void; disabled?: boolean; path: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-sand disabled:opacity-30"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
        <path d={path} />
      </svg>
    </button>
  );
}

function Confirmation({
  booking,
}: {
  booking: { ref: string; name: string; email: string; date: string; time: string; guests: number };
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    ref.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div ref={ref} tabIndex={-1} className="scroll-mt-24 rounded-3xl border border-sand bg-white p-7 outline-none sm:p-10" role="status">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-leaf/15 text-leaf">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight">
        Request sent, {booking.name.split(" ")[0]}!
      </h2>
      <p className="mt-3 text-lg leading-relaxed text-muted">
        We&apos;ve emailed a copy to <strong className="text-ink">{booking.email}</strong>. We&apos;ll confirm your
        table by email shortly.
      </p>

      <dl className="mt-7 grid grid-cols-2 gap-5 rounded-2xl bg-cream p-5 sm:grid-cols-4">
        <Detail label="Date" value={formatDate(booking.date)} />
        <Detail label="Time" value={formatTime(booking.time)} />
        <Detail label="Guests" value={String(booking.guests)} />
        <Detail label="Reference" value={booking.ref} />
      </dl>

      <p className="mt-6 text-sm text-muted">
        Need to change something? Call us on{" "}
        <a href={site.phone.href} className="font-semibold text-ink underline underline-offset-2">
          {site.phone.display}
        </a>{" "}
        and quote your reference.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link href="/menu" className="rounded-full bg-cocoa px-6 py-3 font-semibold text-cream hover:bg-cocoa-light">
          Browse the menu
        </Link>
        <Link href="/" className="rounded-full border border-ink/15 px-6 py-3 font-semibold hover:border-ink">
          Back to home
        </Link>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}
