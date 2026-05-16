import { ShieldAlert, Phone } from 'lucide-react'

const CONTACTS = [
  { label: 'Police (110)', value: '110', note: 'English operators available' },
  { label: 'Fire / Ambulance (119)', value: '119', note: 'Ask for English line' },
  { label: 'Japan Helpline', value: '0570-000-911', note: '24/7 English assistance' },
  { label: 'AMEX Emergency', value: '+1-336-393-1111', note: 'Card loss / theft' },
  { label: 'US Embassy Tokyo', value: '+81-3-3224-5000', note: 'After hours: press 0' },
]

const TIPS = [
  'Ambulances in Japan are free — never hesitate to call 119',
  'Say 「救急車を呼んでください」(Kyūkyūsha wo yonde kudasai) — "Please call an ambulance"',
  'Most convenience stores have AEDs',
  'Many pharmacies (薬局) have English-speaking staff in tourist areas',
  'Keep your hotel business card to show taxi drivers if lost',
]

export function EmergencyCard() {
  return (
    <section className="rounded-2xl border border-warn/30 bg-warn/5 overflow-hidden">
      <div className="px-5 py-4 border-b border-warn/20 flex items-center gap-2">
        <ShieldAlert size={16} className="text-warn" />
        <h2 className="font-medium text-fg">Emergency Information</h2>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Numbers */}
        <div className="space-y-2">
          {CONTACTS.map(({ label, value, note }) => (
            <div key={label} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-fg">{label}</p>
                {note && <p className="text-xs text-muted">{note}</p>}
              </div>
              <a
                href={`tel:${value.replace(/[^+\d]/g, '')}`}
                className="flex items-center gap-1.5 text-sm font-mono font-medium text-accent hover:underline"
              >
                <Phone size={12} />
                {value}
              </a>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div>
          <p className="text-xs font-medium text-muted mb-2 uppercase tracking-wider">Good to know</p>
          <ul className="space-y-1.5">
            {TIPS.map(tip => (
              <li key={tip} className="text-xs text-muted flex gap-2">
                <span className="text-warn mt-0.5 shrink-0">·</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
