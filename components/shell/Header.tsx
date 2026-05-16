'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPin, Calendar, Map, Bookmark, Wrench } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/cn'

const navItems = [
  { href: '/', label: 'Today', icon: MapPin },
  { href: '/itinerary', label: 'Itinerary', icon: Calendar },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/reservations', label: 'Reservations', icon: Bookmark },
  { href: '/tools', label: 'Tools', icon: Wrench },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-line/50 backdrop-blur-md bg-bg/80">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-jp text-base text-fg leading-none">日本旅行</span>
          <span className="hidden sm:block text-xs text-muted font-medium tracking-widest uppercase">
            Japan Trip
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
          {navItems.map(({ href, label }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent-soft text-accent'
                    : 'text-muted hover:text-fg hover:bg-surface-raised'
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Cmd-K search trigger */}
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))}
            className="hidden sm:flex items-center gap-2 text-xs text-muted/60 border border-line/60 rounded-lg px-2.5 py-1.5 hover:border-line hover:text-muted transition-colors"
            aria-label="Open search (⌘K)"
          >
            <span>Search</span>
            <kbd className="font-sans text-[10px] opacity-70">⌘K</kbd>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
