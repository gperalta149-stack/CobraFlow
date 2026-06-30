// frontend/src/features/analisis/components/PeriodoSelector.tsx
// Usar las clases CSS en lugar de estilos inline

import { 
  IconCalendar, 
  IconChevronDown, 
  IconClock,
  IconCalendarTime,
  IconCalendarStats,
  IconCalendarEvent,
  IconCalendarMonth
} from '@tabler/icons-react'

export type Periodo = 'semana' | 'mes' | 'trimestre' | 'semestre' | 'año'

const PERIODOS: { id: Periodo; label: string; icon: React.ReactNode }[] = [
  { id: 'semana', label: 'Semana', icon: <IconClock size={14} /> },
  { id: 'mes', label: 'Mes', icon: <IconCalendarMonth size={14} /> },
  { id: 'trimestre', label: 'Trimestre', icon: <IconCalendarTime size={14} /> },
  { id: 'semestre', label: 'Semestre', icon: <IconCalendarStats size={14} /> },
  { id: 'año', label: 'Año', icon: <IconCalendarEvent size={14} /> },
]

const getAvailableYears = () => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 6 }, (_, i) => currentYear - i)
}

interface PeriodoSelectorProps {
  periodo: Periodo
  onChange: (periodo: Periodo) => void
  year?: number
  onYearChange?: (year: number) => void
}

export function PeriodoSelector({ 
  periodo, 
  onChange, 
  year, 
  onYearChange 
}: PeriodoSelectorProps) {
  const years = getAvailableYears()
  const currentYear = new Date().getFullYear()
  const selectedYear = year || currentYear

  return (
    <div className="periodo-selector">
      {/* Label con icono */}
      <div className="label-group">
        <div className="icon-wrap">
          <IconCalendar size={16} />
        </div>
        <span className="label-text">Período</span>
      </div>

      {/* Botones de período */}
      <div className="buttons-group">
        {PERIODOS.map((p) => {
          const isActive = periodo === p.id
          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              className={`btn-periodo ${isActive ? 'is-active' : ''}`}
            >
              <span className="icon">{p.icon}</span>
              <span>{p.label}</span>
            </button>
          )
        })}
      </div>

      {/* Selector de año */}
      {onYearChange && (
        <div className="year-group">
          <span className="year-label">Año</span>
          <div className="select-wrapper">
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <IconChevronDown size={12} className="select-chevron" />
          </div>
        </div>
      )}
    </div>
  )
}