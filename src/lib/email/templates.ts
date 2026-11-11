import { formatDate } from "@/lib/bookings/dates";
import { formatPhone, type Booking } from "@/lib/bookings/rules";
import { formatTime, site, siteUrl } from "@/lib/site";

import type { Email } from "./send";

/**
 * Plain, table-based HTML so it renders the same in Gmail, Outlook and phone
 * mail apps. Every value that came from a guest is escaped.
 */

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function summaryRows(b: Booking): [string, string][] {
  const rows: [string, string][] = [
    ["Date", formatDate(b.date, { long: true })],
    ["Time", formatTime(b.time)],
    ["Guests", String(b.guests)],
    ["Name", b.name],
    ["Reference", b.ref],
  ];
  if (b.occasion) rows.push(["Occasion", b.occasion]);
  if (b.notes) rows.push(["Notes", b.notes]);
  return rows;
}

function layout({ heading, intro, rows, outro, button }: {
  heading: string;
  intro: string;
  rows: [string, string][];
  outro: string;
  button?: { label: string; href: string };
}): string {
  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 0;color:#6e6057;font-size:14px;width:110px;vertical-align:top">${esc(label)}</td>
          <td style="padding:8px 0;color:#211a16;font-size:15px;font-weight:600">${esc(value)}</td>
        </tr>`,
    )
    .join("");

  const cta = button
    ? `<p style="margin:28px 0 0"><a href="${esc(button.href)}" style="display:inline-block;background:#eaa53f;color:#211a16;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px">${esc(button.label)}</a></p>`
    : "";

  return `<!doctype html>
<html lang="en">
<body style="margin:0;background:#fbf6ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fbf6ee;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #f2e8d8">
        <tr><td style="background:#241a15;padding:22px 28px">
          <span style="color:#eaa53f;font-size:20px;font-weight:700;font-family:Georgia,serif">${esc(site.name)}</span>
        </td></tr>
        <tr><td style="padding:28px">
          <h1 style="margin:0 0 12px;font-size:22px;color:#211a16;font-family:Georgia,serif">${esc(heading)}</h1>
          <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#3b302a">${esc(intro)}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #f2e8d8;border-bottom:1px solid #f2e8d8">${tableRows}</table>
          <p style="margin:18px 0 0;font-size:15px;line-height:1.6;color:#3b302a">${esc(outro)}</p>
          ${cta}
        </td></tr>
        <tr><td style="padding:18px 28px;background:#f2e8d8;color:#6e6057;font-size:12px;line-height:1.6">
          ${esc(site.name)} · ${esc(site.address.line1)}, ${esc(site.address.line2)} · ${esc(site.phone.display)}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function textVersion(heading: string, intro: string, rows: [string, string][], outro: string, link?: string) {
  return [
    heading,
    "",
    intro,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    outro,
    ...(link ? ["", link] : []),
    "",
    `${site.name} · ${site.address.line1}, ${site.address.line2} · ${site.phone.display}`,
  ].join("\n");
}

function build(
  to: string,
  subject: string,
  parts: { heading: string; intro: string; rows: [string, string][]; outro: string; button?: { label: string; href: string } },
  replyTo?: string,
): Email {
  return {
    to,
    subject,
    replyTo,
    html: layout(parts),
    text: textVersion(parts.heading, parts.intro, parts.rows, parts.outro, parts.button?.href),
  };
}

const firstName = (b: Booking) => b.name.split(" ")[0];

export function guestRequestReceived(b: Booking): Email {
  return build(b.email, `We've got your booking request (${b.ref})`, {
    heading: `Thanks, ${firstName(b)}!`,
    intro: `We've received your request for a table. We'll confirm it by email shortly, usually within the hour during opening times.`,
    rows: summaryRows(b),
    outro: `Need to change something? Call us on ${site.phone.display} and quote your reference.`,
  });
}

export function guestConfirmed(b: Booking): Email {
  return build(b.email, `Your table is confirmed: ${formatDate(b.date)}, ${formatTime(b.time)}`, {
    heading: "See you soon!",
    intro: `Good news, ${firstName(b)}: your table is confirmed. We'll hold it for 15 minutes after your booking time.`,
    rows: summaryRows(b),
    outro: `Running late or need to cancel? Call us on ${site.phone.display}.`,
    button: { label: "Get directions", href: site.address.mapsUrl },
  });
}

export function guestDeclined(b: Booking): Email {
  return build(b.email, `About your booking for ${formatDate(b.date)} (${b.ref})`, {
    heading: "Sorry, we're full then",
    intro: `Hi ${firstName(b)}, we couldn't fit your group in at the time you asked for. We're sorry about that.`,
    rows: summaryRows(b),
    outro: `Give us a call on ${site.phone.display} and we'll do our best to find you another time.`,
    button: { label: "Pick another time", href: `${siteUrl()}/book` },
  });
}

export function ownerNewBooking(b: Booking, ownerEmail: string): Email {
  return build(
    ownerEmail,
    `New booking request: ${b.guests} guests, ${formatDate(b.date)} at ${formatTime(b.time)}`,
    {
      heading: "New booking request",
      intro: `${b.name} wants a table. Accept or decline it from the bookings page.`,
      rows: [...summaryRows(b), ["Phone", formatPhone(b.phone)], ["Email", b.email]],
      outro: "The guest has been told you'll confirm shortly.",
      button: { label: "Open bookings", href: `${siteUrl()}/admin` },
    },
    b.email,
  );
}
