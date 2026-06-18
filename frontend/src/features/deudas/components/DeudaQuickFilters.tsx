// frontend/src/features/deudas/components/DeudaQuickFilters.tsx
import '../../../styles/filter.css'

interface DeudaQuickFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  counts: {
    todos: number
    activas: number
    vencidas: number
    parciales: number
  }
}

const filters = [
  { id: 'todos',     label: 'Todos' },
  { id: 'activas',   label: 'Activas' },
  { id: 'vencidas',  label: 'Vencidas' },
  { id: 'parciales', label: 'Parciales' },
]

export function DeudaQuickFilters({ activeFilter, onFilterChange, counts }: DeudaQuickFiltersProps) {
  return (
    <div className="filter-bar" style={{ marginBottom: 16 }}>
      {filters.map(f => (
        <button
          key={f.id}
          onClick={() => onFilterChange(f.id)}
          className={`pagos-pill${activeFilter === f.id ? ' is-active' : ''}`}
        >
          {f.label}
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 18,
            height: 16,
            padding: '0 4px',
            borderRadius: 8,
            fontSize: 10,
            fontWeight: 700,
            backgroundColor: activeFilter === f.id ? 'rgba(255,255,255,0.2)' : 'var(--bg-hover)',
            color: activeFilter === f.id ? 'inherit' : 'var(--text-muted)',
            marginLeft: 2,
          }}>
            {counts[f.id as keyof typeof counts]}
          </span>
        </button>
      ))}
    </div>
  )
}