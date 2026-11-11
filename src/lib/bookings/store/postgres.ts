import "server-only";

import postgres from "postgres";

import type { Booking, BookingStatus } from "../rules";
import type { BookingStore } from "./types";

/**
 * PostgreSQL store. Works with Neon, Supabase or any Postgres 13+.
 * Tables are created on first use, so a fresh database needs no setup step.
 * Capacity checks run inside a transaction with a per-slot lock, so the
 * guard holds however many server instances are running.
 */

const SCHEMA = `
select pg_advisory_xact_lock(724001);

create table if not exists bookings (
  id          uuid primary key,
  ref         text not null unique,
  name        text not null,
  phone       text not null,
  email       text not null,
  date        date not null,
  time        time not null,
  guests      smallint not null check (guests between 1 and 50),
  occasion    text,
  notes       text,
  status      text not null default 'pending'
              check (status in ('pending', 'confirmed', 'declined')),
  is_demo     boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists bookings_date_time_idx on bookings (date, time);

create table if not exists rate_limit_hits (
  key  text not null,
  at   timestamptz not null default now()
);

create index if not exists rate_limit_hits_key_at_idx on rate_limit_hits (key, at);
`;

type Row = {
  id: string;
  ref: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  occasion: string | null;
  notes: string | null;
  status: BookingStatus;
  is_demo: boolean;
  created_at: Date;
  updated_at: Date;
};

const fromRow = (r: Row): Booking => ({
  id: r.id,
  ref: r.ref,
  name: r.name,
  phone: r.phone,
  email: r.email,
  date: r.date,
  time: r.time,
  guests: r.guests,
  occasion: r.occasion,
  notes: r.notes,
  status: r.status,
  isDemo: r.is_demo,
  createdAt: new Date(r.created_at).toISOString(),
  updatedAt: new Date(r.updated_at).toISOString(),
});

const toRow = (b: Booking) => ({
  id: b.id,
  ref: b.ref,
  name: b.name,
  phone: b.phone,
  email: b.email,
  date: b.date,
  time: b.time,
  guests: b.guests,
  occasion: b.occasion,
  notes: b.notes,
  status: b.status,
  is_demo: b.isDemo,
  created_at: b.createdAt,
  updated_at: b.updatedAt,
});

export function createPostgresStore(url: string): BookingStore {
  const sql = postgres(url, {
    // Serverless functions each hold their own small pool; keep it small and
    // put a pooler (Neon/Supabase pooled URL) in front for real traffic.
    max: Number(process.env.DATABASE_POOL_MAX ?? 5),
    idle_timeout: 20,
    // Fail fast when the database is down so pages can show a fallback.
    connect_timeout: 8,
    // Transaction-mode poolers (PgBouncer, Supavisor) don't keep prepared
    // statements between transactions.
    prepare: false,
    onnotice: () => {},
  });

  let ready: Promise<void> | null = null;
  function migrate(): Promise<void> {
    ready ??= sql
      .unsafe(SCHEMA)
      .then(() => undefined)
      .catch((error) => {
        ready = null; // try again on the next request
        throw error;
      });
    return ready;
  }

  const columns = sql`
    id, ref, name, phone, email,
    to_char(date, 'YYYY-MM-DD') as date,
    to_char(time, 'HH24:MI') as time,
    guests, occasion, notes, status, is_demo, created_at, updated_at
  `;

  return {
    kind: "postgres",

    async list() {
      await migrate();
      const rows = await sql<Row[]>`
        select ${columns} from bookings order by date desc, time asc
      `;
      return rows.map(fromRow);
    },

    async seatsTaken(date) {
      await migrate();
      const rows = await sql<{ time: string; seats: number }[]>`
        select to_char(time, 'HH24:MI') as time, sum(guests)::int as seats
        from bookings
        where date = ${date} and status <> 'declined'
        group by time
      `;
      return Object.fromEntries(rows.map((r) => [r.time, r.seats]));
    },

    async create(booking, seatsPerSlot) {
      await migrate();
      return sql.begin(async (tx) => {
        // Only one booking per slot is checked and saved at a time.
        await tx`select pg_advisory_xact_lock(hashtext(${`slot:${booking.date}:${booking.time}`}))`;
        const [{ taken }] = await tx<{ taken: number }[]>`
          select coalesce(sum(guests), 0)::int as taken
          from bookings
          where date = ${booking.date} and time = ${booking.time} and status <> 'declined'
        `;
        if (taken + booking.guests > seatsPerSlot) return "full" as const;
        await tx`insert into bookings ${tx(toRow(booking))}`;
        return "created" as const;
      });
    },

    async updateStatus(id, status, updatedAt) {
      await migrate();
      const rows = await sql<Row[]>`
        update bookings set status = ${status}, updated_at = ${updatedAt}
        where id = ${id}
        returning ${columns}
      `;
      return rows[0] ? fromRow(rows[0]) : null;
    },

    async refreshDemo(freshUntil, makeDemo) {
      await migrate();
      type Fresh = { fresh: boolean }[];
      const [before] = await sql<Fresh>`
        select exists (select 1 from bookings where is_demo and date >= ${freshUntil}) as fresh
      `;
      if (before.fresh) return;
      await sql.begin(async (tx) => {
        await tx`select pg_advisory_xact_lock(724002)`;
        const [now] = await tx<Fresh>`
          select exists (select 1 from bookings where is_demo and date >= ${freshUntil}) as fresh
        `;
        if (now.fresh) return; // another instance just did it
        await tx`delete from bookings where is_demo`;
        const rows = makeDemo().map(toRow);
        if (rows.length > 0) await tx`insert into bookings ${tx(rows)}`;
      });
    },

    async hit(key, windowSeconds) {
      await migrate();
      const [{ count }] = await sql<{ count: number }[]>`
        with added as (insert into rate_limit_hits (key) values (${key}) returning 1)
        select (
          select count(*) from rate_limit_hits
          where key = ${key} and at > now() - make_interval(secs => ${windowSeconds})
        )::int + 1 as count
      `;
      // Light housekeeping now and then instead of a cron job.
      if (Math.random() < 0.05) {
        sql`delete from rate_limit_hits where at < now() - interval '1 day'`.catch(() => {});
      }
      return count;
    },
  };
}
