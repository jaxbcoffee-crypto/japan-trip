import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getItinerary, formatDateShort } from '@/lib/itinerary'
import { landmarkForDay } from '@/lib/landmarks'
import { Camera, Utensils, ShoppingBag, Eye, Footprints, CalendarDays, Hotel } from 'lucide-react'

export const revalidate = 3600

const CITY_META: Record<string, {
  ja: string
  tagline: string
  color: string
  hue: string
  bgGrad: string
}> = {
  Tokyo: {
    ja: '東京',
    tagline: 'Where tradition meets the future',
    color: '#3949AB',
    hue: '225',
    bgGrad: 'from-[#1a1f3c] to-[#2d3561]',
  },
  Kyoto: {
    ja: '京都',
    tagline: 'Ancient temples and timeless gardens',
    color: '#E8B4BC',
    hue: '350',
    bgGrad: 'from-[#3d1f2a] to-[#5c2d3e]',
  },
  Osaka: {
    ja: '大阪',
    tagline: 'The nation\'s kitchen and street food capital',
    color: '#C9A961',
    hue: '42',
    bgGrad: 'from-[#2d2010] to-[#4a3520]',
  },
}

const STOP_TYPES = [
  { key: 'sight', Icon: Eye, label: 'Sights' },
  { key: 'food', Icon: Utensils, label: 'Food' },
  { key: 'shop', Icon: ShoppingBag, label: 'Shopping' },
  { key: 'free', Icon: Footprints, label: 'Free time' },
]

export async function generateStaticParams() {
  return ['Tokyo', 'Kyoto', 'Osaka'].map(city => ({ city }))
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const meta = CITY_META[city]
  if (!meta) notFound()

  const itinerary = getItinerary()
  const cityDays = itinerary.days
    .map((day, i) => ({ day, dayNumber: i + 1, dayIndex: i }))
    .filter(({ day }) => day.city === city)

  if (cityDays.length === 0) notFound()

  const allStops = cityDays.flatMap(({ day }) => day.stops)
  const stopCounts = STOP_TYPES.map(t => ({
    ...t,
    count: allStops.filter(s => s.type === t.key).length,
  }))

  // First landmark photo for this city
  const heroLandmark = cityDays
    .map(({ dayIndex }) => landmarkForDay(dayIndex))
    .find(lm => lm !== null)

  const hotels = Array.from(
    new Set(cityDays.map(({ day }) => day.hotel?.name).filter(Boolean))
  ) as string[]

  const firstDay = cityDays[0]!
  const lastDay = cityDays[cityDays.length - 1]!

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <div className="relative h-[50svh] min-h-[280px] overflow-hidden">
        {heroLandmark ? (
          <picture>
            <source type="image/avif" srcSet={heroLandmark.srcSet.avif} sizes="100vw" />
            <source type="image/webp" srcSet={heroLandmark.srcSet.webp} sizes="100vw" />
            <img
              src={heroLandmark.src}
              alt={heroLandmark.altText}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </picture>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${meta.bgGrad}`} />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Back link */}
        <Link
          href="/itinerary"
          className="absolute top-4 left-4 text-white/80 hover:text-white text-sm flex items-center gap-1.5 transition-colors"
        >
          ← Itinerary
        </Link>

        {/* City name */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
          <p className="font-jp text-3xl text-white/70 mb-1">{meta.ja}</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white mb-2">{city}</h1>
          <p className="text-white/60 text-sm">{meta.tagline}</p>
        </div>
      </div>

      {/* Stats bar */}
      <div
        className="border-b border-line"
        style={{ background: `hsl(${meta.hue} 20% 10% / 0.04)` }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5 text-muted">
            <CalendarDays size={14} style={{ color: meta.color }} />
            <span><strong className="text-fg">{cityDays.length}</strong> days</span>
          </div>
          {stopCounts.filter(s => s.count > 0).map(({ key, Icon, label, count }) => (
            <div key={key} className="flex items-center gap-1.5 text-muted">
              <Icon size={14} style={{ color: meta.color }} />
              <span><strong className="text-fg">{count}</strong> {label.toLowerCase()}</span>
            </div>
          ))}
          <div className="text-muted ml-auto text-xs">
            {formatDateShort(firstDay.day.date)} – {formatDateShort(lastDay.day.date)}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 space-y-10">
        {/* Hotels */}
        {hotels.length > 0 && (
          <section>
            <h2 className="font-medium text-fg mb-3 flex items-center gap-2">
              <Hotel size={15} className="text-muted" />
              {hotels.length === 1 ? 'Staying at' : 'Hotels'}
            </h2>
            <div className="space-y-2">
              {hotels.map(hotel => (
                <div
                  key={hotel}
                  className="rounded-xl border border-line bg-surface-raised px-4 py-3 text-sm text-fg"
                >
                  {hotel}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Day list */}
        <section>
          <h2 className="font-medium text-fg mb-3 flex items-center gap-2">
            <CalendarDays size={15} className="text-muted" />
            Days in {city}
          </h2>
          <div className="space-y-2">
            {cityDays.map(({ day, dayNumber, dayIndex }) => {
              const landmark = landmarkForDay(dayIndex)
              const sightCount = day.stops.filter(s => s.type === 'sight').length
              const foodCount = day.stops.filter(s => s.type === 'food').length
              return (
                <Link
                  key={dayNumber}
                  href={`/itinerary/${dayNumber}`}
                  className="flex items-center gap-4 rounded-xl border border-line bg-surface-raised hover:bg-surface-raised/80 hover:border-accent/30 transition-all px-4 py-3 group"
                >
                  {/* Day number bubble */}
                  <div
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ background: meta.color }}
                  >
                    {dayNumber}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-fg">{formatDateShort(day.date)}</p>
                    {landmark && (
                      <p className="text-xs text-muted truncate">{landmark.landmark}</p>
                    )}
                  </div>

                  {/* Stop summary */}
                  <div className="shrink-0 flex items-center gap-2 text-xs text-muted">
                    {sightCount > 0 && (
                      <span className="flex items-center gap-0.5">
                        <Eye size={11} /> {sightCount}
                      </span>
                    )}
                    {foodCount > 0 && (
                      <span className="flex items-center gap-0.5">
                        <Utensils size={11} /> {foodCount}
                      </span>
                    )}
                    <span className="text-accent group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Attribution */}
        {heroLandmark && (
          <p className="text-xs text-muted/60 flex items-center gap-1.5">
            <Camera size={11} />
            Hero photo: {heroLandmark.attribution} · {heroLandmark.license}
          </p>
        )}
      </div>
    </div>
  )
}
