import { cn } from '@/lib/cn'

interface CityBandProps {
  city: string
  cityJa: string
  daysLabel: string      // e.g. "Days 1–8"
  children: React.ReactNode
  colorClass: string     // e.g. "text-accent", "text-sakura", "text-gold"
  borderClass: string    // e.g. "border-accent", "border-sakura", "border-gold"
}

export function CityBand({ city, cityJa, daysLabel, children, colorClass, borderClass }: CityBandProps) {
  return (
    <section className={cn('border-l-2 pl-4 mb-10', borderClass)}>
      {/* Sticky city header */}
      <div className="sticky top-14 z-10 -mx-4 px-4 py-3 backdrop-blur-md bg-bg/90 border-b border-line/50 mb-4">
        <div className="max-w-2xl mx-auto flex items-baseline justify-between">
          <div className="flex items-baseline gap-3">
            <h2 className={cn('font-serif text-3xl font-bold', colorClass)}>{city}</h2>
            <span className="font-jp text-lg text-muted">{cityJa}</span>
          </div>
          <span className="text-sm text-muted font-medium">{daysLabel}</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-2">
        {children}
      </div>
    </section>
  )
}
