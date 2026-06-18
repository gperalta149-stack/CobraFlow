// frontend/src/components/ui/Button.tsx
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark' | 'dark-primary'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-sm',
  outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
  ghost: 'hover:bg-gray-100 text-gray-600',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  dark: 'bg-[#242938] hover:bg-[#2a3045] text-white border border-[#2e3347]',
  'dark-primary': 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
}

const sizes = {
  sm: 'px-3 py-2 text-xs rounded-lg min-h-[32px]',
  md: 'px-4 py-2.5 text-sm rounded-xl min-h-[42px]', /* ← Forzamos una altura mínima saludable */
  lg: 'px-6 py-3 text-base rounded-xl min-h-[50px]',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  )
}