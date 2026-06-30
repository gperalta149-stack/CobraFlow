// frontend/src/features/deudas/components/DeudaFilters.tsx
import { FilterDate, FilterAmount } from '../../../components/shared/filters'
import '../../../styles/filter.css'

interface DeudaFiltersProps {
  filtroDesde: string
  setFiltroDesde: (value: string) => void
  filtroHasta: string
  setFiltroHasta: (value: string) => void
  filtroMontoMin: string
  setFiltroMontoMin: (value: string) => void
  filtroMontoMax: string
  setFiltroMontoMax: (value: string) => void
  filtroMonedaMonto: 'ARS' | 'USD'
  setFiltroMonedaMonto: (value: 'ARS' | 'USD') => void
  onLimpiar: () => void
  disabled?: boolean
}

export function DeudaFilters({
  filtroDesde, setFiltroDesde,
  filtroHasta, setFiltroHasta,
  filtroMontoMin, setFiltroMontoMin,
  filtroMontoMax, setFiltroMontoMax,
  filtroMonedaMonto, setFiltroMonedaMonto,
  onLimpiar,
  disabled,
}: DeudaFiltersProps) {
  const activeCount = [
    filtroDesde !== '' || filtroHasta !== '',
    filtroMontoMin !== '' || filtroMontoMax !== '',
  ].filter(Boolean).length

  return (
    <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <FilterDate
        desde={filtroDesde}
        hasta={filtroHasta}
        onApply={(d, h) => { setFiltroDesde(d); setFiltroHasta(h) }}
        onClear={() => { setFiltroDesde(''); setFiltroHasta('') }}
        disabled={disabled}
      />

      <FilterAmount
        min={filtroMontoMin}
        max={filtroMontoMax}
        moneda={filtroMonedaMonto}
        onApply={(mn, mx, mon) => {
          setFiltroMontoMin(mn)
          setFiltroMontoMax(mx)
          setFiltroMonedaMonto(mon)
        }}
        onClear={() => {
          setFiltroMontoMin('')
          setFiltroMontoMax('')
          setFiltroMonedaMonto('ARS')
        }}
        disabled={disabled}
      />

      {activeCount > 0 && (
        <button
          onClick={onLimpiar}
          disabled={disabled}
          className="filter-clear-btn"
        >
          ✕ Limpiar
        </button>
      )}
    </div>
  )
}