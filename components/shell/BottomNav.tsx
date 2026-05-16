'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Map, Bookmark, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/cn'

const navItems = [
  { href: '/', label: 'Today', icon: Home },
  { href: '/itinerary', label: 'Itinerary', icon: Calendar },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/reservations', label: 'Saved', icon: Bookmark },
  { href: '/tools', label: 'More', icon: MoreHorizontal },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-line/50 backdrop-blur-md bg-bg/90"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch h-14">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors',
                isActive ? 'text-accent' : 'text-muted hover:text-fg'
              )}
            >
              {/* Active dot indicator */}
              {isActive && (
                <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
              )}
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
