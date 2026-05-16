'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'

interface Stop {
  id: string
  name: string
  nameJa?: string
  start?: string
  type: string
}

interface TodayWidgetProps {
  phase: 'pre' | 'mid' | 'post'
  dayIndex: number          // 0-20, or -1 (pre), 21 (post)
  daysUntil: number         // for pre-trip countdown
  hoursUntil: number
  // For mid-trip:
  dayNumber?: number        // 1-21
  date?: string
  city?: string
  cityJa?: string
  hotelName?: string
  stops?: Stop[]
  totalDays: number
}

export function TodayWidget({
  phase,
  dayIndex,
  daysUntil,
  hoursUntil,
  dayNumber,
  date,
  city,
  cityJa,
  hotelName,
  stops,
  totalDays,
}: TodayWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // Mouse tilt effect
  useEffect(() => {
    const container = containerRef.current
    const card = cardRef.current
    if (!container || !card) return

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frameId: number
    let targetX = 0, targetY = 0
    let currentX = 0, currentY = 0

    function onMouseMove(e: MouseEvent) {
      const rect = container!.getBoundingClientRect()
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 12
      targetY = -((e.clientY - rect.top) / rect.height - 0.5) * 8
    }

    function onMouseLeave() {
      targetX = 0
      targetY = 0
    }

    function animate() {
      currentX += (targetX - currentX) * 0.08
      currentY += (targetY - currentY) * 0.08
      if (card) {
        card.style.transform = `perspective(1200px) rotateY(${currentX}deg) rotateX(${currentY}deg)`
      }
      frameId = requestAnimationFrame(animate)
    }

    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mouseleave', onMouseLeave)
    frameId = requestAnimationFrame(animate)

    return () => {
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onMouseLeave)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      <div
        ref={cardRef}
        className="will-change-transform transition-shadow duration-300"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {phase === 'pre' && (
          <PreTripCard daysUntil={daysUntil} hoursUntil={hoursUntil} />
        )}
        {phase === 'mid' && (
          <MidTripCard
            dayNumber={dayNumber!}
            dayIndex={dayIndex}
            date={date!}
            city={city!}
            cityJa={cityJa}
            hotelName={hotelName}
            stops={stops ?? []}
            totalDays={totalDays}
          />
        )}
        {phase === 'post' && (
          <PostTripCard totalDays={totalDays} />
        )}
      </div>
    </div>
  )
}

// Pre-trip countdown card
function PreTripCard({ daysUntil, hoursUntil }: { daysUntil: number; hoursUntil: number }) {
  return (
    <div className="backdrop-blur-md bg-black/40 border border-white/15 rounded-2xl p-8 max-w-sm w-full shadow-xl text-white">
      <p className="font-serif italic text-lg text-white/70 mb-1">Departing for</p>
      <h1 className="font-serif text-5xl font-bold mb-1">Japan</h1>
      <p className="font-jp text-2xl text-white/80 mb-6">日本</p>
      <div className="border-t border-white/20 pt-4">
        <p className="text-6xl font-bold tabular-nums leading-none">{daysUntil}</p>
        <p className="text-white/60 text-sm mt-1 font-medium uppercase tracking-widest">
          {daysUntil === 1 ? 'day' : 'days'} to go
        </p>
        {daysUntil <= 7 && (
          <p className="text-white/40 text-xs mt-1">
            {hoursUntil} hours
          </p>
        )}
      </div>
      <div className="mt-6 flex gap-2">
        <Link
          href="/itinerary"
          className="flex-1 text-center bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl py-2.5 text-sm font-medium text-white transition-colors"
        >
          View Itinerary
        </Link>
        <Link
          href="/reservations"
          className="flex-1 text-center bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl py-2.5 text-sm font-medium text-white transition-colors"
        >
          Reservations
        </Link>
      </div>
    </div>
  )
}

// Stop type labels mapping
const typeLabels: Record<string, string> = {
  sight: 'Sight',
  food: 'Food',
  shop: 'Shop',
  transit: 'Transit',
  free: 'Free time',
}

// Mid-trip today card
function MidTripCard({
  dayNumber, dayIndex, date, city, cityJa, hotelName, stops, totalDays,
}: {
  dayNumber: number
  dayIndex: number
  date: string
  city: string
  cityJa?: string
  hotelName?: string
  stops: Stop[]
  totalDays: number
}) {
  const displayStops = stops.slice(0, 4)
  return (
    <div className="backdrop-blur-md bg-black/40 border border-white/15 rounded-2xl px-6 py-5 max-w-md w-full shadow-xl text-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-1">
            Day {dayNumber} of {totalDays}
          </p>
          <h1 className="font-serif text-4xl font-bold leading-tight">{city}</h1>
          {cityJa && <p className="font-jp text-xl text-white/70">{cityJa}</p>}
        </div>
        <div className="text-right">
          <p className="text-white/50 text-xs">{date}</p>
        </div>
      </div>

      {/* Hotel */}
      {hotelName && (
        <div className="bg-white/10 rounded-xl px-3 py-2 mb-3 text-sm">
          <span className="text-white/50 text-xs uppercase tracking-wider mr-2">Stay</span>
          <span className="text-white/90">{hotelName}</span>
        </div>
      )}

      {/* Stops */}
      <div className="space-y-1.5 mb-4">
        {displayStops.map(stop => (
          <div key={stop.id} className="flex items-center gap-3 text-sm">
            {stop.start && (
              <span className="text-white/40 text-xs w-10 shrink-0 font-mono">{stop.start.slice(0, 5)}</span>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-white/90 truncate block">{stop.name}</span>
              {stop.nameJa && <span className="font-jp text-white/50 text-xs">{stop.nameJa}</span>}
            </div>
            <span className="text-white/30 text-xs shrink-0">{typeLabels[stop.type] ?? stop.type}</span>
          </div>
        ))}
        {stops.length > 4 && (
          <p className="text-white/40 text-xs text-center">+{stops.length - 4} more stops</p>
        )}
      </div>

      <Link
        href={`/itinerary/${dayIndex + 1}`}
        className="block w-full text-center bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl py-2.5 text-sm font-medium text-white transition-colors"
      >
        Full day plan
      </Link>
    </div>
  )
}

function PostTripCard({ totalDays }: { totalDays: number }) {
  return (
    <div className="backdrop-blur-md bg-black/40 border border-white/15 rounded-2xl p-8 max-w-sm w-full shadow-xl text-white text-center">
      <p className="font-serif italic text-white/60 text-lg mb-2">Journey complete</p>
      <h1 className="font-serif text-5xl font-bold mb-4">21 Days</h1>
      <p className="font-jp text-3xl text-white/70 mb-6">ありがとう日本</p>
      <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-4 mb-6">
        <div><p className="text-2xl font-bold">3</p><p className="text-white/50 text-xs">Cities</p></div>
        <div><p className="text-2xl font-bold">98</p><p className="text-white/50 text-xs">Stops</p></div>
        <div><p className="text-2xl font-bold">{totalDays}</p><p className="text-white/50 text-xs">Days</p></div>
      </div>
      <Link
        href="/itinerary"
        className="block w-full text-center bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl py-2.5 text-sm font-medium text-white transition-colors"
      >
        View memories
      </Link>
    </div>
  )
}
