// frontend/src/features/deudas/components/DeudaFilters.tsx
import { FilterBar, FilterDate, FilterAmount } from '../../../components/shared/filters'
import { FilterStatus } from '../../../components/shared/filters/FilterStatus'
import '../../../styles/filter.css'

interface DeudaFiltersProps {
  filtroEstados: string[]
  setFiltroEstados: (value: string[]) => void
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

const estados = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'parcial',   label: 'Parcial'   },
  { value: 'vencida',   label: 'Vencida'   },
  { value: 'pagada',    label: 'Pagada'    },
]

function formatDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function formatMonto(val: string): string {
  if (!val) return ''
  const n = Number(val)
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000)    return `$${(n / 1000).toFixed(0)}k`
  return `$${n}`
}

function buildSummary(
  estados_sel: string[],
  desde: string,
  hasta: string,
  min: string,
  max: string,
  moneda: 'ARS' | 'USD',
): string {
  const parts: string[] = []

  if (estados_sel.length === 1) {
    const label = estados.find(e => e.value === estados_sel[0])?.label ?? estados_sel[0]
    parts.push(`Estado: ${label}`)
  } else if (estados_sel.length > 1) {
    parts.push(`${estados_sel.length} estados`)
  }

  if (desde && hasta) parts.push(`${formatDate(desde)} → ${formatDate(hasta)}`)
  else if (desde)     parts.push(`Desde ${formatDate(desde)}`)
  else if (hasta)     parts.push(`Hasta ${formatDate(hasta)}`)

  const monedaPrefijo = moneda === 'USD' ? 'USD ' : '$'
  if (min && max)  parts.push(`${monedaPrefijo}${formatMonto(min)} – ${monedaPrefijo}${formatMonto(max)}`)
  else if (min)    parts.push(`${monedaPrefijo} > ${formatMonto(min)}`)
  else if (max)    parts.push(`${monedaPrefijo} < ${formatMonto(max)}`)

  return parts.join(' · ')
}

export function DeudaFilters({
  filtroEstados, setFiltroEstados,
  filtroDesde, setFiltroDesde,
  filtroHasta, setFiltroHasta,
  filtroMontoMin, setFiltroMontoMin,
  filtroMontoMax, setFiltroMontoMax,
  filtroMonedaMonto, setFiltroMonedaMonto,
  onLimpiar,
  disabled,
}: DeudaFiltersProps) {
  const activeCount = [
    filtroEstados.length > 0,
    filtroDesde !== '' || filtroHasta !== '',
    filtroMontoMin !== '' || filtroMontoMax !== '',
  ].filter(Boolean).length

  const summary = activeCount > 0
    ? buildSummary(filtroEstados, filtroDesde, filtroHasta, filtroMontoMin, filtroMontoMax, filtroMonedaMonto)
    : undefined

  return (
    <FilterBar
      activeCount={activeCount}
      summary={summary}
      onClearAll={onLimpiar}
      disabled={disabled}
    >
      <FilterStatus
        values={filtroEstados}
        options={estados}
        onChange={setFiltroEstados}
        onClear={() => setFiltroEstados([])}
        disabled={disabled}
      />

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
    </FilterBar>
  )
}