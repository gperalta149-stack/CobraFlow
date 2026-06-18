import type { ReactNode } from 'react'

interface EquivalenciaProps {
  visible: boolean | string | null | undefined
  children: ReactNode
  className?: string
}

export function Equivalencia({ visible, children, className = '' }: EquivalenciaProps) {
  const isVisible = Boolean(visible)

  return (
    <div
      className={className}
      style={{
        minHeight: 20,
        visibility: isVisible ? 'visible' : 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {children || ' '}
    </div>
  )
}