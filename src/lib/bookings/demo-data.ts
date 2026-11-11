import { addDays } from "./dates";
import type { Booking, BookingStatus } from "./rules";
import { makeRef } from "./ref";

/**
 * Sample bookings so the admin page never looks empty. Dates are relative to
 * today and the set is replaced automatically once it goes stale. Names are
 * made up, numbers are fake and emails use example.com, which never delivers.
 */

type Seed = [
  dayOffset: number,
  time: string,
  guests: number,
  name: string,
  status: BookingStatus,
  occasion?: string,
  notes?: string,
];

const seeds: Seed[] = [
  [-6, "20:00", 4, "Rohan Mehta", "confirmed", "Family get-together"],
  [-5, "13:00", 2, "Priya Nair", "confirmed"],
  [-4, "21:00", 6, "Karthik Subramanian", "declined", "Birthday", "Need a table outside"],
  [-3, "19:30", 2, "Sneha Kulkarni", "confirmed", "Date night"],
  [-2, "12:30", 8, "Fatima Sheikh", "confirmed", "Business meal", "Need a quiet corner, will need a bill split in two"],
  [-1, "20:30", 3, "Vikram Shetty", "confirmed"],
  [0, "13:00", 2, "Meera Iyer", "confirmed", undefined, "One guest is vegan"],
  [0, "19:30", 5, "Rahul Verma", "confirmed", "Birthday", "Could you bring a candle with dessert?"],
  [0, "20:30", 4, "Divya Hegde", "confirmed", undefined, "Need a high chair for a toddler"],
  [0, "21:00", 2, "Aditya Joshi", "pending"],
  [1, "12:30", 2, "Nikhil Gowda", "pending"],
  [1, "20:00", 6, "Pooja Bhat", "pending", "Anniversary", "Our parents' 30th anniversary. Window table if possible."],
  [1, "21:30", 2, "Sameer Kapoor", "confirmed", "Date night"],
  [2, "13:30", 4, "Lakshmi Prasad", "pending", undefined, "Allergic to peanuts"],
  [2, "19:00", 10, "Neha Agarwal", "confirmed", "Business meal", "Team dinner, will pre-order the thali"],
  [3, "20:00", 2, "Joseph Mathew", "pending"],
  [3, "20:30", 4, "Harpreet Kaur", "declined", undefined, "Can we bring our own cake?"],
  [4, "12:00", 3, "Deepak Menon", "confirmed"],
  [5, "19:30", 2, "Tanvi Desai", "pending", "Date night"],
  [6, "21:00", 7, "Siddharth Rao", "pending", "Birthday"],
  [8, "13:00", 2, "Kavya Murthy", "pending"],
  [10, "20:00", 4, "Arjun Reddy", "pending", "Family get-together"],
];

export function makeDemoBookings(today: string): Booking[] {
  return seeds.map(([offset, time, guests, name, status, occasion, notes], i) => {
    const date = addDays(today, offset);
    // Requests arrive one to four days before the visit.
    const hour = String(10 + (i % 9)).padStart(2, "0");
    const minute = String((i * 7) % 60).padStart(2, "0");
    const created = new Date(`${addDays(date, -1 - (i % 4))}T${hour}:${minute}:00+05:30`);
    const handle = name.toLowerCase().replace(/\s+/g, ".");
    return {
      id: crypto.randomUUID(),
      ref: makeRef(),
      name,
      phone: `+9190000${10000 + i * 137}`,
      email: `${handle}@example.com`,
      date,
      time,
      guests,
      occasion: occasion ?? null,
      notes: notes ?? null,
      status,
      createdAt: created.toISOString(),
      updatedAt: created.toISOString(),
      isDemo: true,
    };
  });
}
