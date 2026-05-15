import { cn } from '@/lib/cn'

interface SurfaceProps {
  children: React.ReactNode
  className?: string
  glass?: boolean
}

export function Surface({ children, className, glass }: SurfaceProps) {
  return (
    <div className={cn(
      'rounded-xl bg-surface border border-line',
      glass && 'backdrop-blur-md bg-surface/80 border-white/10',
      className
    )}>
      {children}
    </div>
  )
}
