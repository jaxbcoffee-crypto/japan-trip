import Link from "next/link";
import type { Itinerary, Day } from "@/lib/types";
import {
  getItinerary,
  getTripPhase,
  getDaysUntilTrip,
  getCurrentDay,
  formatDateShort,
} from "@/lib/itinerary";

// Re-render at most once per hour so the countdown stays accurate
export const revalidate = 3600;

export default function Home() {
  const itinerary = getItinerary();
  const phase = getTripPhase(itinerary);

  return (
    <main className="min-h-dvh bg-white">
      {phase === "pre-trip" && <PreTripView itinerary={itinerary} />}
      {phase === "mid-trip" && <MidTripView itinerary={itinerary} />}
      {phase === "post-trip" && <PostTripView />}
    </main>
  );
}

function PreTripView({ itinerary }: { itinerary: Itinerary }) {
  const daysUntil = getDaysUntilTrip(itinerary);

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 py-12 text-center">
      <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-8">
        Japan 2027
      </p>

      <div className="text-8xl font-bold tabular-nums leading-none mb-2 text-gray-900">
        {daysUntil}
      </div>
      <p className="text-lg text-gray-500 mb-10">
        {daysUntil === 1 ? "day" : "days"} until Tokyo
      </p>

      <p className="text-sm text-gray-400 mb-12">
        {formatDateShort(itinerary.trip.startDate)} —{" "}
        {formatDateShort(itinerary.trip.endDate)}
      </p>

      <Link
        href="/itinerary"
        className="inline-flex items-center justify-center h-12 min-w-[180px] px-6 rounded-full bg-gray-900 text-white text-sm font-medium"
      >
        View Itinerary
      </Link>
    </div>
  );
}

function MidTripView({ itinerary }: { itinerary: Itinerary }) {
  const today = getCurrentDay(itinerary);

  if (!today) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center">
        <p className="text-gray-500 mb-4">No plan found for today.</p>
        <Link href="/itinerary" className="text-sm text-blue-600 min-h-[44px] flex items-center">
          View all days →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <TodayCard day={today} />
    </div>
  );
}

function TodayCard({ day }: { day: Day }) {
  const upcomingStops = day.stops.slice(0, 4);

  return (
    <>
      <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">
        Today
      </p>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">{day.city}</h1>
      <p className="text-sm text-gray-500 mb-6">{formatDateShort(day.date)}</p>

      {day.hotel && (
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <p className="text-xs text-gray-400 mb-1">Staying at</p>
          <p className="font-medium text-gray-900">{day.hotel.name}</p>
          {day.hotel.checkIn && (
            <p className="text-sm text-gray-500 mt-0.5">
              Check-in {day.hotel.checkIn}
            </p>
          )}
        </div>
      )}

      {upcomingStops.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
            Stops
          </p>
          <div className="space-y-0 divide-y divide-gray-100">
            {upcomingStops.map((stop) => (
              <div key={stop.id} className="flex gap-3 py-3">
                <span className="text-xs text-gray-400 tabular-nums w-12 shrink-0 pt-0.5">
                  {stop.start ?? "—"}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 leading-snug">
                    {stop.name}
                  </p>
                  {stop.nameJa && (
                    <p className="text-xs text-gray-400 mt-0.5">{stop.nameJa}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Link
          href={`/itinerary/${day.date}`}
          className="inline-flex items-center justify-center h-12 rounded-full bg-gray-900 text-white text-sm font-medium"
        >
          Full Day View
        </Link>
        <Link
          href="/itinerary"
          className="inline-flex items-center justify-center h-12 rounded-full border border-gray-200 text-sm font-medium text-gray-700"
        >
          All Days
        </Link>
      </div>
    </>
  );
}

function PostTripView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center">
      <p className="text-2xl font-bold text-gray-900 mb-2">Trip Complete</p>
      <p className="text-gray-500 mb-8">Welcome home. Arigatou gozaimasu!</p>
      <Link
        href="/itinerary"
        className="inline-flex items-center justify-center h-12 min-w-[160px] px-6 rounded-full border border-gray-200 text-sm font-medium text-gray-700"
      >
        View memories
      </Link>
    </div>
  );
}
