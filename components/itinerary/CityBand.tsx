import Link from 'next/link'
import { cn } from '@/lib/cn'

interface CityBandProps {
  city: string
  cityJa: string
  daysLabel: string
  children: React.ReactNode
  colorClass: string
  borderClass: string
}

export function CityBand({ city, cityJa, daysLabel, children, colorClass, borderClass }: CityBandProps) {
  return (
    <section className={cn('border-l-2 pl-4 mb-10', borderClass)}>
      {/* Sticky city header */}
      <div className="sticky top-14 z-10 -mx-4 px-4 py-3 backdrop-blur-md bg-bg/90 border-b border-line/50 mb-4">
        <div className="max-w-2xl mx-auto flex items-baseline justify-between">
          <div className="flex items-baseline gap-3">
            <Link
              href={`/city/${city}`}
              className={cn('font-serif text-3xl font-bold hover:opacity-80 transition-opacity', colorClass)}
            >
              {city}
            </Link>
            <span className="font-jp text-lg text-muted">{cityJa}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted font-medium">{daysLabel}</span>
            <Link
              href={`/city/${city}`}
              className={cn('text-xs font-medium hover:opacity-80 transition-opacity', colorClass)}
            >
              Overview →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-2 stagger-children">
        {children}
      </div>
    </section>
  )
}
