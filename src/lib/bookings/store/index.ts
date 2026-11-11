import "server-only";

import type { BookingStore } from "./types";

export type { BookingStore } from "./types";

let store: Promise<BookingStore> | null = null;

/**
 * Picks the storage backend once per server process:
 * PostgreSQL when DATABASE_URL is set, otherwise a local JSON file.
 */
export function getStore(): Promise<BookingStore> {
  store ??= (async () => {
    const url = process.env.DATABASE_URL;
    if (url) {
      const { createPostgresStore } = await import("./postgres");
      return createPostgresStore(url);
    }
    const { createFileStore } = await import("./file");
    return createFileStore();
  })();
  return store;
}
