import { Camera, Utensils, ShoppingBag, Train, Coffee, MapPin } from 'lucide-react'
import { ReservationBadge } from './ReservationBadge'
import { buildMapsUrl } from '@/lib/itinerary'
import { cn } from '@/lib/cn'
import type { Stop } from '@/lib/types'

type TypeConfig = { icon: React.ComponentType<{size?: number; strokeWidth?: number; className?: string}>; label: string; color: string }

const DEFAULT_CONFIG: TypeConfig = { icon: Coffee, label: 'Free', color: 'text-ok' }

const typeConfig: Record<string, TypeConfig> = {
  sight:   { icon: Camera,      label: 'Sight',   color: 'text-accent' },
  food:    { icon: Utensils,    label: 'Food',    color: 'text-gold' },
  shop:    { icon: ShoppingBag, label: 'Shop',    color: 'text-sakura' },
  transit: { icon: Train,       label: 'Transit', color: 'text-muted' },
  free:    DEFAULT_CONFIG,
}

interface StopCardProps {
  stop: Stop
  compact?: boolean
}

export function StopCard({ stop, compact = false }: StopCardProps) {
  const config = typeConfig[stop.type] ?? DEFAULT_CONFIG
  const Icon = config.icon
  const mapsUrl = stop.address ? buildMapsUrl(stop) : null

  return (
    <article className={cn(
      'group relative flex gap-3 rounded-xl border border-line bg-surface',
      'hover:border-line/80 hover:shadow-sm transition-all',
      compact ? 'p-3' : 'p-4'
    )}>
      {/* Type icon column */}
      <div className={cn('shrink-0 mt-0.5', config.color)}>
        <Icon size={16} strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Time range */}
        {(stop.start || stop.end) && (
          <p className="text-xs text-muted font-mono mb-1">
            {stop.start && stop.start.slice(0, 5)}
            {stop.start && stop.end && ' – '}
            {stop.end && stop.end.slice(0, 5)}
          </p>
        )}

        {/* Name */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <h3 className="font-medium text-fg leading-snug">{stop.name}</h3>
            {stop.nameJa && (
              <p className="font-jp text-sm text-muted">{stop.nameJa}</p>
            )}
          </div>
          <span className={cn('shrink-0 text-xs font-medium', config.color)}>
            {config.label}
          </span>
        </div>

        {/* Address */}
        {stop.address && (
          <p className="text-xs text-muted mb-1.5 leading-relaxed">
            {stop.address}
          </p>
        )}

        {/* Reservation */}
        {stop.reservation && (
          <div className="mb-1.5">
            <ReservationBadge reservation={stop.reservation} showLink />
            {stop.reservation.notes && (
              <p className="text-xs text-muted mt-1 leading-relaxed">
                {stop.reservation.notes.replace(/https?:\/\/[^\s)]+/g, '').trim()}
              </p>
            )}
          </div>
        )}

        {/* Notes */}
        {stop.notes && !stop.reservation?.notes?.includes(stop.notes) && (
          <p className="text-sm text-muted italic leading-relaxed border-l-2 border-line pl-2">
            {stop.notes}
          </p>
        )}

        {/* Actions */}
        {mapsUrl && (
          <div className="flex gap-2 mt-2">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
            >
              <MapPin size={11} />
              Maps
            </a>
          </div>
        )}
      </div>
    </article>
  )
}
