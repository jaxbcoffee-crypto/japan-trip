'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'

interface MapStop {
  id: string
  name: string
  lat: number
  lng: number
  type: string
}

interface DayMapProps {
  stops: MapStop[]
  className?: string
}

const typeColors: Record<string, string> = {
  sight: '#3949AB',
  food: '#C9A961',
  shop: '#E8B4BC',
  transit: '#9E9790',
  free: '#22C55E',
}

export default function DayMap({ stops, className }: DayMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)

  useEffect(() => {
    if (!containerRef.current || stops.length === 0) return
    if (mapRef.current) return // already initialized

    let map: ReturnType<typeof import('leaflet').map>

    async function init() {
      const L = (await import('leaflet')).default

      // Fix leaflet default icon paths in Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      map = L.map(containerRef.current!, { zoomControl: true, scrollWheelZoom: false })
      mapRef.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      const bounds: [number, number][] = []

      // Polyline route
      const latlngs: [number, number][] = stops.map(s => [s.lat, s.lng])
      L.polyline(latlngs, { color: '#3949AB', weight: 2, opacity: 0.4, dashArray: '4 6' }).addTo(map)

      stops.forEach((stop, idx) => {
        bounds.push([stop.lat, stop.lng])
        const color = typeColors[stop.type] ?? '#3949AB'
        const icon = L.divIcon({
          html: `<div style="background:${color};color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${idx + 1}</div>`,
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })
        L.marker([stop.lat, stop.lng], { icon })
          .addTo(map)
          .bindPopup(`<strong>${stop.name}</strong>`)
      })

      if (bounds.length > 0) {
        map.fitBounds(bounds as L.LatLngBoundsExpression, { padding: [40, 40] })
      }
    }

    init().catch(console.error)

    return () => {
      if (map) map.remove()
      mapRef.current = null
    }
  }, [stops])

  if (stops.length === 0) return null

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ minHeight: 240 }}
      aria-label="Map showing today's stops"
    />
  )
}
