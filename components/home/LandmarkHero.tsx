import { landmarkForDay, cityGradient } from '@/lib/landmarks'

interface LandmarkHeroProps {
  dayIndex: number   // 0-20 for trip, -1 for pre-trip, 21 for post
  city: string
  className?: string
}

export function LandmarkHero({ dayIndex, city, className }: LandmarkHeroProps) {
  const info = dayIndex >= 0 && dayIndex <= 20 ? landmarkForDay(dayIndex) : null
  const gradient = cityGradient(city)

  return (
    <div className={`absolute inset-0 overflow-hidden ${className ?? ''}`} aria-hidden="true">
      {info ? (
        <picture className="absolute inset-0 w-full h-full">
          <source type="image/avif" srcSet={info.srcSet.avif} sizes="100vw" />
          <source type="image/webp" srcSet={info.srcSet.webp} sizes="100vw" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={info.src}
            srcSet={info.srcSet.jpg}
            sizes="100vw"
            alt={info.altText}
            className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
            // @ts-ignore — fetchPriority is valid HTML but TS defs may lag
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      ) : (
        <div className="absolute inset-0" style={{ background: gradient }} />
      )}

      {/* Multi-stop vignette for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      {/* Attribution */}
      {info && (
        <p className="absolute bottom-2 right-3 text-[10px] text-white/50 font-sans">
          {info.attribution}
        </p>
      )}
    </div>
  )
}
