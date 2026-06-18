// frontend/src/components/ui/Card.tsx (actualizado)
import React from 'react'

interface CardProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const variants = {
  default: 'bg-white border-gray-200',
  primary: 'bg-blue-50 border-blue-200',
  success: 'bg-emerald-50 border-emerald-200',
  warning: 'bg-orange-50 border-orange-200',
  danger: 'bg-red-50 border-red-200',
}

const paddings = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function Card({ 
  children, 
  title, 
  subtitle, 
  icon, 
  action, 
  className = '', 
  variant = 'default',
  padding = 'md'
}: CardProps) {
  return (
    <div className={`border rounded-xl shadow-sm ${variants[variant]} ${className}`}>
      {(title || subtitle || icon || action) && (
        <div className={`flex items-start justify-between border-b ${variants[variant]} ${paddings[padding]}`}>
          <div className="flex items-center gap-3">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <div>
              {title && <h3 className="font-semibold text-gray-800">{title}</h3>}
              {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className={paddings[padding]}>{children}</div>
    </div>
  )
}