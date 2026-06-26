'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'

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

interface TripMapProps {
  stops: TripStop[]
  filter: string  // 'all' | 'Tokyo' | 'Kyoto' | 'Osaka'
  className?: string
}

const cityColors: Record<string, string> = {
  Tokyo: '#3949AB',
  Kyoto: '#E8B4BC',
  Osaka: '#C9A961',
}

const DEFAULT_COLOR = '#6B6560'

export default function TripMap({ stops, filter, className }: TripMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)
  const layerGroupRef = useRef<unknown>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let L: typeof import('leaflet')

    async function init() {
      L = (await import('leaflet')).default

      if (mapRef.current) {
        // Map already exists — just update the markers
        updateMarkers(L)
        return
      }

      // Fix default icon paths in Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const map = L.map(containerRef.current!, {
        zoomControl: true,
        scrollWheelZoom: false,
        center: [35.6762, 139.6503], // Tokyo
        zoom: 6,
      })

      mapRef.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      layerGroupRef.current = L.layerGroup().addTo(map)
      updateMarkers(L)
    }

    function updateMarkers(L: typeof import('leaflet')) {
      const lg = layerGroupRef.current as ReturnType<typeof import('leaflet').layerGroup>
      if (!lg) return
      lg.clearLayers()

      const filtered = filter === 'all' ? stops : stops.filter(s => s.city === filter)
      const bounds: [number, number][] = []

      filtered.forEach(stop => {
        bounds.push([stop.lat, stop.lng])
        const color = cityColors[stop.city] ?? DEFAULT_COLOR

        const icon = L.divIcon({
          html: `<div style="background:${color};color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer" title="${stop.name}">${stop.dayNumber}</div>`,
          className: '',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        })

        L.marker([stop.lat, stop.lng], { icon })
          .addTo(lg as unknown as ReturnType<typeof L.map>)
          .bindPopup(`
            <div style="font-family:sans-serif;min-width:160px">
              <strong style="display:block;margin-bottom:4px">${stop.name}</strong>
              <a href="/itinerary/${stop.dayNumber}" style="color:#3949AB;font-size:12px">→ Day ${stop.dayNumber}</a>
            </div>
          `)
      })

      const map = mapRef.current as ReturnType<typeof import('leaflet').map>
      if (bounds.length > 0) {
        try {
          map.fitBounds(bounds as import('leaflet').LatLngBoundsExpression, { padding: [40, 40], maxZoom: 14 })
        } catch {
          // ignore fitBounds errors
        }
      }
    }

    init().catch(() => { /* Leaflet init failed — likely SSR or missing container */ })
  }, [stops, filter])

  return (
    <div
      ref={containerRef}
      className={className}
      aria-label="Map of all trip stops"
    />
  )
}
