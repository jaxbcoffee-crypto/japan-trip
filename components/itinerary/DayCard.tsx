import Link from 'next/link'
import { Calendar, Hotel, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'
import type { Day } from '@/lib/types'

interface DayCardProps {
  day: Day
  dayNumber: number
  isCurrent: boolean
}

export function DayCard({ day, dayNumber, isCurrent }: DayCardProps) {
  const reservedStops = day.stops.filter(s => s.reservation?.required)
  const bookedCount = day.stops.filter(s => s.reservation?.booked).length
  const unbookedRequired = reservedStops.length - bookedCount

  // Format date like "Wed, Apr 1"
  const dateStr = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(day.date + 'T00:00:00+09:00'))

  const previewStops = day.stops
    .filter(s => s.type !== 'transit')
    .slice(0, 2)

  return (
    <Link
      href={`/itinerary/${dayNumber}`}
      className={cn(
        'group block rounded-xl border bg-surface hover:bg-surface-raised',
        'transition-all hover:shadow-md hover:-translate-y-0.5',
        isCurrent
          ? 'border-accent ring-1 ring-accent shadow-md'
          : 'border-line'
      )}
    >
      <div className="flex items-stretch">
        {/* Day number column */}
        <div className={cn(
          'w-14 shrink-0 flex flex-col items-center justify-center rounded-l-xl py-3 border-r',
          isCurrent ? 'bg-accent-soft border-accent/20' : 'bg-surface-raised border-line'
        )}>
          <span className={cn('text-xs font-medium uppercase tracking-wider', isCurrent ? 'text-accent' : 'text-muted')}>
            Day
          </span>
          <span className={cn('text-2xl font-bold tabular-nums', isCurrent ? 'text-accent' : 'text-fg')}>
            {dayNumber}
          </span>
          {isCurrent && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-accent mt-0.5">Today</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-3 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-muted text-xs">
              <Calendar size={11} />
              <span>{dateStr}</span>
            </div>
            <div className="flex items-center gap-1">
              {unbookedRequired > 0 && (
                <Badge variant="warn" className="text-[10px] px-1.5 py-0">
                  {unbookedRequired} to book
                </Badge>
              )}
              <ChevronRight size={14} className="text-muted group-hover:text-fg transition-colors" />
            </div>
          </div>

          {day.hotel && (
            <div className="flex items-center gap-1 text-xs text-muted mb-1.5">
              <Hotel size={11} />
              <span className="truncate">{day.hotel.name}</span>
            </div>
          )}

          {previewStops.length > 0 && (
            <div className="space-y-0.5">
              {previewStops.map(stop => (
                <div key={stop.id} className="flex items-center gap-2 text-sm">
                  <span className="text-fg truncate">{stop.name}</span>
                  {stop.nameJa && (
                    <span className="font-jp text-muted text-xs shrink-0">{stop.nameJa}</span>
                  )}
                </div>
              ))}
              {day.stops.filter(s => s.type !== 'transit').length > 2 && (
                <p className="text-xs text-muted">
                  +{day.stops.filter(s => s.type !== 'transit').length - 2} more stops
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
