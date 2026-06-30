// frontend/src/features/deudas/components/DeudaQuickFilters.tsx
import '../../../styles/filter.css'

interface DeudaQuickFiltersProps {
  filtroEstados: string[]
  setFiltroEstados: (estados: string[]) => void
  counts: {
    todos: number
    activas: number
    vencidas: number
    parciales: number
    pagadas: number
  }
}

const SHORTCUTS = [
  { id: 'todos',     label: 'Todas',       estados: [] as string[] },
  { id: 'activas',   label: 'Por cobrar',  estados: ['pendiente', 'parcial'] },
  { id: 'vencidas',  label: 'Vencidas',    estados: ['vencida'] },
  { id: 'pagadas',   label: 'Pagadas',     estados: ['pagada'] },
]

function isActive(shortcutEstados: string[], filtroEstados: string[]): boolean {
  if (shortcutEstados.length === 0) return filtroEstados.length === 0
  if (shortcutEstados.length !== filtroEstados.length) return false
  return shortcutEstados.every(e => filtroEstados.includes(e))
}

export function DeudaQuickFilters({ filtroEstados, setFiltroEstados, counts }: DeudaQuickFiltersProps) {
  return (
    <div className="filter-group" style={{ display: 'flex', gap: 4 }}>
      {SHORTCUTS.map(s => {
        const active = isActive(s.estados, filtroEstados)
        const count =
          s.id === 'activas' ? counts.activas :
          s.id === 'vencidas' ? counts.vencidas :
          s.id === 'pagadas' ? counts.pagadas :
          counts.todos
        return (
          <button
            key={s.id}
            onClick={() => setFiltroEstados(s.estados)}
            className={`filter-pill-panel${active ? ' is-active' : ''}`}
          >
            {s.label}
            <span className="pill-badge">{count}</span>
          </button>
        )
      })}
    </div>
  )
}