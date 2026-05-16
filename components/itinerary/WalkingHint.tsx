import { FootprintsIcon } from 'lucide-react'
import { formatWalkingHint } from '@/lib/geo'

interface WalkingHintProps {
  fromLat: number
  fromLng: number
  toLat: number
  toLng: number
}

export function WalkingHint({ fromLat, fromLng, toLat, toLng }: WalkingHintProps) {
  const hint = formatWalkingHint(fromLat, fromLng, toLat, toLng)
  return (
    <div className="flex items-center gap-1.5 py-1 px-3 text-xs text-muted">
      <div className="h-px flex-1 bg-line" />
      <FootprintsIcon size={11} />
      <span>{hint}</span>
      <div className="h-px flex-1 bg-line" />
    </div>
  )
}
