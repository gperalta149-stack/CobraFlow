// frontend/src/components/shared/filters/FilterDate.tsx
import { IconCalendar, IconX, IconChevronDown } from '@tabler/icons-react'
import { useState, useRef, useEffect } from 'react'

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

// Presets rápidos — mucho más profesional que solo dos inputs de fecha vacíos
function getPresetRange(days: number): { desde: string; hasta: string } {
  const hoy = new Date()
  const futuro = new Date()
  futuro.setDate(hoy.getDate() + days)
  return {
    desde: hoy.toISOString().split('T')[0],
    hasta: futuro.toISOString().split('T')[0],
  }
}

function getPresetPasado(days: number): { desde: string; hasta: string } {
  const hoy = new Date()
  const pasado = new Date()
  pasado.setDate(hoy.getDate() - days)
  return {
    desde: pasado.toISOString().split('T')[0],
    hasta: hoy.toISOString().split('T')[0],
  }
}

const PRESETS = [
  { label: 'Vence en 7 días',  getRange: () => getPresetRange(7) },
  { label: 'Vence en 30 días', getRange: () => getPresetRange(30) },
  { label: 'Venció esta semana', getRange: () => getPresetPasado(7) },
  { label: 'Venció este mes', getRange: () => getPresetPasado(30) },
]

export function FilterDate({ desde, hasta, onApply, onClear, disabled }: FilterDateProps) {
  const [open, setOpen] = useState(false)
  const [tempDesde, setTempDesde] = useState(desde)
  const [tempHasta, setTempHasta] = useState(hasta)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

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

  const applyPreset = (range: { desde: string; hasta: string }) => {
    setTempDesde(range.desde)
    setTempHasta(range.hasta)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={disabled ? undefined : handleOpen}
        disabled={disabled}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 34, padding: isActive ? '0 32px 0 12px' : '0 12px',
          backgroundColor: isActive ? 'rgba(29,158,117,0.15)' : '#242938',
          border: isActive ? '0.5px solid rgba(29,158,117,0.55)' : '0.5px solid #2e3347',
          borderRadius: 20,
          fontSize: 12, fontWeight: isActive ? 600 : 500,
          color: isActive ? '#1D9E75' : '#94a3b8',
          cursor: disabled ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        <IconCalendar size={13} style={{ opacity: isActive ? 1 : 0.65 }} />
        <span>{buildLabel(desde, hasta)}</span>
        {!isActive && <IconChevronDown size={12} style={{ opacity: 0.5 }} />}
      </button>

      {isActive && (
        <button
          onClick={handleClear}
          disabled={disabled}
          style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            width: 16, height: 16, borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#1D9E75',
          }}
        >
          <IconX size={9} />
        </button>
      )}

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          />
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            zIndex: 100,
            backgroundColor: '#242938',
            border: '0.5px solid #2e3347',
            borderRadius: 14,
            padding: 16,
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            minWidth: 340,
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              paddingBottom: 12, marginBottom: 14,
              borderBottom: '0.5px solid #2e3347',
            }}>
              <IconCalendar size={14} color="#1D9E75" />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#f0f2f5' }}>
                Filtrar por vencimiento
              </span>
            </div>

            {/* Presets rápidos */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Accesos rápidos
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {PRESETS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p.getRange())}
                    style={{
                      padding: '7px 10px',
                      fontSize: 11.5, fontWeight: 500,
                      color: '#94a3b8',
                      background: '#1a1d2e',
                      border: '0.5px solid #2e3347',
                      borderRadius: 8,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#2a3045'; e.currentTarget.style.color = '#f0f2f5' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#1a1d2e'; e.currentTarget.style.color = '#94a3b8' }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rango personalizado */}
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Rango personalizado
              </p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 5 }}>
                    Desde
                  </label>
                  <input
                    type="date"
                    value={tempDesde}
                    max={tempHasta || undefined}
                    onChange={e => setTempDesde(e.target.value)}
                    style={{
                      width: '100%', backgroundColor: '#1a1d2e',
                      border: '0.5px solid #2e3347', borderRadius: 8,
                      padding: '8px 10px', fontSize: 12.5, color: '#f0f2f5',
                      outline: 'none', colorScheme: 'dark',
                    }}
                  />
                </div>
                <span style={{ fontSize: 13, color: '#4a5568', paddingBottom: 9 }}>→</span>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 5 }}>
                    Hasta
                  </label>
                  <input
                    type="date"
                    value={tempHasta}
                    min={tempDesde || undefined}
                    onChange={e => setTempHasta(e.target.value)}
                    style={{
                      width: '100%', backgroundColor: '#1a1d2e',
                      border: '0.5px solid #2e3347', borderRadius: 8,
                      padding: '8px 10px', fontSize: 12.5, color: '#f0f2f5',
                      outline: 'none', colorScheme: 'dark',
                    }}
                  />
                </div>
              </div>
              {(tempDesde || tempHasta) && (
                <p style={{ fontSize: 11, color: '#1D9E75', marginTop: 8 }}>
                  {tempDesde && tempHasta
                    ? `${formatDate(tempDesde)} → ${formatDate(tempHasta)}`
                    : tempDesde ? `Desde ${formatDate(tempDesde)}` : `Hasta ${formatDate(tempHasta)}`}
                </p>
              )}
            </div>

            {/* Acciones */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 12, borderTop: '0.5px solid #2e3347' }}>
              <button
                onClick={() => handleClear()}
                style={{
                  padding: '6px 14px', fontSize: 12, fontWeight: 500,
                  color: '#6b7280', background: 'transparent',
                  border: '0.5px solid #2e3347', borderRadius: 7, cursor: 'pointer',
                }}
              >
                Limpiar
              </button>
              <button
                onClick={handleApply}
                style={{
                  padding: '6px 16px', fontSize: 12, fontWeight: 600,
                  color: '#fff', background: '#1D9E75',
                  border: 'none', borderRadius: 7, cursor: 'pointer',
                }}
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