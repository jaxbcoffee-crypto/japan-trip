'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Calendar, Map, Hotel, X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SearchItem {
  id: string
  type: 'day' | 'city' | 'page' | 'stop'
  title: string
  subtitle?: string
  href: string
  icon?: React.ReactNode
}

interface Props {
  days: Array<{
    dayNumber: number
    date: string
    city: string
    label: string
    stops: string[]
  }>
}

const STATIC_PAGES: SearchItem[] = [
  { id: 'home', type: 'page', title: 'Home', subtitle: 'Trip overview', href: '/', icon: <MapPin size={14} /> },
  { id: 'itinerary', type: 'page', title: 'Full Itinerary', subtitle: 'All 21 days', href: '/itinerary', icon: <Calendar size={14} /> },
  { id: 'map', type: 'page', title: 'Trip Map', subtitle: 'Interactive map', href: '/map', icon: <Map size={14} /> },
  { id: 'reservations', type: 'page', title: 'Reservations', subtitle: 'Bookings & confirmations', href: '/reservations', icon: <Hotel size={14} /> },
  { id: 'city-tokyo', type: 'city', title: 'Tokyo', subtitle: '東京 · 8 days', href: '/city/Tokyo', icon: <MapPin size={14} /> },
  { id: 'city-kyoto', type: 'city', title: 'Kyoto', subtitle: '京都 · 5 days', href: '/city/Kyoto', icon: <MapPin size={14} /> },
  { id: 'city-osaka', type: 'city', title: 'Osaka', subtitle: '大阪 · 8 days', href: '/city/Osaka', icon: <MapPin size={14} /> },
]

export function CommandPalette({ days }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const dayItems: SearchItem[] = days.map(d => ({
    id: `day-${d.dayNumber}`,
    type: 'day' as const,
    title: `Day ${d.dayNumber} — ${d.city}`,
    subtitle: d.label,
    href: `/itinerary/${d.dayNumber}`,
    icon: <Calendar size={14} />,
  }))

  const allItems = [...STATIC_PAGES, ...dayItems]

  const filtered = query.trim()
    ? allItems.filter(item => {
        const q = query.toLowerCase()
        return (
          item.title.toLowerCase().includes(q) ||
          (item.subtitle?.toLowerCase().includes(q) ?? false)
        )
      })
    : STATIC_PAGES

  const handleOpen = useCallback(() => {
    setOpen(true)
    setQuery('')
    setActiveIdx(0)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
    setQuery('')
  }, [])

  const handleSelect = useCallback((item: SearchItem) => {
    router.push(item.href)
    handleClose()
  }, [router, handleClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        open ? handleClose() : handleOpen()
      }
      if (e.key === 'Escape' && open) handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, handleOpen, handleClose])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setActiveIdx(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[activeIdx]) {
      handleSelect(filtered[activeIdx])
    }
  }

  useEffect(() => {
    const el = listRef.current?.children[activeIdx] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  if (!open) return null

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15svh] px-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="relative w-full max-w-lg rounded-2xl border border-line bg-surface-raised shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-line">
          <Search size={16} className="text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, days, cities…"
            className="flex-1 bg-transparent text-sm text-fg placeholder:text-muted outline-none"
          />
          <button onClick={handleClose} className="text-muted hover:text-fg transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <ul ref={listRef} className="max-h-80 overflow-y-auto py-1">
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-muted">No results</li>
          )}
          {filtered.map((item, i) => (
            <li key={item.id}>
              <button
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setActiveIdx(i)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                  i === activeIdx ? 'bg-accent/10 text-accent' : 'text-fg hover:bg-surface'
                )}
              >
                <span className={cn('shrink-0', i === activeIdx ? 'text-accent' : 'text-muted')}>
                  {item.icon}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium truncate">{item.title}</span>
                  {item.subtitle && (
                    <span className="block text-xs text-muted truncate">{item.subtitle}</span>
                  )}
                </span>
                <span className="shrink-0 text-xs text-muted/60 capitalize">{item.type}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Footer hint */}
        <div className="border-t border-line px-4 py-2 flex items-center gap-3 text-xs text-muted/60">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
          <span className="ml-auto">⌘K</span>
        </div>
      </div>
    </div>
  )
}
