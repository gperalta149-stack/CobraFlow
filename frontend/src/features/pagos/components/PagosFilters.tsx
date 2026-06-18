import { useMemo } from 'react'
import { FilterSearch } from '../../../components/shared/filters/FilterSearch'
import type { Cliente } from '../../clientes/types'

type FiltroPeriodo = 'todos' | 'hoy' | '7dias' | 'mes'
type FiltroMoneda  = 'todos' | 'ARS' | 'USD'
type FiltroMetodo  = 'todos' | 'efectivo' | 'transferencia' | 'tarjeta_credito' | 'tarjeta_debito' | 'cheque' | 'mercado_pago' | 'otro'

const PERIODOS: { value: FiltroPeriodo; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'hoy',   label: 'Hoy' },
  { value: '7dias', label: '7 días' },
  { value: 'mes',   label: 'Este mes' },
]

const MONEDAS: { value: FiltroMoneda; label: string }[] = [
  { value: 'todos', label: 'Todas' },
  { value: 'ARS',   label: 'ARS' },
  { value: 'USD',   label: 'USD' },
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
  clientes: Cliente[]
  buscarCliente: string
  clienteSelected: string
  filtroPeriodo: FiltroPeriodo
  filtroMoneda: FiltroMoneda
  filtroMetodo: FiltroMetodo
  metodosDisponibles: FiltroMetodo[]
  totalResultados: number
  onBuscar: (value: string) => void
  onSelectCliente: (id: string, label: string) => void
  onLimpiarCliente: () => void
  onPeriodo: (v: FiltroPeriodo) => void
  onMoneda: (v: FiltroMoneda) => void
  onMetodo: (v: FiltroMetodo) => void
  onLimpiarTodo: () => void
}

export function PagosFilters({
  clientes, buscarCliente, clienteSelected,
  filtroPeriodo, filtroMoneda, filtroMetodo,
  metodosDisponibles, totalResultados,
  onBuscar, onSelectCliente, onLimpiarCliente,
  onPeriodo, onMoneda, onMetodo, onLimpiarTodo,
}: PagosFiltersProps) {

  const suggestions = useMemo(() => {
    if (!buscarCliente.trim()) return []
    const q = buscarCliente.toLowerCase()
    return clientes
      .filter(c =>
        `${c.nombre} ${c.apellido}`.toLowerCase().includes(q) ||
        c.dni?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.empresa?.toLowerCase().includes(q)
      )
      .slice(0, 6)
      .map(c => ({
        id: c.id,
        label: `${c.apellido}, ${c.nombre}`,
        sublabel: [c.dni, c.empresa].filter(Boolean).join(' · '),
        initial: c.nombre?.[0]?.toUpperCase() ?? '?',
      }))
  }, [buscarCliente, clientes])

  const activeCount = [
    !!clienteSelected,
    filtroPeriodo !== 'todos',
    filtroMoneda !== 'todos',
    filtroMetodo !== 'todos',
  ].filter(Boolean).length

  const metodosActivos = metodosDisponibles.filter(m =>
    METODOS_CONFIG.some(mc => mc.value === m)
  )

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '0.5px solid var(--border-dark)',
      borderRadius: 12,
      padding: '16px 20px',
      marginBottom: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>

      {/* Buscador */}
      <FilterSearch
        value={buscarCliente}
        placeholder="Buscar cliente por nombre, DNI, email o empresa..."
        suggestions={suggestions}
        onSearch={onBuscar}
        onSelect={onSelectCliente}
        onClear={onLimpiarCliente}
        selectedId={clienteSelected}
      />

      {/* Separador */}
      <div style={{ height: '0.5px', background: 'var(--border-dark)' }} />

      {/* Grupos de filtros en fila */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>

        {/* Período */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10, fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            minWidth: 52, flexShrink: 0,
          }}>
            Período
          </span>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {PERIODOS.map(p => (
              <button
                key={p.value}
                onClick={() => onPeriodo(p.value)}
                className={`filter-pill${filtroPeriodo === p.value ? ' is-active' : ''}`}
                style={{ height: 30, fontSize: 12 }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divisor vertical */}
        <div style={{ width: '0.5px', height: 30, background: 'var(--border-dark)', alignSelf: 'center' }} />

        {/* Moneda */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10, fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            minWidth: 52, flexShrink: 0,
          }}>
            Moneda
          </span>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {MONEDAS.map(m => (
              <button
                key={m.value}
                onClick={() => onMoneda(m.value)}
                className={`filter-pill${filtroMoneda === m.value ? ' is-active' : ''}`}
                style={{ height: 30, fontSize: 12 }}
              >
                {m.value === 'ARS' ? '🇦🇷 ' : m.value === 'USD' ? '🇺🇸 ' : ''}{m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Método — solo si hay métodos disponibles */}
        {metodosActivos.length > 0 && (
          <>
            <div style={{ width: '0.5px', height: 30, background: 'var(--border-dark)', alignSelf: 'center' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                minWidth: 52, flexShrink: 0,
              }}>
                Método
              </span>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <button
                  onClick={() => onMetodo('todos')}
                  className={`filter-pill${filtroMetodo === 'todos' ? ' is-active' : ''}`}
                  style={{ height: 30, fontSize: 12 }}
                >
                  Todos
                </button>
                {metodosActivos.map(m => {
                  const cfg = METODOS_CONFIG.find(mc => mc.value === m)!
                  return (
                    <button
                      key={m}
                      onClick={() => onMetodo(m)}
                      className={`filter-pill${filtroMetodo === m ? ' is-active' : ''}`}
                      style={{ height: 30, fontSize: 12 }}
                    >
                      {cfg.emoji} {cfg.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer: resultados + limpiar todo */}
      {activeCount > 0 && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 12, borderTop: '0.5px solid var(--border-dark)',
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
              {totalResultados}
            </strong>
            {' '}resultado{totalResultados !== 1 ? 's' : ''}
          </span>
          <button className="filter-clear-all" onClick={onLimpiarTodo}>
            <span>✕</span> Limpiar filtros
            <span className="filter-badge">{activeCount}</span>
          </button>
        </div>
      )}
    </div>
  )
}