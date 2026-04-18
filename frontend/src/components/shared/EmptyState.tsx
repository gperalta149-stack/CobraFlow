import type { ReactElement } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: ReactElement
  actionText?: string
  onAction?: () => void
  variant?: 'default' | 'compact'
}

export function EmptyState({
  title,
  description,
  icon,
  actionText,
  onAction,
  variant = 'default'
}: EmptyStateProps) {
  const isCompact = variant === 'compact'

  return (
    <div className={`bg-white rounded-xl shadow-sm text-center animate-fade-in ${
      isCompact ? 'p-6' : 'p-10'
    }`}>
      
      {/* Contenedor de ícono con peso visual */}
      <div className={`mx-auto mb-4 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 ${
        isCompact ? 'w-12 h-12' : 'w-16 h-16'
      }`}>
        <div className={isCompact ? 'w-6 h-6' : 'w-8 h-8'}>
          {icon}
        </div>
      </div>

      <h3 className={`font-semibold text-gray-800 mb-2 ${
        isCompact ? 'text-base' : 'text-lg'
      }`}>
        {title}
      </h3>

      <p className={`text-gray-500 mx-auto ${
        isCompact ? 'text-xs max-w-xs' : 'text-sm max-w-sm'
      }`}>
        {description}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}