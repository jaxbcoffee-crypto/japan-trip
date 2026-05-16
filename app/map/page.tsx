import { getItinerary } from '@/lib/itinerary'
import MapWithFilter from '@/components/map/CityFilter'

export default function MapPage() {
  const itinerary = getItinerary()

  const stops = itinerary.days.flatMap((day, dayIndex) =>
    day.stops
      .filter(stop => stop.lat != null && stop.lng != null)
      .map(stop => ({
        id: stop.id,
        name: stop.name,
        lat: stop.lat!,
        lng: stop.lng!,
        type: stop.type,
        city: day.city,
        dayNumber: dayIndex + 1,
        dayIndex,
      }))
  )

  const totalStops = itinerary.days.reduce((sum, d) => sum + d.stops.length, 0)

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Page header */}
      <div className="border-b border-line bg-surface-raised px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <p className="font-jp text-xl text-muted mb-1">地図</p>
          <h1 className="font-serif text-4xl font-bold text-fg">Trip Map</h1>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-0 sm:px-4">
        <MapWithFilter stops={stops} totalStops={totalStops} />
      </div>
    </div>
  )
}
