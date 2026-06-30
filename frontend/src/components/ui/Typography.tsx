// frontend/src/components/ui/Typography.tsx
import React from 'react'

interface TextProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

// ── Headings ──────────────────────────────────────────────────────────────

export function H1({ children, className = '', style }: TextProps) {
  return (
    <h1
      className={className}
      style={{ fontSize: 22, fontWeight: 700, color: '#f0f2f5', letterSpacing: '-0.3px', margin: 0, ...style }}
    >
      {children}
    </h1>
  )
}

export function H2({ children, className = '', style }: TextProps) {
  return (
    <h2
      className={className}
      style={{ fontSize: 16, fontWeight: 600, color: '#f0f2f5', margin: 0, ...style }}
    >
      {children}
    </h2>
  )
}

export function H3({ children, className = '', style }: TextProps) {
  return (
    <h3
      className={className}
      style={{ fontSize: 14, fontWeight: 600, color: '#f0f2f5', margin: 0, ...style }}
    >
      {children}
    </h3>
  )
}

export function H4({ children, className = '', style }: TextProps) {
  return (
    <h4
      className={className}
      style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', margin: 0, ...style }}
    >
      {children}
    </h4>
  )
}

// ── Heading grande para landing/hero ────────────────────────────────────
export function DisplayHeading({ children, className = '', style }: TextProps) {
  return (
    <h1
      className={className}
      style={{ fontSize: 40, fontWeight: 700, color: '#f0f2f5', lineHeight: 1.15, letterSpacing: '-0.5px', margin: 0, ...style }}
    >
      {children}
    </h1>
  )
}

// ── Etiqueta de sección (uppercase, pequeña) ────────────────────────────
export function SectionLabel({ children, className = '', style }: TextProps) {
  return (
    <p
      className={className}
      style={{ fontSize: 10, fontWeight: 700, color: '#1D9E75', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, ...style }}
    >
      {children}
    </p>
  )
}

// ── Texto ────────────────────────────────────────────────────────────────

export function Text({ children, className = '', style }: TextProps) {
  return (
    <p
      className={className}
      style={{ fontSize: 14, color: '#c8cdd6', lineHeight: 1.6, margin: 0, ...style }}
    >
      {children}
    </p>
  )
}

export function TextMuted({ children, className = '', style }: TextProps) {
  return (
    <p
      className={className}
      style={{ fontSize: 13, color: '#6b7280', margin: 0, ...style }}
    >
      {children}
    </p>
  )
}

export function TextSmall({ children, className = '', style }: TextProps) {
  return (
    <p
      className={className}
      style={{ fontSize: 11, color: '#6b7280', margin: 0, ...style }}
    >
      {children}
    </p>
  )
}