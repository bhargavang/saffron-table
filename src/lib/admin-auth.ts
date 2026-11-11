import "server-only";

import { createHash, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { ADMIN_COOKIE, demoPasswordInUse, isValidSessionToken } from "./admin-session";

const scrypt = promisify(scryptCb) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD || demoPasswordInUse());
}

/**
 * Checks the admin password. In production, set ADMIN_PASSWORD_HASH
 * (made with `npm run hash-password`) so the password itself is never stored.
 * ADMIN_PASSWORD (plain) is there for local development, and the public demo
 * password in site.ts covers the demo when neither is set.
 */
export async function checkPassword(input: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash) {
    const [scheme, saltB64, keyB64] = hash.split(":");
    if (scheme !== "scrypt" || !saltB64 || !keyB64) return false;
    const expected = Buffer.from(keyB64, "base64url");
    const actual = await scrypt(input, Buffer.from(saltB64, "base64url"), expected.length);
    return timingSafeEqual(expected, actual);
  }

  const plain = process.env.ADMIN_PASSWORD || demoPasswordInUse();
  if (!plain) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(plain).digest();
  return timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  // The expiry check reads the clock, so this must run per request.
  await connection();
  return isValidSessionToken(token);
}

/** Use at the top of every admin page and admin Server Action. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
