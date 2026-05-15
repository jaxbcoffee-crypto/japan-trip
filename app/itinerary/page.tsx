import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getItinerary, formatDateShort, getDayNumber } from "@/lib/itinerary";

export default function ItineraryPage() {
  const itinerary = getItinerary();

  return (
    <main className="max-w-lg mx-auto min-h-dvh bg-white">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 pt-6 pb-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 mb-3 min-h-[44px]"
        >
          ← Home
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Itinerary</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {itinerary.days.length} days ·{" "}
          {formatDateShort(itinerary.trip.startDate)} –{" "}
          {formatDateShort(itinerary.trip.endDate)}
        </p>
      </header>

      <div className="divide-y divide-gray-100">
        {itinerary.days.map((day) => {
          const dayNum = getDayNumber(itinerary, day.date);
          return (
            <details key={day.date} className="group">
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer select-none list-none min-h-[64px]">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium">
                    Day {dayNum}
                  </p>
                  <p className="font-semibold text-gray-900 leading-snug">
                    {day.city}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDateShort(day.date)}
                  </p>
                </div>
                <ChevronRight
                  size={18}
                  className="shrink-0 ml-4 text-gray-300 transition-transform duration-150 group-open:rotate-90"
                  aria-hidden
                />
              </summary>

              <div className="px-6 pb-5 bg-gray-50">
                {day.stops.length === 0 ? (
                  <p className="text-sm text-gray-400 py-2">
                    No stops planned.
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {day.stops.map((stop) => (
                      <li key={stop.id} className="flex gap-3 py-2.5">
                        <span className="text-xs text-gray-400 tabular-nums w-12 shrink-0 pt-0.5">
                          {stop.start ?? ""}
                        </span>
                        <span className="text-sm text-gray-700 leading-snug">
                          {stop.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <Link
                  href={`/itinerary/${day.date}`}
                  className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-gray-900 min-h-[44px]"
                >
                  Full day details
                  <ChevronRight size={14} aria-hidden />
                </Link>
              </div>
            </details>
          );
        })}
      </div>
    </main>
  );
}
