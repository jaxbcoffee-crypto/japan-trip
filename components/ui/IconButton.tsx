import { cn } from '@/lib/cn'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' }

export function IconButton({ label, size = 'md', className, children, ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        'text-muted hover:text-fg hover:bg-surface-raised',
        'transition-colors active:scale-95',
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
