// frontend/src/components/shared/filters/FilterStatus.tsx - VERSIÓN CORREGIDA
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
      next.length === 0 ? onClear() : onChange(next)
    } else {
      onChange([...values, value])
    }
  }

  return (
    <div className="filter-pill-group" style={{ position: 'relative' }}>
      {/* Botón */}
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
          style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
          }}
        >
          <IconX size={9} />
        </button>
      )}

      {/* Popover - directamente dentro de filter-pill-group que tiene position: relative */}
      {open && (
        <>
          <div 
            className="filter-overlay" 
            onClick={() => setOpen(false)} 
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99,
            }} 
          />
          <div 
            className="filter-popover filter-popover--status"
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              zIndex: 100,
              backgroundColor: 'var(--bg-card)',
              border: '0.5px solid var(--border-dark)',
              borderRadius: 12,
              padding: 8,
              boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
              minWidth: 160,
            }}
          >
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'transparent',
                    fontSize: 13,
                    fontWeight: selected ? 600 : 500,
                    color: selected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'background 0.12s ease-out, color 0.12s ease-out',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <span 
                    className="status-option-dot"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      flexShrink: 0,
                      backgroundColor: o.value === 'pendiente' ? 'var(--status-pendiente)' :
                                      o.value === 'parcial' ? 'var(--status-parcial)' :
                                      o.value === 'vencida' ? 'var(--status-vencida)' :
                                      o.value === 'pagada' ? 'var(--status-pagada)' :
                                      'var(--text-muted)',
                    }}
                  />
                  <span style={{ flex: 1 }}>{o.label}</span>
                  {selected && <IconCheck size={12} style={{ flexShrink: 0 }} />}
                </button>
              )
            })}

            {/* Botón para cerrar */}
            <div style={{ borderTop: '0.5px solid var(--border-dark)', marginTop: 4, paddingTop: 4 }}>
              <button
                className="filter-btn primary"
                style={{
                  width: '100%',
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: 'none',
                  background: 'var(--status-pagada)',
                  color: 'white',
                  transition: 'background 0.15s ease-out',
                }}
                onClick={() => setOpen(false)}
                onMouseEnter={e => { e.currentTarget.style.background = '#17a076' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--status-pagada)' }}
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