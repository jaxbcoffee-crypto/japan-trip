import Link from 'next/link'
import { ExternalLink, CheckCircle, AlertTriangle, Calendar, MapPin } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Stop, Day } from '@/lib/types'

interface ReservationCardProps {
  stop: Stop
  day: Day
  dayNumber: number
  status: 'action-required' | 'booked' | 'walk-in'
}

export function ReservationCard({ stop, day, dayNumber, status }: ReservationCardProps) {
  const res = stop.reservation!
  const notes = res.notes ?? ''
  const urlMatch = notes.match(/https?:\/\/[^\s)]+/)
  const bookingUrl = urlMatch?.[0]
  const cleanNotes = notes.replace(/https?:\/\/[^\s)]+/g, '').trim()

  const dateStr = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(day.date + 'T00:00:00+09:00'))

  const urgencyBorder = {
    'action-required': 'border-l-warn',
    'booked': 'border-l-ok',
    'walk-in': 'border-l-muted',
  }[status]

  return (
    <div className={cn(
      'bg-surface rounded-xl border border-line border-l-4 p-4 space-y-3',
      urgencyBorder
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {status === 'action-required' && (
              <AlertTriangle size={14} className="text-warn shrink-0" />
            )}
            {status === 'booked' && (
              <CheckCircle size={14} className="text-ok shrink-0" />
            )}
            <h3 className="font-medium text-fg">{stop.name}</h3>
          </div>
          {stop.nameJa && (
            <p className="font-jp text-sm text-muted">{stop.nameJa}</p>
          )}
        </div>
        <Link
          href={`/itinerary/${dayNumber}`}
          className="shrink-0 inline-flex items-center gap-1 text-xs text-accent hover:underline"
        >
          <Calendar size={11} />
          Day {dayNumber}
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-muted">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {dateStr}
        </span>
        {stop.start && (
          <span className="font-mono text-xs">{stop.start.slice(0, 5)}</span>
        )}
        {stop.address && (
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            <span className="truncate max-w-[200px]">{stop.address}</span>
          </span>
        )}
      </div>

      {cleanNotes && (
        <p className="text-sm text-muted leading-relaxed border-l-2 border-line pl-2">{cleanNotes}</p>
      )}

      <div className="flex items-center justify-between">
        <div>
          {status === 'action-required' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-warn/10 text-warn border border-warn/20 px-2.5 py-0.5 text-xs font-medium">
              <AlertTriangle size={10} />
              Book required
            </span>
          )}
          {status === 'booked' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-ok/10 text-ok border border-ok/20 px-2.5 py-0.5 text-xs font-medium">
              <CheckCircle size={10} />
              Confirmed
            </span>
          )}
          {status === 'walk-in' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-raised text-muted border border-line px-2.5 py-0.5 text-xs font-medium">
              Walk-in
            </span>
          )}
        </div>
        {bookingUrl && status === 'action-required' && (
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-accent text-white rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-accent/90 transition-colors"
          >
            Book now
            <ExternalLink size={11} />
          </a>
        )}
      </div>
    </div>
  )
}
