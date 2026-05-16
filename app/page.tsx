import { getTripPhase, getTripDayIndex, getDaysUntilTrip, getHoursUntilTrip, formatDateJST } from '@/lib/dates'
import { getItinerary } from '@/lib/itinerary'
import { LandmarkHero } from '@/components/home/LandmarkHero'
import { TodayWidget } from '@/components/home/TodayWidget'
import { TripArc } from '@/components/home/TripArc'

export const revalidate = 3600

const cityKanji: Record<string, string> = {
  Tokyo: '東京',
  Kyoto: '京都',
  Osaka: '大阪',
  Nara: '奈良',
  Nikko: '日光',
  Kamakura: '鎌倉',
  Himeji: '姫路',
  Miyajima: '宮島',
  Kobe: '神戸',
}

export default function HomePage() {
  const now = new Date()
  const phase = getTripPhase(now)
  const dayIndex = getTripDayIndex(now)
  const daysUntil = getDaysUntilTrip(now)
  const hoursUntil = getHoursUntilTrip(now)

  const itinerary = getItinerary()
  const totalDays = itinerary.days.length

  // Get current day's data for mid-trip phase
  const currentDay =
    phase === 'mid' && dayIndex >= 0 && dayIndex < itinerary.days.length
      ? itinerary.days[dayIndex]
      : null

  // Determine which city to show gradient for
  // pre-trip = Tokyo start; post-trip = Osaka end
  const heroCity =
    phase === 'pre' ? 'Tokyo' :
    phase === 'post' ? 'Osaka' :
    (currentDay?.city ?? 'Tokyo')

  const heroDay = phase === 'mid' ? dayIndex : (phase === 'pre' ? 0 : 20)

  return (
    <div className="relative min-h-[100svh] flex flex-col">
      {/* Full-screen photo background */}
      <LandmarkHero dayIndex={heroDay} city={heroCity} />

      {/* Centered widget */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 pt-8 pb-32">
        <TodayWidget
          phase={phase}
          dayIndex={dayIndex}
          daysUntil={daysUntil}
          hoursUntil={hoursUntil}
          dayNumber={currentDay ? dayIndex + 1 : undefined}
          date={currentDay ? formatDateJST(currentDay.date) : undefined}
          city={currentDay?.city}
          cityJa={currentDay ? cityKanji[currentDay.city] : undefined}
          hotelName={currentDay?.hotel?.name}
          stops={currentDay?.stops ?? []}
          totalDays={totalDays}
        />
      </div>

      {/* Trip arc timeline at bottom */}
      <div className="relative pb-6">
        <TripArc currentDayIndex={dayIndex} />
      </div>
    </div>
  )
}
