import type { Metadata } from 'next'
import { AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { reservationsByUrgency } from '@/lib/itinerary'
import { ReservationCard } from '@/components/reservations/ReservationCard'

export const metadata: Metadata = {
  title: 'Reservations',
  description: 'Bookings, confirmations, and walk-in stops for the Japan trip.',
}

export default function ReservationsPage() {
  const entries = reservationsByUrgency()

  const actionRequired = entries.filter(e => e.stop.reservation?.required && !e.stop.reservation?.booked)
  const booked = entries.filter(e => e.stop.reservation?.booked)
  const walkIn = entries.filter(e => e.stop.reservation?.required === false)

  return (
    <div className="min-h-screen bg-bg">
      {/* Page hero */}
      <div className="border-b border-line bg-surface-raised">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <p className="font-jp text-2xl text-muted mb-1">予約</p>
          <h1 className="font-serif text-5xl font-bold text-fg mb-2">Reservations</h1>
          <p className="text-muted text-sm">
            {actionRequired.length} to book · {booked.length} confirmed · {walkIn.length} walk-in
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 space-y-10 animate-enter">
        {/* Action required */}
        {actionRequired.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-warn" />
              <h2 className="font-medium text-fg">Action Required</h2>
              <span className="rounded-full bg-warn/10 text-warn border border-warn/20 px-2 py-0.5 text-xs font-medium">
                {actionRequired.length}
              </span>
            </div>
            <div className="space-y-3">
              {actionRequired.map(({ stop, day, dayNumber }) => (
                <ReservationCard
                  key={stop.id}
                  stop={stop}
                  day={day}
                  dayNumber={dayNumber}
                  status="action-required"
                />
              ))}
            </div>
          </section>
        )}

        {/* Booked */}
        {booked.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={16} className="text-ok" />
              <h2 className="font-medium text-fg">Confirmed</h2>
            </div>
            <div className="space-y-3">
              {booked.map(({ stop, day, dayNumber }) => (
                <ReservationCard
                  key={stop.id}
                  stop={stop}
                  day={day}
                  dayNumber={dayNumber}
                  status="booked"
                />
              ))}
            </div>
          </section>
        )}

        {/* Walk-in */}
        {walkIn.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Info size={16} className="text-muted" />
              <h2 className="font-medium text-fg">Walk-in</h2>
            </div>
            <div className="space-y-3">
              {walkIn.map(({ stop, day, dayNumber }) => (
                <ReservationCard
                  key={stop.id}
                  stop={stop}
                  day={day}
                  dayNumber={dayNumber}
                  status="walk-in"
                />
              ))}
            </div>
          </section>
        )}

        {entries.length === 0 && (
          <div className="text-center py-16 text-muted">
            <p className="font-serif text-2xl mb-2">No reservations</p>
            <p className="text-sm">Stops with booking requirements will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
