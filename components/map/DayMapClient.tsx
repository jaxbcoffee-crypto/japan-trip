'use client'

import dynamic from 'next/dynamic'

interface MapStop {
  id: string
  name: string
  lat: number
  lng: number
  type: string
}

interface DayMapClientProps {
  stops: MapStop[]
  className?: string
}

const DayMap = dynamic(() => import('./DayMap'), { ssr: false })

export function DayMapClient({ stops, className }: DayMapClientProps) {
  return <DayMap stops={stops} className={className} />
}
