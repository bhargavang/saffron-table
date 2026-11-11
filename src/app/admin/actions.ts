"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { after } from "next/server";

import { adminConfigured, checkPassword, requireAdmin } from "@/lib/admin-auth";
import { ADMIN_COOKIE, createSessionToken, SESSION_SECONDS } from "@/lib/admin-session";
import { setBookingStatus, withinLimit } from "@/lib/bookings/service";
import type { BookingStatus } from "@/lib/bookings/rules";
import { sendEmail } from "@/lib/email/send";
import { guestConfirmed, guestDeclined } from "@/lib/email/templates";
import { clientKey } from "@/lib/request";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminConfigured()) {
    return { error: "Admin isn't set up yet. Add ADMIN_PASSWORD to .env.local (see .env.example)." };
  }

  // Eight tries per visitor per 15 minutes, counted in the database so the
  // limit holds across server instances. If the store is down, refuse.
  let allowed = false;
  try {
    allowed = await withinLimit(`login:${await clientKey()}`, 8, 15 * 60);
  } catch (error) {
    console.error("[admin] rate limit check failed", error);
    return { error: "Sign-in is unavailable right now. Please try again shortly." };
  }
  if (!allowed) return { error: "Too many attempts. Please wait 15 minutes and try again." };

  const password = String(formData.get("password") ?? "");
  if (!(await checkPassword(password))) {
    return { error: "That password isn't right." };
  }

  (await cookies()).set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  redirect("/admin");
}

export async function logout(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

const statuses: BookingStatus[] = ["pending", "confirmed", "declined"];

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<{ ok: boolean }> {
  await requireAdmin();
  if (!statuses.includes(status) || typeof id !== "string") return { ok: false };

  const booking = await setBookingStatus(id, status);
  if (!booking) return { ok: false };

  // Let the guest know. Sample bookings use example.com addresses, so skip them.
  if (!booking.isDemo && (status === "confirmed" || status === "declined")) {
    after(async () => {
      try {
        await sendEmail(status === "confirmed" ? guestConfirmed(booking) : guestDeclined(booking));
      } catch (error) {
        console.error("[email] could not send status email", error);
      }
    });
  }

  refresh();
  return { ok: true };
}
