// frontend/src/components/shared/filters/FilterGroup.tsx
import type { ReactNode } from 'react'  // ← usar import type
import '../../../styles/filter.css'

interface FilterGroupProps {
  label: string
  children: ReactNode
  className?: string
}

export function FilterGroup({ label, children, className = '' }: FilterGroupProps) {
  return (
    <div className={`filter-group ${className}`}>
      <span className="filter-group-label">{label}</span>
      {children}
    </div>
  )
}