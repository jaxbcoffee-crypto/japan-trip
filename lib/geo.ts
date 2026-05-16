/** Haversine distance between two coordinates, in km */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

/** Walking time in minutes at 4.8 km/h */
export function walkingMinutes(distanceKm: number): number {
  return Math.round((distanceKm / 4.8) * 60)
}

/** Format walking hint string */
export function formatWalkingHint(lat1: number, lng1: number, lat2: number, lng2: number): string {
  const dist = haversineKm(lat1, lng1, lat2, lng2)
  const mins = walkingMinutes(dist)
  if (dist < 0.1) return '< 2 min walk'
  if (mins <= 25) return `${mins} min walk`
  return `${Math.round(dist * 10) / 10} km`
}
