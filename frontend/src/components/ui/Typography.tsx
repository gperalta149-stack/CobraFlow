// frontend/src/components/ui/Typography.tsx
import React from 'react'

// Headings
export function H1({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h1 className={`text-2xl md:text-3xl font-bold text-gray-900 ${className}`}>{children}</h1>
}

export function H2({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`text-xl md:text-2xl font-semibold text-gray-800 ${className}`}>{children}</h2>
}

export function H3({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-lg md:text-xl font-semibold text-gray-800 ${className}`}>{children}</h3>
}

export function H4({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h4 className={`text-base font-semibold text-gray-700 ${className}`}>{children}</h4>
}

// Text variants
export function Text({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-gray-600 ${className}`}>{children}</p>
}

export function TextMuted({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-gray-400 ${className}`}>{children}</p>
}

export function TextSmall({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-xs text-gray-400 ${className}`}>{children}</p>
}