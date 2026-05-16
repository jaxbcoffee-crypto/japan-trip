import { PhraseCard } from '@/components/tools/PhraseCard'
import { CurrencyCard } from '@/components/tools/CurrencyCard'
import { EmergencyCard } from '@/components/tools/EmergencyCard'

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Page hero */}
      <div className="border-b border-line bg-surface-raised">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <p className="font-jp text-2xl text-muted mb-1">ツール</p>
          <h1 className="font-serif text-5xl font-bold text-fg mb-2">Travel Tools</h1>
          <p className="text-muted text-sm">Phrases, currency, and emergency info — all offline</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 space-y-8">
        <CurrencyCard />
        <PhraseCard />
        <EmergencyCard />
      </div>
    </div>
  )
}
