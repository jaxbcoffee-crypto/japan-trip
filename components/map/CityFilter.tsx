'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import dynamic from 'next/dynamic'

const TripMap = dynamic(() => import('./TripMap'), { ssr: false })

interface TripStop {
  id: string
  name: string
  lat: number
  lng: number
  type: string
  city: string
  dayNumber: number
  dayIndex: number
}

const CITIES = ['all', 'Tokyo', 'Kyoto', 'Osaka'] as const
type CityFilter = typeof CITIES[number]

const cityLabels: Record<CityFilter, string> = {
  all: 'All Cities',
  Tokyo: '東京 Tokyo',
  Kyoto: '京都 Kyoto',
  Osaka: '大阪 Osaka',
}

const cityAccents: Record<CityFilter, string> = {
  all: 'bg-accent-soft text-accent',
  Tokyo: 'bg-accent-soft text-accent',
  Kyoto: 'bg-sakura/20 text-fg',
  Osaka: 'bg-gold/20 text-fg',
}

interface Props {
  stops: TripStop[]
  totalStops: number
}

export default function MapWithFilter({ stops, totalStops }: Props) {
  const [filter, setFilter] = useState<CityFilter>('all')
  const visibleCount = filter === 'all' ? stops.length : stops.filter(s => s.city === filter).length

  return (
    <div className="flex flex-col h-[calc(100svh-3.5rem-4rem)]">
      {/* Filter bar */}
      <div className="shrink-0 flex items-center gap-2 px-4 py-3 border-b border-line overflow-x-auto">
        {CITIES.map(city => (
          <button
            key={city}
            onClick={() => setFilter(city)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1 text-sm font-medium transition-colors border',
              filter === city
                ? `${cityAccents[city]} border-transparent`
                : 'text-muted border-line hover:text-fg hover:bg-surface-raised'
            )}
          >
            {cityLabels[city]}
          </button>
        ))}
        <span className="shrink-0 text-xs text-muted ml-auto">
          {visibleCount} of {totalStops} stops mapped
        </span>
      </div>

      {/* Map */}
      <TripMap
        stops={stops}
        filter={filter}
        className="flex-1 w-full"
      />
    </div>
  )
}
