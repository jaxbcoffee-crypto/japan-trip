'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { Moon, Sun } from 'lucide-react'
import { IconButton } from './IconButton'

function getThemeSnapshot(): 'light' | 'dark' {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark') return 'dark'
  if (stored === 'light') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function subscribe(cb: () => void) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, () => 'light' as const)

  const toggle = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
    // Trigger re-render via a storage event so useSyncExternalStore picks it up
    window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: next }))
  }, [theme])

  return (
    <IconButton
      label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      onClick={toggle}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </IconButton>
  )
}
