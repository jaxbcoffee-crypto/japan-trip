import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { LandmarkHero } from '@/components/home/LandmarkHero'

interface DayHeroProps {
  dayIndex: number
  dayNumber: number
  date: string
  city: string
  cityJa?: string
  totalDays: number
}

const cityKanji: Record<string, string> = {
  Tokyo: '東京', Kyoto: '京都', Osaka: '大阪',
  Nara: '奈良', Nikko: '日光', Kamakura: '鎌倉',
  Himeji: '姫路', Kobe: '神戸',
}

export function DayHero({ dayIndex, dayNumber, date, city, totalDays }: DayHeroProps) {
  const kanji = cityKanji[city] ?? city
  const dateFormatted = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date + 'T00:00:00+09:00'))

  return (
    <div className="relative h-64 sm:h-80 overflow-hidden">
      <LandmarkHero dayIndex={dayIndex} city={city} />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end px-4 pb-6">
        <div className="max-w-2xl mx-auto w-full">
          <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-1">
            Day {dayNumber} of {totalDays}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
            {city}
          </h1>
          <div className="flex items-center gap-3">
            <p className="font-jp text-xl text-white/70">{kanji}</p>
            <p className="text-white/50 text-sm">{dateFormatted}</p>
          </div>
        </div>
      </div>

      {/* Prev / Next navigation */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 pointer-events-none">
        {dayNumber > 1 && (
          <Link
            href={`/itinerary/${dayNumber - 1}`}
            className="pointer-events-auto w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
            aria-label={`Previous day (Day ${dayNumber - 1})`}
          >
            <ChevronLeft size={18} />
          </Link>
        )}
        <div className="flex-1" />
        {dayNumber < totalDays && (
          <Link
            href={`/itinerary/${dayNumber + 1}`}
            className="pointer-events-auto w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
            aria-label={`Next day (Day ${dayNumber + 1})`}
          >
            <ChevronRight size={18} />
          </Link>
        )}
      </div>
    </div>
  )
}
