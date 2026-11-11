import "server-only";

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Booking } from "../rules";
import type { BookingStore } from "./types";

/**
 * Stores bookings in a JSON file. Zero setup, good for running the project
 * locally or on a single small server. It is not meant for serverless hosting
 * or several server instances: use PostgreSQL there (see postgres.ts).
 */

type Data = {
  version: 1;
  bookings: Booking[];
  /** Rate-limit hits: key → timestamps (ms). */
  hits: Record<string, number[]>;
};

const empty = (): Data => ({ version: 1, bookings: [], hits: {} });

export function dataDir(): string {
  if (process.env.DATA_DIR) return process.env.DATA_DIR;
  // Vercel's file system is read-only apart from /tmp, which is wiped often.
  // That keeps a database-less deploy working as a demo, nothing more.
  if (process.env.VERCEL) return "/tmp/saffron-table";
  return path.join(/* turbopackIgnore: true */ process.cwd(), ".data");
}

export function createFileStore(): BookingStore {
  const file = path.join(dataDir(), "bookings.json");

  async function load(): Promise<Data> {
    try {
      const parsed = JSON.parse(await readFile(file, "utf8")) as Data;
      return { ...empty(), ...parsed };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return empty();
      throw error;
    }
  }

  async function save(data: Data) {
    await mkdir(path.dirname(file), { recursive: true });
    // Write to a temp file and rename it, so a crash mid-write never leaves
    // a half-written bookings file behind.
    const tmp = `${file}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(data, null, 2));
    await rename(tmp, file);
  }

  // Writes go through one queue so read-modify-write steps in this process
  // never interleave.
  let queue: Promise<unknown> = Promise.resolve();
  function update<T>(fn: (data: Data) => T | Promise<T>): Promise<T> {
    const run = queue.then(async () => {
      const data = await load();
      const result = await fn(data);
      await save(data);
      return result;
    });
    queue = run.catch(() => undefined);
    return run;
  }

  const takesSeats = (b: Booking) => b.status !== "declined";

  return {
    kind: "file",

    async list() {
      const { bookings } = await load();
      return [...bookings].sort(
        (a, b) => b.date.localeCompare(a.date) || a.time.localeCompare(b.time),
      );
    },

    async seatsTaken(date) {
      const { bookings } = await load();
      const taken: Record<string, number> = {};
      for (const b of bookings) {
        if (b.date === date && takesSeats(b)) taken[b.time] = (taken[b.time] ?? 0) + b.guests;
      }
      return taken;
    },

    create(booking, seatsPerSlot) {
      return update((data) => {
        const taken = data.bookings
          .filter((b) => b.date === booking.date && b.time === booking.time && takesSeats(b))
          .reduce((sum, b) => sum + b.guests, 0);
        if (taken + booking.guests > seatsPerSlot) return "full" as const;
        data.bookings.push(booking);
        return "created" as const;
      });
    },

    updateStatus(id, status, updatedAt) {
      return update((data) => {
        const booking = data.bookings.find((b) => b.id === id);
        if (!booking) return null;
        booking.status = status;
        booking.updatedAt = updatedAt;
        return { ...booking };
      });
    },

    async refreshDemo(freshUntil, makeDemo) {
      const current = await load();
      const fresh = current.bookings.some((b) => b.isDemo && b.date >= freshUntil);
      if (fresh) return;
      await update((data) => {
        if (data.bookings.some((b) => b.isDemo && b.date >= freshUntil)) return;
        data.bookings = [...data.bookings.filter((b) => !b.isDemo), ...makeDemo()];
      });
    },

    hit(key, windowSeconds) {
      return update((data) => {
        const now = Date.now();
        const since = now - windowSeconds * 1000;
        const recent = (data.hits[key] ?? []).filter((t) => t > since);
        recent.push(now);
        data.hits[key] = recent;
        // Drop keys with nothing recent so the file doesn't grow forever.
        for (const [k, times] of Object.entries(data.hits)) {
          if (times.every((t) => t < now - 86_400_000)) delete data.hits[k];
        }
        return recent.length;
      });
    },
  };
}
