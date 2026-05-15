import { MapPin } from "lucide-react";
import type { Stop } from "@/lib/types";
import { buildMapsUrl } from "@/lib/itinerary";
import { ReservationBadge } from "@/components/ReservationBadge";

export function StopCard({ stop }: { stop: Stop }) {
  const mapsUrl = buildMapsUrl(stop);
  const timeLabel =
    stop.start && stop.end
      ? `${stop.start} – ${stop.end}`
      : (stop.start ?? null);

  return (
    <article className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {timeLabel && (
            <span className="text-xs font-medium text-gray-400 tabular-nums">
              {timeLabel}
            </span>
          )}
          <ReservationBadge stop={stop} />
        </div>

        <p className="font-medium leading-snug">{stop.name}</p>

        {stop.nameJa && (
          <p className="text-sm text-gray-400 mt-0.5">{stop.nameJa}</p>
        )}

        {stop.address && (
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            {stop.address}
          </p>
        )}

        {stop.notes && (
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            {stop.notes}
          </p>
        )}

        {stop.reservation?.notes && (
          <p className="text-xs text-amber-600 font-medium mt-2 leading-relaxed">
            {stop.reservation.notes}
          </p>
        )}
      </div>

      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-none flex items-center justify-center w-11 h-11 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          aria-label={`Open ${stop.name} in Google Maps`}
        >
          <MapPin size={18} aria-hidden />
        </a>
      )}
    </article>
  );
}
