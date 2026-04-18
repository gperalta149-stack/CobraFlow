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
    default: 'bg-white shadow-sm',
    soft: 'bg-gray-50 border border-gray-100',
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
            bg-gradient-to-br from-gray-50 to-gray-100
            ${s.iconBox}
          `}
        >
          <div className={`${s.icon} text-gray-400`}>
            {icon}
          </div>
        </div>
      )}

      {/* TITLE */}
      <h3 className={`font-semibold text-gray-800 mb-2 ${s.title}`}>
        {title}
      </h3>

      {/* DESCRIPTION */}
      {description && (
        <p className={`text-gray-500 mx-auto ${s.desc}`}>
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