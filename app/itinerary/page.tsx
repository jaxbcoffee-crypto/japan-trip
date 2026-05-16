import type { Metadata } from 'next'
import { getItinerary } from '@/lib/itinerary'
import { getTripDayIndex, getTripPhase } from '@/lib/dates'
import { CityBand } from '@/components/itinerary/CityBand'
import { DayCard } from '@/components/itinerary/DayCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Full Itinerary',
  description: '21 days across Tokyo, Kyoto, and Osaka — April 1–21, 2027.',
}

export default function ItineraryPage() {
  const itinerary = getItinerary()
  const now = new Date()
  const currentDayIndex = getTripDayIndex(now)
  const phase = getTripPhase(now)

  const cities = [
    {
      name: 'Tokyo',
      ja: '東京',
      colorClass: 'text-accent',
      borderClass: 'border-accent',
      days: itinerary.days.filter(d => d.city === 'Tokyo'),
    },
    {
      name: 'Kyoto',
      ja: '京都',
      colorClass: 'text-sakura',
      borderClass: 'border-sakura',
      days: itinerary.days.filter(d => d.city === 'Kyoto'),
    },
    {
      name: 'Osaka',
      ja: '大阪',
      colorClass: 'text-gold',
      borderClass: 'border-gold',
      days: itinerary.days.filter(d => d.city === 'Osaka'),
    },
  ]

  return (
    <div className="min-h-screen bg-bg">
      {/* Page hero */}
      <div className="border-b border-line bg-surface-raised">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <p className="font-jp text-2xl text-muted mb-1">全行程</p>
          <h1 className="font-serif text-5xl font-bold text-fg mb-4">Full Itinerary</h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted mb-4">
            <span>21 days</span>
            <span aria-hidden>·</span>
            <span>3 cities</span>
            <span aria-hidden>·</span>
            <span>April 1 – 21, 2027</span>
          </div>
          {/* Trip progress bar — only visible mid-trip */}
          {phase === 'mid' && currentDayIndex >= 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted">
                <span>Day {currentDayIndex + 1} of {itinerary.days.length}</span>
                <span>{Math.round(((currentDayIndex + 1) / itinerary.days.length) * 100)}% complete</span>
              </div>
              <div className="h-1.5 rounded-full bg-line overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${((currentDayIndex + 1) / itinerary.days.length) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={currentDayIndex + 1}
                  aria-valuemin={1}
                  aria-valuemax={itinerary.days.length}
                  aria-label="Trip progress"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* City bands */}
      <div className="px-4 pt-8 pb-24">
        {cities.map(city => {
          // Compute day numbers for this city's days
          const daysWithNumbers = city.days.map(day => ({
            day,
            dayNumber: itinerary.days.indexOf(day) + 1,
          }))
          const firstDayNum = daysWithNumbers[0]?.dayNumber ?? 1
          const lastDayNum = daysWithNumbers[daysWithNumbers.length - 1]?.dayNumber ?? 1
          const daysLabel = firstDayNum === lastDayNum
            ? `Day ${firstDayNum}`
            : `Days ${firstDayNum}–${lastDayNum}`

          return (
            <CityBand
              key={city.name}
              city={city.name}
              cityJa={city.ja}
              daysLabel={daysLabel}
              colorClass={city.colorClass}
              borderClass={city.borderClass}
            >
              {daysWithNumbers.map(({ day, dayNumber }) => (
                <DayCard
                  key={day.date}
                  day={day}
                  dayNumber={dayNumber}
                  isCurrent={phase === 'mid' && dayNumber - 1 === currentDayIndex}
                />
              ))}
            </CityBand>
          )
        })}
      </div>
    </div>
  )
}
