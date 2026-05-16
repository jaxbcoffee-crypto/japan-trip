'use client'

import { useState } from 'react'
import { MessageSquare, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Phrase {
  en: string
  ja: string
  romaji: string
  category: string
}

const PHRASES: Phrase[] = [
  // Essentials
  { en: 'Thank you', ja: 'ありがとうございます', romaji: 'Arigatō gozaimasu', category: 'Essentials' },
  { en: 'Excuse me / Sorry', ja: 'すみません', romaji: 'Sumimasen', category: 'Essentials' },
  { en: 'Yes', ja: 'はい', romaji: 'Hai', category: 'Essentials' },
  { en: 'No', ja: 'いいえ', romaji: 'Iie', category: 'Essentials' },
  { en: 'Please (requesting)', ja: 'お願いします', romaji: 'Onegaishimasu', category: 'Essentials' },
  { en: "I don't understand", ja: 'わかりません', romaji: 'Wakarimasen', category: 'Essentials' },
  { en: 'Do you speak English?', ja: '英語は話せますか？', romaji: 'Eigo wa hanasemasu ka?', category: 'Essentials' },

  // Food
  { en: "I'll have this", ja: 'これをください', romaji: 'Kore wo kudasai', category: 'Food' },
  { en: 'Delicious!', ja: 'おいしい！', romaji: 'Oishii!', category: 'Food' },
  { en: 'The check, please', ja: 'お会計をお願いします', romaji: 'Okaikei wo onegaishimasu', category: 'Food' },
  { en: 'No pork / I can\'t eat pork', ja: '豚肉が食べられません', romaji: 'Butaniku ga taberaremasen', category: 'Food' },
  { en: 'Tap water, please', ja: 'お水をください', romaji: 'Omizu wo kudasai', category: 'Food' },

  // Navigation
  { en: 'Where is the train station?', ja: '駅はどこですか？', romaji: 'Eki wa doko desu ka?', category: 'Navigation' },
  { en: 'How do I get to [X]?', ja: '[X]へはどうやって行きますか？', romaji: '[X] e wa dō yatte ikimasu ka?', category: 'Navigation' },
  { en: 'One ticket to [X], please', ja: '[X]まで一枚ください', romaji: '[X] made ichimai kudasai', category: 'Navigation' },

  // Shopping
  { en: 'How much is this?', ja: 'いくらですか？', romaji: 'Ikura desu ka?', category: 'Shopping' },
  { en: 'Can I try this on?', ja: '試着できますか？', romaji: 'Shichaku dekimasu ka?', category: 'Shopping' },
  { en: 'Tax-free, please', ja: '免税でお願いします', romaji: 'Menzei de onegaishimasu', category: 'Shopping' },
]

const CATEGORIES = ['All', ...Array.from(new Set(PHRASES.map(p => p.category)))]

export function PhraseCard() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = activeCategory === 'All' ? PHRASES : PHRASES.filter(p => p.category === activeCategory)

  const copyJapanese = (ja: string) => {
    navigator.clipboard.writeText(ja).catch(() => {})
    setCopied(ja)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <section className="rounded-2xl border border-line bg-surface-raised overflow-hidden">
      <div className="px-5 py-4 border-b border-line flex items-center gap-2">
        <MessageSquare size={16} className="text-accent" />
        <h2 className="font-medium text-fg">Useful Phrases</h2>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 px-5 py-3 border-b border-line overflow-x-auto">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors border',
              activeCategory === cat
                ? 'bg-accent-soft text-accent border-transparent'
                : 'text-muted border-line hover:text-fg hover:bg-surface'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="divide-y divide-line">
        {filtered.map(phrase => (
          <div key={phrase.en} className="px-5 py-3 flex items-start justify-between gap-4 group">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted mb-0.5">{phrase.en}</p>
              <p className="font-jp text-base text-fg">{phrase.ja}</p>
              <p className="text-xs text-muted/70 italic">{phrase.romaji}</p>
            </div>
            <button
              onClick={() => copyJapanese(phrase.ja)}
              className="shrink-0 mt-1 text-muted hover:text-fg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label={`Copy ${phrase.ja}`}
            >
              {copied === phrase.ja
                ? <Check size={14} className="text-ok" />
                : <Copy size={14} />
              }
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
