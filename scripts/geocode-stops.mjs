#!/usr/bin/env node
/**
 * geocode-stops.mjs
 * Looks up lat/lng for each stop in data/itinerary.json using Nominatim.
 * Caches results in data/geocode-cache.json and writes updated itinerary.json.
 * Rate limit: 1 request per second (1100ms delay between calls).
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const ITINERARY_JSON = path.join(ROOT, 'data', 'itinerary.json')
const CACHE_JSON = path.join(ROOT, 'data', 'geocode-cache.json')

const USER_AGENT = 'japan-trip-pwa/0.1 (jaxbcoffee@gmail.com)'
const NOMINATIM_DELAY_MS = 1100

/** Sleep for ms milliseconds */
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

/** Query Nominatim for a stop name + city */
async function geocode(name, city) {
  const q = encodeURIComponent(`${name}, ${city}, Japan`)
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept-Language': 'en',
        'Accept': 'application/json',
      },
    })
    if (!res.ok) {
      console.error(`  Nominatim error ${res.status} for "${name}"`)
      return null
    }
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) return null
    const first = data[0]
    if (!first?.lat || !first?.lon) return null
    return {
      lat: Math.round(parseFloat(first.lat) * 1_000_000) / 1_000_000,
      lng: Math.round(parseFloat(first.lon) * 1_000_000) / 1_000_000,
    }
  } catch (err) {
    console.error(`  Fetch error for "${name}": ${err.message}`)
    return null
  }
}

async function main() {
  // Load itinerary
  const itinerary = JSON.parse(readFileSync(ITINERARY_JSON, 'utf8'))

  // Load or init geocode cache
  let cache = {}
  if (existsSync(CACHE_JSON)) {
    try {
      cache = JSON.parse(readFileSync(CACHE_JSON, 'utf8'))
    } catch {
      console.warn('Could not parse geocode-cache.json — starting fresh')
    }
  }

  // Collect all stops that need geocoding
  const allStops = []
  for (const day of itinerary.days) {
    for (const stop of day.stops) {
      allStops.push({ stop, city: day.city })
    }
  }

  const total = allStops.length
  let geocoded = 0
  let cached = 0
  let failed = 0
  let idx = 0

  for (const { stop, city } of allStops) {
    idx++
    const progress = `[${idx}/${total}]`

    // Already has coordinates
    if (stop.lat !== undefined && stop.lng !== undefined) {
      console.log(`${progress} ${stop.name} — already has coords (${stop.lat}, ${stop.lng})`)
      cached++
      continue
    }

    // Check cache
    if (cache[stop.id]) {
      const cached_entry = cache[stop.id]
      stop.lat = cached_entry.lat
      stop.lng = cached_entry.lng
      console.log(`${progress} ${stop.name} — from cache (${stop.lat}, ${stop.lng})`)
      cached++
      continue
    }

    // Query Nominatim
    console.log(`${progress} Geocoding: "${stop.name}" in ${city}...`)
    await sleep(NOMINATIM_DELAY_MS)

    const result = await geocode(stop.name, city)
    if (result) {
      stop.lat = result.lat
      stop.lng = result.lng
      cache[stop.id] = { lat: result.lat, lng: result.lng, name: stop.name, city }
      geocoded++
      console.log(`  Found: (${result.lat}, ${result.lng})`)
    } else {
      failed++
      console.warn(`  Not found — skipping "${stop.name}"`)
    }

    // Save cache after each successful geocode (resilient to interruptions)
    writeFileSync(CACHE_JSON, JSON.stringify(cache, null, 2))
  }

  // Write updated itinerary
  writeFileSync(ITINERARY_JSON, JSON.stringify(itinerary, null, 2))
  writeFileSync(CACHE_JSON, JSON.stringify(cache, null, 2))

  console.log('\n=== Geocoding complete ===')
  console.log(`  Total stops: ${total}`)
  console.log(`  From cache / pre-existing: ${cached}`)
  console.log(`  Newly geocoded: ${geocoded}`)
  console.log(`  Failed / not found: ${failed}`)
  console.log(`  Cache written: ${CACHE_JSON}`)
  console.log(`  Itinerary updated: ${ITINERARY_JSON}`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
