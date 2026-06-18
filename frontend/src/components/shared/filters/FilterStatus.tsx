// frontend/src/components/shared/filters/FilterStatus.tsx
import { IconCircleCheck, IconChevronDown, IconX, IconCheck } from '@tabler/icons-react'
import { useState } from 'react'

interface Option { value: string; label: string }

interface FilterStatusProps {
  values: string[]
  options: Option[]
  onChange: (values: string[]) => void
  onClear: () => void
  disabled?: boolean
}

function buildLabel(values: string[], options: Option[]): string {
  if (values.length === 0) return 'Estado'
  if (values.length === 1) return options.find(o => o.value === values[0])?.label ?? values[0]
  return `${values.length} estados`
}

function dominantClass(values: string[]): string {
  if (values.includes('vencida'))   return 'pill-vencida'
  if (values.includes('pendiente')) return 'pill-pendiente'
  if (values.includes('parcial'))   return 'pill-parcial'
  if (values.includes('pagada'))    return 'pill-pagada'
  return ''
}

export function FilterStatus({ values, options, onChange, onClear, disabled }: FilterStatusProps) {
  const [open, setOpen] = useState(false)

  const isActive   = values.length > 0
  const label      = buildLabel(values, options)
  const activeClass = isActive ? dominantClass(values) : ''

  const pillClass = ['filter-pill', isActive ? 'is-active' : '', activeClass]
    .filter(Boolean).join(' ')

  const toggle = (value: string) => {
    if (values.includes(value)) {
      const next = values.filter(v => v !== value)
      // Si quedan 0 opciones, limpiar — pero NO cerrar el popover
      next.length === 0 ? onClear() : onChange(next)
    } else {
      onChange([...values, value])
    }
    // ← sin setOpen(false): el popover queda abierto para seguir eligiendo
  }

  return (
    <div className="filter-pill-group">
      <div style={{ position: 'relative' }}>
        <button
          className={pillClass}
          onClick={() => !disabled && setOpen(o => !o)}
          disabled={disabled}
          style={{ paddingRight: isActive ? 32 : 12 }}
        >
          <IconCircleCheck size={13} />
          <span>{label}</span>
          {!isActive && <IconChevronDown size={12} style={{ opacity: 0.5 }} />}
        </button>

        {isActive && (
          <button
            className="pill-close pill-close-abs"
            onClick={(e) => { e.stopPropagation(); onClear(); setOpen(false) }}
            disabled={disabled}
          >
            <IconX size={9} />
          </button>
        )}
      </div>

      {open && (
        <>
          <div className="filter-overlay" onClick={() => setOpen(false)} />
          <div className="filter-popover filter-popover--status">
            {options.map(o => {
              const selected = values.includes(o.value)
              return (
                <button
                  key={o.value}
                  className={[
                    'status-option',
                    `status-option--${o.value}`,
                    selected ? 'status-option--active' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => toggle(o.value)}
                >
                  <span className="status-option-dot" />
                  <span style={{ flex: 1 }}>{o.label}</span>
                  {selected && <IconCheck size={12} style={{ flexShrink: 0 }} />}
                </button>
              )
            })}

            {/* Botón para cerrar cuando terminaste de elegir */}
            <div style={{ borderTop: '0.5px solid var(--border-dark)', marginTop: 4, paddingTop: 4 }}>
              <button
                className="filter-btn primary"
                style={{ width: '100%' }}
                onClick={() => setOpen(false)}
              >
                Aplicar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}