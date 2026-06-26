#!/usr/bin/env node
/**
 * fetch-landmarks.mjs
 * Downloads and resizes Wikimedia Commons landmark images for each trip day.
 * Produces JPG, WebP, and AVIF at 1920/1280/640px widths.
 * Writes public/landmarks/credits.json with attribution and dominant hue.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const LANDMARKS_JSON = path.join(ROOT, 'data', 'landmarks.json')
const CREDITS_JSON = path.join(ROOT, 'public', 'landmarks', 'credits.json')
const OUT_DIR = path.join(ROOT, 'public', 'landmarks')

const USER_AGENT = 'japan-trip-pwa/0.1 (jaxbcoffee@gmail.com)'
const WIDTHS = [1920, 1280, 640]

// City gradient fallbacks (CSS gradients encoded as SVG for sharp)
const CITY_GRADIENTS = {
  Tokyo:    { stops: ['#1a237e', '#3949ab', '#7986cb'], angle: 135 },
  Kyoto:    { stops: ['#880e4f', '#c2185b', '#e8b4bc'], angle: 135 },
  Osaka:    { stops: ['#e65100', '#f57c00', '#ffb74d'], angle: 135 },
  Nara:     { stops: ['#1b5e20', '#388e3c', '#81c784'], angle: 135 },
  Nikko:    { stops: ['#4a148c', '#7b1fa2', '#ce93d8'], angle: 135 },
  Kamakura: { stops: ['#006064', '#0097a7', '#80deea'], angle: 135 },
  Himeji:   { stops: ['#37474f', '#607d8b', '#b0bec5'], angle: 135 },
  Miyajima: { stops: ['#b71c1c', '#d32f2f', '#ef9a9a'], angle: 135 },
  Kobe:     { stops: ['#0d47a1', '#1976d2', '#90caf9'], angle: 135 },
}

/** Generate a gradient SVG buffer for a given city and width/height */
function gradientSvgBuffer(city, width, height) {
  const g = CITY_GRADIENTS[city] ?? CITY_GRADIENTS['Tokyo']
  const angleRad = (g.angle * Math.PI) / 180
  const x1 = 50 - 50 * Math.cos(angleRad)
  const y1 = 50 - 50 * Math.sin(angleRad)
  const x2 = 50 + 50 * Math.cos(angleRad)
  const y2 = 50 + 50 * Math.sin(angleRad)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="g" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
      <stop offset="0%" stop-color="${g.stops[0]}"/>
      <stop offset="50%" stop-color="${g.stops[1]}"/>
      <stop offset="100%" stop-color="${g.stops[2]}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)"/>
</svg>`
  return Buffer.from(svg)
}

/** RGB to hue (0-360) */
function rgbToHue(r, g, b) {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const delta = max - min
  if (delta === 0) return 0
  let h
  if (max === rn) h = ((gn - bn) / delta) % 6
  else if (max === gn) h = (bn - rn) / delta + 2
  else h = (rn - gn) / delta + 4
  return Math.round(((h * 60) + 360) % 360)
}

/** Fetch with User-Agent header, returns Response or null on error */
async function fetchWithUA(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json, image/*, */*',
      },
    })
    return res
  } catch (err) {
    console.error(`  Fetch error for ${url}: ${err.message}`)
    return null
  }
}

/** Query Wikimedia Commons API for a file URL by title */
async function wikimediaUrlByTitle(title) {
  const encodedTitle = encodeURIComponent(`File:${title}`)
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodedTitle}&prop=imageinfo&iiprop=url|extmetadata&format=json&redirects=1`
  const res = await fetchWithUA(apiUrl)
  if (!res || !res.ok) return null
  try {
    const data = await res.json()
    const pages = data?.query?.pages ?? {}
    for (const page of Object.values(pages)) {
      if (page.missing !== undefined) continue
      const info = page.imageinfo?.[0]
      if (info?.url) {
        const attribution = info.extmetadata?.Artist?.value
          ?? info.extmetadata?.Credit?.value
          ?? 'See Wikimedia Commons'
        return { url: info.url, attribution }
      }
    }
  } catch {
    // ignore parse errors
  }
  return null
}

