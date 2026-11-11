import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signed session token for the admin: "<expiry>.<signature>". Nothing is kept
 * in server memory, so any number of server instances can check it.
 * Used by both proxy.ts and the admin pages.
 */

export const ADMIN_COOKIE = "st_admin";
export const SESSION_SECONDS = 12 * 60 * 60;

function secret(): string | null {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD_HASH ||
    process.env.ADMIN_PASSWORD ||
    null
  );
}

function sign(expires: number, key: string): string {
  return createHmac("sha256", key).update(`saffron-admin:${expires}`).digest("base64url");
}

export function createSessionToken(now: number = Date.now()): string {
  const key = secret();
  if (!key) throw new Error("ADMIN_PASSWORD is not set");
  const expires = Math.floor(now / 1000) + SESSION_SECONDS;
  return `${expires}.${sign(expires, key)}`;
}

export function isValidSessionToken(token: string | undefined, now: number = Date.now()): boolean {
  const key = secret();
  if (!key || !token) return false;
  const [expPart, sig] = token.split(".");
  const expires = Number(expPart);
  if (!Number.isInteger(expires) || !sig || expires * 1000 < now) return false;
  const expected = Buffer.from(sign(expires, key));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
