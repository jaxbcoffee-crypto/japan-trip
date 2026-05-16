import { notFound } from 'next/navigation'
import { getItinerary } from '@/lib/itinerary'
import { DayHero } from '@/components/itinerary/DayHero'
import { StopCard } from '@/components/StopCard'
import { WalkingHint } from '@/components/itinerary/WalkingHint'
import { DayMapClient } from '@/components/map/DayMapClient'
import { Card } from '@/components/ui/Card'
import { Hotel, FileText } from 'lucide-react'

export async function generateStaticParams() {
  const itinerary = getItinerary()
  return itinerary.days.map((_, idx) => ({ day: String(idx + 1) }))
}

export default async function DayPage({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params
  const dayNumber = parseInt(day, 10)

  if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 21) {
    notFound()
  }

  const itinerary = getItinerary()
  const dayData = itinerary.days[dayNumber - 1]

  if (!dayData) notFound()

  const dayIndex = dayNumber - 1
  const totalDays = itinerary.days.length

  // Stops with lat/lng for the map
  const mappableStops = dayData.stops
    .filter(s => s.lat != null && s.lng != null)
    .map(s => ({ id: s.id, name: s.name, lat: s.lat!, lng: s.lng!, type: s.type }))

  return (
    <div className="min-h-screen bg-bg">
      <DayHero
        dayIndex={dayIndex}
        dayNumber={dayNumber}
        date={dayData.date}
        city={dayData.city}
        totalDays={totalDays}
      />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 pb-24">
        {/* Inline map */}
        {mappableStops.length >= 2 && (
          <Card className="overflow-hidden p-0">
            <DayMapClient
              stops={mappableStops}
              className="w-full h-52 sm:h-64 rounded-xl"
            />
          </Card>
        )}

        {/* Hotel info */}
        {dayData.hotel && (
          <Card>
            <div className="flex items-start gap-3">
              <Hotel size={16} className="text-accent mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted font-medium uppercase tracking-wider mb-0.5">Accommodation</p>
                <p className="font-medium text-fg">{dayData.hotel.name}</p>
                {dayData.hotel.address && (
                  <p className="text-sm text-muted mt-0.5">{dayData.hotel.address}</p>
                )}
                {dayData.hotel.checkIn && (
                  <p className="text-xs text-muted mt-1">Check-in: {dayData.hotel.checkIn}</p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Day notes */}
        {dayData.notes && (
          <Card>
            <div className="flex items-start gap-3">
              <FileText size={16} className="text-muted mt-0.5 shrink-0" />
              <p className="text-sm text-muted italic leading-relaxed">{dayData.notes}</p>
            </div>
          </Card>
        )}

        {/* Stops with walking hints between */}
        <div className="space-y-0">
          {dayData.stops.map((stop, idx) => {
            const prevStop = idx > 0 ? dayData.stops[idx - 1] : null
            const showWalk = prevStop &&
              prevStop.lat != null && prevStop.lng != null &&
              stop.lat != null && stop.lng != null

            return (
              <div key={stop.id}>
                {showWalk && (
                  <WalkingHint
                    fromLat={prevStop!.lat!}
                    fromLng={prevStop!.lng!}
                    toLat={stop.lat!}
                    toLng={stop.lng!}
                  />
                )}
                <StopCard stop={stop} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
