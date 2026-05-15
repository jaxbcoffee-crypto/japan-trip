import { cn } from '@/lib/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  elevated?: boolean
}

export function Card({ children, className, elevated }: CardProps) {
  return (
    <div className={cn(
      'rounded-lg border border-line bg-surface p-4',
      elevated && 'shadow-md',
      className
    )}>
      {children}
    </div>
  )
}
