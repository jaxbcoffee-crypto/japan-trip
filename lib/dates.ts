import tripConfigRaw from "@/data/trip-config.json";

// trip-config.json nests dates under "trip"
const tripConfig = tripConfigRaw.trip;

const START_DATE = new Date(tripConfig.startDate + "T00:00:00+09:00");
const END_DATE = new Date(tripConfig.endDate + "T23:59:59+09:00");

export type TripPhase = "pre" | "mid" | "post";

/** Returns 0-based day index (0 = day 1 of trip) or -1 (pre-trip) or 21 (post-trip) */
export function getTripDayIndex(now: Date): number {
  const jstNow = getJSTMidnight(now);
  const jstStart = getJSTMidnight(START_DATE);
  const diffMs = jstNow.getTime() - jstStart.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return -1;
  if (diffDays > 20) return 21;
  return diffDays;
}

export function getTripPhase(now: Date): TripPhase {
  const idx = getTripDayIndex(now);
  if (idx < 0) return "pre";
  if (idx > 20) return "post";
  return "mid";
}

export function getDaysUntilTrip(now: Date): number {
  const jstNow = getJSTMidnight(now);
  const jstStart = getJSTMidnight(START_DATE);
  return Math.max(
    0,
    Math.ceil((jstStart.getTime() - jstNow.getTime()) / (1000 * 60 * 60 * 24))
  );
}

export function getHoursUntilTrip(now: Date): number {
  return Math.max(
    0,
    Math.ceil((START_DATE.getTime() - now.getTime()) / (1000 * 60 * 60))
  );
}

/** Format a date string (YYYY-MM-DD) in JST locale */
export function formatDateJST(
  dateStr: string,
  opts?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(dateStr + "T00:00:00+09:00");
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    weekday: "short",
    month: "short",
    day: "numeric",
    ...opts,
  }).format(date);
}

/** Format a date string in LA time for travelers at home */
export function formatDateLA(
  dateStr: string,
  opts?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(dateStr + "T00:00:00+09:00");
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    month: "short",
    day: "numeric",
    ...opts,
  }).format(date);
}

/** Get the ISO date string for today in JST */
export function getTodayJST(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(
    new Date()
  );
}

function getJSTMidnight(date: Date): Date {
  const jstStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
  }).format(date);
  return new Date(jstStr + "T00:00:00+09:00");
}
