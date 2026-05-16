import { getItinerary, formatDateShort } from '@/lib/itinerary'
import { CommandPalette } from './CommandPalette'

export function CommandPaletteWrapper() {
  const itinerary = getItinerary()
  const days = itinerary.days.map((day, i) => ({
    dayNumber: i + 1,
    date: day.date,
    city: day.city,
    label: formatDateShort(day.date),
    stops: day.stops.map(s => s.name),
  }))
  return <CommandPalette days={days} />
}
