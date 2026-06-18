// frontend/src/components/shared/filters/FilterDate.tsx
import { IconCalendar, IconX, IconChevronDown } from '@tabler/icons-react'
import { useState } from 'react'

interface FilterDateProps {
  desde: string
  hasta: string
  onApply: (desde: string, hasta: string) => void
  onClear: () => void
  disabled?: boolean
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function buildLabel(desde: string, hasta: string): string {
  if (!desde && !hasta) return 'Vencimiento'
  if (desde && hasta) return `${formatDate(desde)} – ${formatDate(hasta)}`
  if (desde) return `Desde ${formatDate(desde)}`
  return `Hasta ${formatDate(hasta)}`
}

export function FilterDate({ desde, hasta, onApply, onClear, disabled }: FilterDateProps) {
  const [open, setOpen] = useState(false)
  const [tempDesde, setTempDesde] = useState(desde)
  const [tempHasta, setTempHasta] = useState(hasta)

  const isActive = desde !== '' || hasta !== ''

  const handleOpen = () => {
    setTempDesde(desde)
    setTempHasta(hasta)
    setOpen(true)
  }

  const handleApply = () => {
    onApply(tempDesde, tempHasta)
    setOpen(false)
  }

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    onClear()
    setTempDesde('')
    setTempHasta('')
    setOpen(false)
  }

  const pillClass = ['filter-pill', isActive ? 'is-active' : ''].filter(Boolean).join(' ')

  return (
    <div className="filter-pill-group">
      <div style={{ position: 'relative' }}>
        <button
          className={pillClass}
          onClick={disabled ? undefined : handleOpen}
          disabled={disabled}
          style={{ paddingRight: isActive ? 32 : 12 }}
        >
          <IconCalendar size={13} />
          <span>{buildLabel(desde, hasta)}</span>
          {!isActive && <IconChevronDown size={12} style={{ opacity: 0.5 }} />}
        </button>

        {isActive && (
          <button
            className="pill-close pill-close-abs"
            onClick={handleClear}
            disabled={disabled}
          >
            <IconX size={9} />
          </button>
        )}
      </div>

      {open && (
        <>
          <div className="filter-overlay" onClick={() => setOpen(false)} />
          <div className="filter-popover filter-popover--date">

            {/* Encabezado */}
            <div className="filter-popover-header">
              <IconCalendar size={13} />
              Rango de vencimiento
            </div>

            {/* Campos Desde / Hasta en fila */}
            <div className="filter-date-grid">
              <div className="filter-popover-row">
                <label className="filter-popover-label">Desde</label>
                <input
                  type="date"
                  value={tempDesde}
                  max={tempHasta || undefined}
                  onChange={(e) => setTempDesde(e.target.value)}
                  className="filter-popover-input"
                />
                {tempDesde && (
                  <span className="filter-date-preview">{formatDate(tempDesde)}</span>
                )}
              </div>

              <div className="filter-date-arrow">→</div>

              <div className="filter-popover-row">
                <label className="filter-popover-label">Hasta</label>
                <input
                  type="date"
                  value={tempHasta}
                  min={tempDesde || undefined}
                  onChange={(e) => setTempHasta(e.target.value)}
                  className="filter-popover-input"
                />
                {tempHasta && (
                  <span className="filter-date-preview">{formatDate(tempHasta)}</span>
                )}
              </div>
            </div>

            <div className="filter-popover-actions">
              <button className="filter-btn ghost" onClick={() => handleClear()}>Limpiar</button>
              <button className="filter-btn primary" onClick={handleApply}>Aplicar</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}