import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin } from "lucide-react";
import {
  getItinerary,
  getDayByDate,
  getDayNumber,
  formatDateShort,
} from "@/lib/itinerary";
import { StopCard } from "@/components/StopCard";

type Props = {
  params: Promise<{ day: string }>;
};

export default async function DayPage({ params }: Props) {
  const { day } = await params;
  const itinerary = getItinerary();
  const dayData = getDayByDate(itinerary, day);

  if (!dayData) notFound();

  const dayNum = getDayNumber(itinerary, day);
  const hotelMapsUrl = dayData.hotel?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dayData.hotel.address)}`
    : undefined;

  return (
    <main className="max-w-lg mx-auto min-h-dvh bg-white pb-12">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 pt-6 pb-4">
        <Link
          href="/itinerary"
          className="inline-flex items-center text-sm text-gray-500 mb-3 min-h-[44px]"
        >
          ← All Days
        </Link>
        <p className="text-xs text-gray-400 font-medium">Day {dayNum}</p>
        <h1 className="text-2xl font-bold text-gray-900">{dayData.city}</h1>
        <p className="text-sm text-gray-500">{formatDateShort(dayData.date)}</p>
      </header>

      <div className="px-6 py-6 space-y-6">
        {dayData.hotel && (
          <section aria-label="Hotel">
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 font-medium mb-1">Hotel</p>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">
                    {dayData.hotel.name}
                  </p>
                  {dayData.hotel.checkIn && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      Check-in {dayData.hotel.checkIn}
                    </p>
                  )}
                  {dayData.hotel.address && (
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      {dayData.hotel.address}
                    </p>
                  )}
                  {dayData.hotel.addressJa && (
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {dayData.hotel.addressJa}
                    </p>
                  )}
                </div>
                {hotelMapsUrl && (
                  <a
                    href={hotelMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-none flex items-center justify-center w-11 h-11 rounded-full bg-white text-gray-500"
                    aria-label={`Open ${dayData.hotel.name} in Google Maps`}
                  >
                    <MapPin size={18} aria-hidden />
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {dayData.notes && (
          <div className="bg-blue-50 rounded-2xl px-4 py-3">
            <p className="text-sm text-blue-700 leading-relaxed">
              {dayData.notes}
            </p>
          </div>
        )}

        <section aria-label="Stops">
          {dayData.stops.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">
              No stops planned for this day.
            </p>
          ) : (
            <div>
              {dayData.stops.map((stop) => (
                <StopCard key={stop.id} stop={stop} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export function generateStaticParams() {
  const itinerary = getItinerary();
  return itinerary.days.map((day) => ({ day: day.date }));
}
