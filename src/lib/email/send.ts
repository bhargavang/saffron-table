import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { dataDir } from "@/lib/bookings/store/file";

export type Email = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

/**
 * Sends an email through Resend when RESEND_API_KEY is set. Otherwise it
 * prints the email to the server log and saves the HTML under
 * .data/outbox/ so you can open it in a browser while developing.
 */
export async function sendEmail(email: Email): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) return sendWithResend(email, apiKey);
  return logEmail(email);
}

async function sendWithResend(email: Email, apiKey: string) {
  const from = process.env.EMAIL_FROM || "Saffron Table <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [email.to],
      subject: email.subject,
      html: email.html,
      text: email.text,
      reply_to: email.replyTo,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new Error(`Resend returned ${res.status}: ${await res.text()}`);
  }
}

async function logEmail(email: Email) {
  const line = "─".repeat(60);
  console.info(
    `\n${line}\n📧  Email (console mode, not sent)\nTo:      ${email.to}\nSubject: ${email.subject}\n${line}\n${email.text}\n${line}\n`,
  );

  if (process.env.VERCEL) return;
  try {
    const dir = path.join(dataDir(), "outbox");
    await mkdir(dir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const slug = email.subject.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    await writeFile(path.join(dir, `${stamp}-${slug}.html`), email.html);
  } catch {
    // The outbox copy is a convenience; never fail a booking over it.
  }
}
