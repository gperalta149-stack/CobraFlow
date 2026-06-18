// frontend/src/components/ui/Input.tsx
import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export function Input({ label, error, icon, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full border rounded-xl px-4 py-2.5 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}