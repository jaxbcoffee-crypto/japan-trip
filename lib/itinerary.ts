import itineraryRaw from "@/data/itinerary.json";
import type { Itinerary, Day, Stop } from "@/lib/types";

// itinerary.json is maintained to satisfy the Itinerary schema — cast is safe
const itineraryData = itineraryRaw as unknown as Itinerary;

export function getItinerary(): Itinerary {
  return itineraryData;
}

/** Returns today's date as YYYY-MM-DD in JST (UTC+9). */
export function getTodayJST(): string {
  const jstDate = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return jstDate.toISOString().slice(0, 10);
}

export type TripPhase = "pre-trip" | "mid-trip" | "post-trip";

export function getTripPhase(itinerary: Itinerary): TripPhase {
  const today = getTodayJST();
  if (today < itinerary.trip.startDate) return "pre-trip";
  if (today > itinerary.trip.endDate) return "post-trip";
  return "mid-trip";
}

export function getDaysUntilTrip(itinerary: Itinerary): number {
  const today = getTodayJST();
  const diffMs =
    new Date(itinerary.trip.startDate).getTime() -
    new Date(today).getTime();
  return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
}

export function getCurrentDay(itinerary: Itinerary): Day | undefined {
  const today = getTodayJST();
  return itinerary.days.find((d) => d.date === today);
}

export function getDayByDate(
  itinerary: Itinerary,
  date: string
): Day | undefined {
  return itinerary.days.find((d) => d.date === date);
}

/** 1-based day number relative to trip start. */
export function getDayNumber(itinerary: Itinerary, date: string): number {
  const startMs = new Date(itinerary.trip.startDate).getTime();
  const dayMs = new Date(date).getTime();
  return Math.floor((dayMs - startMs) / (24 * 60 * 60 * 1000)) + 1;
}

export function formatDateShort(isoDate: string): string {
  return new Date(isoDate + "T12:00:00+09:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function buildMapsUrl(stop: Stop): string | undefined {
  if (stop.lat !== undefined && stop.lng !== undefined) {
    return `https://www.google.com/maps/search/?api=1&query=${stop.lat},${stop.lng}`;
  }
  if (stop.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.address)}`;
  }
  return undefined;
}