/** Fall back to Wikimedia search for a landmark */
async function wikimediaUrlBySearch(landmark) {
  const q = encodeURIComponent(`${landmark} japan`)
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${q}&prop=imageinfo&iiprop=url|extmetadata&gsrlimit=1&format=json`
  const res = await fetchWithUA(apiUrl)
  if (!res || !res.ok) return null
  try {
    const data = await res.json()
    const pages = data?.query?.pages ?? {}
    for (const page of Object.values(pages)) {
      const info = page.imageinfo?.[0]
      if (info?.url) {
        const attribution = info.extmetadata?.Artist?.value
          ?? info.extmetadata?.Credit?.value
          ?? 'See Wikimedia Commons'
        return { url: info.url, attribution }
      }
    }
  } catch {
    // ignore
  }
  return null
}

/** Download image bytes from a URL */
async function downloadImageBuffer(url) {
  const res = await fetchWithUA(url)
  if (!res || !res.ok) return null
  try {
    const arrayBuffer = await res.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch {
    return null
  }
}

/** Extract dominant hue from a sharp image buffer */
async function getDominantHue(buf) {
  try {
    const stats = await sharp(buf).stats()
    const r = Math.round(stats.channels[0]?.mean ?? 128)
    const g = Math.round(stats.channels[1]?.mean ?? 128)
    const b = Math.round(stats.channels[2]?.mean ?? 128)
    const hue = rgbToHue(r, g, b)
    return `hsl(${hue}, 60%, 45%)`
  } catch {
    return '#3949AB'
  }
}

/** Process and save image at multiple resolutions */
async function processImage(sourceBuffer, dayNN) {
  const sizes = []
  const sharpInstance = sharp(sourceBuffer)
  const metadata = await sharpInstance.metadata()
  const sourceWidth = metadata.width ?? 1920

  for (const width of WIDTHS) {
    const resized = width < sourceWidth
      ? sharp(sourceBuffer).resize({ width, withoutEnlargement: true })
      : sharp(sourceBuffer)

    const jpgPath = path.join(OUT_DIR, `day${dayNN}-${width}.jpg`)
    const webpPath = path.join(OUT_DIR, `day${dayNN}-${width}.webp`)
    const avifPath = path.join(OUT_DIR, `day${dayNN}-${width}.avif`)

    await resized.clone().jpeg({ quality: 85, progressive: true }).toFile(jpgPath)
    await resized.clone().webp({ quality: 80 }).toFile(webpPath)
    await resized.clone().avif({ quality: 60 }).toFile(avifPath)

    sizes.push(width)
  }
  return sizes
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })

  const landmarks = JSON.parse(readFileSync(LANDMARKS_JSON, 'utf8'))
  const days = landmarks.days

  // Load existing credits if available
  let existingCredits = { days: [] }
  if (existsSync(CREDITS_JSON)) {
    try {
      existingCredits = JSON.parse(readFileSync(CREDITS_JSON, 'utf8'))
    } catch {
      // start fresh
    }
  }
  const creditsMap = new Map(
    (existingCredits.days ?? []).map(e => [e.dayIndex, e])
  )

  let successCount = 0
  let gradientCount = 0

  for (const entry of days) {
    const nn = String(entry.dayIndex).padStart(2, '0')
    const checkPath = path.join(OUT_DIR, `day${nn}-640.jpg`)

    if (existsSync(checkPath)) {
      console.log(`[day${nn}] Skipping — already exists`)
      successCount++
      continue
    }

    console.log(`[day${nn}] ${entry.landmark} (${entry.city})`)

    let imageBuffer = null
    let attribution = entry.photographer
    let sourceUrl = null
    let usedGradient = false

    // Step 1: Try Wikimedia by title
    console.log(`  Querying Wikimedia: ${entry.wikimediaTitle}`)
    const byTitle = await wikimediaUrlByTitle(entry.wikimediaTitle)
    if (byTitle) {
      console.log(`  Found by title: ${byTitle.url}`)
      imageBuffer = await downloadImageBuffer(byTitle.url)
      if (imageBuffer) {
        attribution = byTitle.attribution
        sourceUrl = byTitle.url
      }
    }

    // Step 2: Fall back to search
    if (!imageBuffer) {
      console.log(`  Title lookup failed, trying search for: ${entry.landmark}`)
      const bySearch = await wikimediaUrlBySearch(entry.landmark)
      if (bySearch) {
        console.log(`  Found by search: ${bySearch.url}`)
        imageBuffer = await downloadImageBuffer(bySearch.url)
        if (imageBuffer) {
          attribution = bySearch.attribution
          sourceUrl = bySearch.url
        }
      }
    }

    // Step 3: Generate gradient fallback
    if (!imageBuffer) {
      console.warn(`  WARNING: No image found for day${nn} (${entry.landmark}) — using gradient fallback`)
      imageBuffer = await sharp(gradientSvgBuffer(entry.city, 1920, 1080))
        .jpeg({ quality: 85 })
        .toBuffer()
      usedGradient = true
      gradientCount++
    } else {
      successCount++
    }

    // Process and save
    try {
      await processImage(imageBuffer, nn)

      // Compute dominant hue from 640px jpg
      const jpg640 = readFileSync(path.join(OUT_DIR, `day${nn}-640.jpg`))
      const dominantHue = await getDominantHue(jpg640)

      creditsMap.set(entry.dayIndex, {
        dayIndex: entry.dayIndex,
        file: `day${nn}`,
        url: sourceUrl ?? 'gradient-fallback',
        attribution,
        dominantHue,
        sizes: WIDTHS,
        gradientFallback: usedGradient,
      })

      console.log(`  Saved day${nn} — dominantHue: ${dominantHue}`)
    } catch (err) {
      console.error(`  ERROR processing day${nn}: ${err.message}`)
      // Remove partial files so reruns retry
      for (const w of WIDTHS) {
        const formats = ['jpg', 'webp', 'avif']
        for (const fmt of formats) {
          const p = path.join(OUT_DIR, `day${nn}-${w}.${fmt}`)
          try { if (existsSync(p)) { unlinkSync(p) } } catch { /* ignore */ }
        }
      }
    }

    // Small delay to be polite to Wikimedia
    await new Promise(r => setTimeout(r, 300))
  }

  // Write credits.json
  const creditsOutput = {
    days: Array.from(creditsMap.values()).sort((a, b) => a.dayIndex - b.dayIndex),
  }
  writeFileSync(CREDITS_JSON, JSON.stringify(creditsOutput, null, 2))
  console.log(`\nCredits written to ${CREDITS_JSON}`)
  console.log(`\nSummary: ${successCount} images downloaded, ${gradientCount} gradient fallbacks`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
