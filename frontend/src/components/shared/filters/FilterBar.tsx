// frontend/src/components/shared/filters/FilterBar.tsx
import { IconAdjustmentsHorizontal, IconX } from '@tabler/icons-react'
import type { ReactNode } from 'react'

interface FilterBarProps {
  children: ReactNode
  activeCount: number
  summary?: string        // texto de resumen generado por el padre
  onClearAll: () => void
  disabled?: boolean
}

export function FilterBar({ children, activeCount, summary, onClearAll, disabled }: FilterBarProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div className="filter-bar">
        <IconAdjustmentsHorizontal
          size={16}
          style={{ color: 'var(--text-muted)', opacity: 0.6, flexShrink: 0 }}
        />

        {children}

        {activeCount > 0 && (
          <>
            <div className="filter-bar-divider" />
            <button
              className="filter-clear-all"
              onClick={onClearAll}
              disabled={disabled}
            >
              <IconX size={12} />
              Limpiar todo
              <span className="filter-badge">{activeCount}</span>
            </button>
          </>
        )}
      </div>

      {/* Resumen de filtros activos */}
      {summary && (
        <div className="filter-summary">
          <span className="filter-summary-dot" />
          <span className="filter-summary-text">{summary}</span>
        </div>
      )}
    </div>
  )
}