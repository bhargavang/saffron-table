import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";

/**
 * A hashed form of the visitor's IP address, used as a rate-limit key.
 * The raw IP is never stored.
 */
export async function clientKey(): Promise<string> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip")?.trim() ||
    "unknown";
  return createHash("sha256").update(`saffron-table:${ip}`).digest("hex").slice(0, 32);
}
