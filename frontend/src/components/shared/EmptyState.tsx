import type { ReactNode } from 'react'

type Variant = 'default' | 'soft' | 'minimal'
type Size = 'sm' | 'md' | 'lg'

interface EmptyStateProps {
  title: string
  description?: string

  icon?: ReactNode
  action?: ReactNode // más flexible que actionText + onAction

  variant?: Variant
  size?: Size

  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  variant = 'default',
  size = 'md',
  className = ''
}: EmptyStateProps) {

  const sizes = {
    sm: {
      container: 'p-6',
      iconBox: 'w-12 h-12',
      icon: 'w-6 h-6',
      title: 'text-base',
      desc: 'text-xs max-w-xs'
    },
    md: {
      container: 'p-10',
      iconBox: 'w-16 h-16',
      icon: 'w-8 h-8',
      title: 'text-lg',
      desc: 'text-sm max-w-sm'
    },
    lg: {
      container: 'p-14',
      iconBox: 'w-20 h-20',
      icon: 'w-10 h-10',
      title: 'text-xl',
      desc: 'text-base max-w-md'
    }
  }

  const variants = {
    default: 'bg-[#242938] border border-[#2e3347] shadow-sm',
    soft: 'bg-[#1a1d2e] border border-[#2e3347]',
    minimal: ''
  }

  const s = sizes[size]

  return (
    <div
      className={`
        text-center rounded-xl animate-fade-in
        ${variants[variant]}
        ${s.container}
        ${className}
      `}
      role="status"
      aria-live="polite"
    >
      {/* ICON */}
      {icon && (
        <div
          className={`
            mx-auto mb-4 flex items-center justify-center rounded-xl
            bg-[#1a1d2e]
            ${s.iconBox}
          `}
        >
          <div className={`${s.icon} text-[#6b7280]`}>
            {icon}
          </div>
        </div>
      )}

      {/* TITLE */}
      <h3 className={`font-semibold text-[#f0f2f5] mb-2 ${s.title}`}>
        {title}
      </h3>

      {/* DESCRIPTION */}
      {description && (
        <p className={`text-[#94a3b8] mx-auto ${s.desc}`}>
          {description}
        </p>
      )}

      {/* ACTION SLOT */}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  )
}