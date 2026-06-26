'use client'

import { useState } from 'react'
import { DollarSign } from 'lucide-react'

// Approximate reference rate — for travel budgeting only
const APPROX_RATE = 150 // 1 USD ≈ 150 JPY

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 50000]

export function CurrencyCard() {
  const [jpy, setJpy] = useState('')
  const [usd, setUsd] = useState('')

  const handleJpy = (val: string) => {
    const n = parseFloat(val)
    setJpy(val)
    setUsd(isNaN(n) ? '' : (n / APPROX_RATE).toFixed(2))
  }

  const handleUsd = (val: string) => {
    const n = parseFloat(val)
    setUsd(val)
    setJpy(isNaN(n) ? '' : Math.round(n * APPROX_RATE).toString())
  }

  return (
    <section className="rounded-2xl border border-line bg-surface-raised overflow-hidden">
      <div className="px-5 py-4 border-b border-line flex items-center gap-2">
        <DollarSign size={16} className="text-gold" />
        <h2 className="font-medium text-fg">Currency Converter</h2>
        <span className="ml-auto text-xs text-muted">≈ ¥{APPROX_RATE} / $1 USD</span>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Quick amounts */}
        <div>
          <p className="text-xs text-muted mb-2">Quick reference (JPY → USD)</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map(amount => (
              <button
                key={amount}
                onClick={() => handleJpy(amount.toString())}
                className="rounded-full border border-line bg-surface text-sm px-3 py-1 text-muted hover:border-gold hover:text-fg transition-colors"
              >
                ¥{amount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted font-jp">¥</span>
            <input
              type="number"
              value={jpy}
              onChange={e => handleJpy(e.target.value)}
              placeholder="0"
              className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-line bg-bg text-sm text-fg focus:outline-none focus:border-accent transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted/60">JPY</span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">$</span>
            <input
              type="number"
              value={usd}
              onChange={e => handleUsd(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-line bg-bg text-sm text-fg focus:outline-none focus:border-accent transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted/60">USD</span>
          </div>
        </div>

        <p
          aria-live="polite"
          aria-atomic="true"
          className="text-center text-sm text-muted min-h-[1.25rem]"
        >
          {jpy && usd
            ? <>¥{parseFloat(jpy).toLocaleString()} ≈ <strong className="text-fg">${parseFloat(usd).toFixed(2)}</strong></>
            : null
          }
        </p>

        {/* Common prices */}
        <div>
          <p className="text-xs text-muted mb-2">Common costs</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted">
            {[
              ['Convenience store meal', '¥500–800'],
              ['Ramen bowl', '¥900–1,500'],
              ['Shinkansen (Tokyo→Kyoto)', '¥14,000'],
              ['Subway ride', '¥170–350'],
              ['Convenience store beer', '¥250'],
              ['Konbini coffee', '¥110–180'],
            ].map(([item, price]) => (
              <div key={item} className="flex justify-between gap-2">
                <span className="truncate">{item}</span>
                <span className="shrink-0 text-fg">{price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
