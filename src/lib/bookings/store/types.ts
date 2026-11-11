import type { Booking, BookingStatus } from "../rules";

/**
 * Everything the app needs from storage. There are two implementations:
 * a JSON file for local development (file.ts) and PostgreSQL for production
 * (postgres.ts). The app picks one in store/index.ts based on DATABASE_URL.
 */
export interface BookingStore {
  readonly kind: "file" | "postgres";

  /** All bookings, newest date first. */
  list(): Promise<Booking[]>;

  /** Seats already taken (pending + confirmed) for each time on a date. */
  seatsTaken(date: string): Promise<Record<string, number>>;

  /**
   * Saves a booking unless its time slot would go over `seatsPerSlot`.
   * The capacity check and the insert happen together, so two guests
   * booking the last table at the same moment can't both get it.
   */
  create(booking: Booking, seatsPerSlot: number): Promise<"created" | "full">;

  updateStatus(id: string, status: BookingStatus, updatedAt: string): Promise<Booking | null>;

  /**
   * Replaces the seeded demo bookings when none of them is on or after
   * `freshUntil`. Real bookings are never touched.
   */
  refreshDemo(freshUntil: string, makeDemo: () => Booking[]): Promise<void>;

  /**
   * Records one hit for `key` and returns how many hits it has had in the
   * last `windowSeconds`, this one included. Used for rate limiting.
   */
  hit(key: string, windowSeconds: number): Promise<number>;
}
