import { CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Stop } from '@/lib/types'

interface ReservationBadgeProps {
  reservation: NonNullable<Stop['reservation']>
  showLink?: boolean
}

export function ReservationBadge({ reservation, showLink = false }: ReservationBadgeProps) {
  if (!reservation.required) return null

  const isBooked = reservation.booked
  const notes = reservation.notes ?? ''

  // Extract URL from notes if present
  const urlMatch = notes.match(/https?:\/\/[^\s)]+/)
  const bookingUrl = urlMatch?.[0]

  if (isBooked) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-ok/10 text-ok border border-ok/20 px-2.5 py-0.5 text-xs font-medium">
        <CheckCircle size={11} />
        Booked
      </span>
    )
  }

  // Unbooked — derive urgency from notes text (rough heuristic: "1-2 weeks", "1-2 months", "2-4 weeks")
  const urgency = notes.includes('month') ? 'high' : notes.includes('week') ? 'medium' : 'low'
  const urgencyStyles = {
    high: 'bg-warn/10 text-warn border-warn/20',
    medium: 'bg-warn/10 text-warn border-warn/20',
    low: 'bg-muted/10 text-muted border-muted/20',
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        urgencyStyles[urgency]
      )}>
        <AlertCircle size={11} />
        Book required
      </span>
      {showLink && bookingUrl && (
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
        >
          Book now <ExternalLink size={10} />
        </a>
      )}
    </div>
  )
}
