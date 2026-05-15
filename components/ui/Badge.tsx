import { cn } from '@/lib/cn'

type BadgeVariant = 'default' | 'accent' | 'ok' | 'warn' | 'muted' | 'sakura' | 'gold'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-surface-raised text-fg border-line',
  accent: 'bg-accent-soft text-accent border-accent/20',
  ok: 'bg-ok/10 text-ok border-ok/20',
  warn: 'bg-warn/10 text-warn border-warn/20',
  muted: 'bg-muted/10 text-muted border-muted/20',
  sakura: 'bg-sakura/15 text-fg border-sakura/30',
  gold: 'bg-gold/15 text-fg border-gold/30',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}
