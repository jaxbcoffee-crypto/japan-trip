import Link from 'next/link'
import { cn } from '@/lib/cn'

interface TripArcProps {
  currentDayIndex: number  // 0-20 or -1/21
}

const cities = [
  { name: 'Tokyo', ja: '東京', days: [0, 1, 2, 3, 4, 5, 6, 7], color: 'bg-accent' },
  { name: 'Kyoto', ja: '京都', days: [8, 9, 10, 11, 12], color: 'bg-sakura' },
  { name: 'Osaka', ja: '大阪', days: [13, 14, 15, 16, 17, 18, 19, 20], color: 'bg-gold' },
]

export function TripArc({ currentDayIndex }: TripArcProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex items-center gap-0">
        {cities.map((city, cityIdx) => (
          <div key={city.name} className="flex flex-col items-center flex-1">
            {/* City label */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-white/70 text-[10px] font-medium uppercase tracking-wider hidden sm:block">
                {city.name}
              </span>
              <span className="font-jp text-white/50 text-xs">{city.ja}</span>
            </div>
            {/* Day dots */}
            <div className="flex items-center gap-1 relative">
              {/* Connector line to next city */}
              {cityIdx < cities.length - 1 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-px bg-white/20" />
              )}
              {city.days.map(dayIdx => {
                const isPast = currentDayIndex > dayIdx
                const isCurrent = currentDayIndex === dayIdx
                const isFuture = currentDayIndex < dayIdx
                return (
                  <Link
                    key={dayIdx}
                    href={`/itinerary/${dayIdx + 1}`}
                    title={`Day ${dayIdx + 1}`}
                    className={cn(
                      'rounded-full transition-all focus-visible:ring-2 focus-visible:ring-white',
                      isCurrent && `w-4 h-4 ${city.color} ring-2 ring-white shadow-lg scale-125`,
                      isPast && `w-2.5 h-2.5 ${city.color} opacity-40`,
                      isFuture && 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40',
                      !isCurrent && !isPast && !isFuture && 'w-2.5 h-2.5 bg-white/20',
                    )}
                    aria-label={`Day ${dayIdx + 1}${isCurrent ? ' (today)' : ''}`}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
