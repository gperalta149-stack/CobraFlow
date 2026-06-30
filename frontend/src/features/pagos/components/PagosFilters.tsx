// frontend/src/features/pagos/components/PagosFilters.tsx
import { IconAdjustmentsHorizontal } from '@tabler/icons-react'
import { SearchInput } from '../../../components/ui/SearchInput'
import '../../../styles/filter.css'

type FiltroPeriodo = 'todos' | 'hoy' | '7dias' | 'mes'
type FiltroMoneda  = 'todos' | 'ARS' | 'USD'
type FiltroMetodo  = 'todos' | 'efectivo' | 'transferencia' | 'tarjeta_credito' | 'tarjeta_debito' | 'cheque' | 'mercado_pago' | 'otro'

const PERIODOS: { value: FiltroPeriodo; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'hoy',   label: 'Hoy' },
  { value: '7dias', label: '7 días' },
  { value: 'mes',   label: 'Este mes' },
]

const MONEDAS: { value: FiltroMoneda; label: string; flag: string }[] = [
  { value: 'todos', label: 'Todas', flag: '' },
  { value: 'ARS',   label: 'ARS', flag: '🇦🇷' },
  { value: 'USD',   label: 'USD', flag: '🇺🇸' },
]

const METODOS_CONFIG: { value: FiltroMetodo; label: string; emoji: string }[] = [
  { value: 'efectivo',        label: 'Efectivo',      emoji: '💵' },
  { value: 'transferencia',   label: 'Transferencia', emoji: '🏦' },
  { value: 'tarjeta_credito', label: 'T. Crédito',    emoji: '💳' },
  { value: 'tarjeta_debito',  label: 'T. Débito',     emoji: '💳' },
  { value: 'cheque',          label: 'Cheque',        emoji: '📄' },
  { value: 'mercado_pago',    label: 'Mercado Pago',  emoji: '💙' },
  { value: 'otro',            label: 'Otro',          emoji: '📦' },
]


interface PagosFiltersProps {
  buscarCliente: string
  filtroPeriodo: FiltroPeriodo
  filtroMoneda: FiltroMoneda
  filtroMetodo: FiltroMetodo
  metodosDisponibles: FiltroMetodo[]
  onBuscar: (value: string) => void
  onPeriodo: (v: FiltroPeriodo) => void
  onMoneda: (v: FiltroMoneda) => void
  onMetodo: (v: FiltroMetodo) => void
}

const pillStyle = (active: boolean): React.CSSProperties => ({
  display: 'inline-flex', 
  alignItems: 'center', 
  gap: 5,
  height: 30, 
  padding: '0 12px',
  backgroundColor: active ? 'rgba(29,158,117,0.15)' : 'transparent',
  border: active ? '0.5px solid rgba(29,158,117,0.55)' : '0.5px solid transparent',
  borderRadius: 18,
  fontSize: 12, 
  fontWeight: active ? 600 : 500,
  color: active ? '#1D9E75' : '#94a3b8',
  cursor: 'pointer', 
  whiteSpace: 'nowrap',
  transition: 'all 0.12s',
})

export function PagosFilters({
  buscarCliente,
  filtroPeriodo,
  filtroMoneda,
  filtroMetodo,
  metodosDisponibles,
  onBuscar,
  onPeriodo,
  onMoneda,
  onMetodo,
}: PagosFiltersProps) {
  return (
    <div className="filter-panel">
      <div className="filter-icon">
        <IconAdjustmentsHorizontal size={16} />
      </div>

      {/* Período */}
      <div className="filter-group">
        <span className="filter-group-label">Período</span>
        <div className="filter-pills-group">
          {PERIODOS.map(p => (
            <button
              key={p.value}
              onClick={() => onPeriodo(p.value)}
              style={pillStyle(filtroPeriodo === p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-divider" />

      {/* Moneda */}
      <div className="filter-group">
        <span className="filter-group-label">Moneda</span>
        <div className="filter-pills-group">
          {MONEDAS.map(m => (
            <button
              key={m.value}
              onClick={() => onMoneda(m.value)}
              style={pillStyle(filtroMoneda === m.value)}
            >
              {m.flag} {m.label}
            </button>
          ))}
        </div>
      </div>

      {metodosDisponibles.length > 0 && (
        <>
          <div className="filter-divider" />
          <div className="filter-group">
            <span className="filter-group-label">Método</span>
            <div className="filter-pills-group">
              <button
                onClick={() => onMetodo('todos')}
                style={pillStyle(filtroMetodo === 'todos')}
              >
                Todos
              </button>
              {metodosDisponibles.map(m => {
                const cfg = METODOS_CONFIG.find(mc => mc.value === m)!
                return (
                  <button
                    key={m}
                    onClick={() => onMetodo(m)}
                    style={pillStyle(filtroMetodo === m)}
                  >
                    {cfg.emoji} {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Buscador simple */}
      <div className="filter-search">
        <SearchInput
          value={buscarCliente}
          onChange={onBuscar}
          placeholder="Buscar por cliente o pago..."
        />
      </div>
    </div>
  )
}