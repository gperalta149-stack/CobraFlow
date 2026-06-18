// frontend/src/components/shared/filters/FilterAmount.tsx
import { IconCurrencyDollar, IconChevronDown, IconX } from '@tabler/icons-react'
import { useState, useRef, useEffect } from 'react'

type Moneda = 'ARS' | 'USD'

interface FilterAmountProps {
  min: string
  max: string
  moneda?: Moneda
  onApply: (min: string, max: string, moneda: Moneda) => void
  onClear: () => void
  disabled?: boolean
}

function formatMonto(val: string, moneda: Moneda): string {
  if (!val) return ''
  const n = Number(val)
  if (moneda === 'USD') {
    if (n >= 1000) return `USD ${(n / 1000).toFixed(0)}k`
    return `USD ${n}`
  }
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000)    return `$${(n / 1000).toFixed(0)}k`
  return `$${n}`
}

function buildLabel(min: string, max: string, moneda: Moneda): string {
  if (!min && !max) return 'Monto'
  if (min && max)   return `${formatMonto(min, moneda)} – ${formatMonto(max, moneda)}`
  if (min)          return `Mín. ${formatMonto(min, moneda)}`
  return `Máx. ${formatMonto(max, moneda)}`
}

export function FilterAmount({ min, max, moneda = 'ARS', onApply, onClear, disabled }: FilterAmountProps) {
  const [open, setOpen] = useState(false)
  const [tempMin, setTempMin] = useState(min)
  const [tempMax, setTempMax] = useState(max)
  const [tempMoneda, setTempMoneda] = useState<Moneda>(moneda)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = min !== '' || max !== ''

  const handleOpen = () => {
    setTempMin(min)
    setTempMax(max)
    setTempMoneda(moneda)
    setOpen(true)
  }

  const handleApply = () => {
    onApply(tempMin, tempMax, tempMoneda)
    setOpen(false)
  }

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    onClear()
    setTempMin('')
    setTempMax('')
    setTempMoneda('ARS')
    setOpen(false)
  }

  const prefix = tempMoneda === 'USD' ? 'USD' : '$'

  return (
    <div className="filter-pill-group" ref={wrapperRef}>
      {/* Pill */}
      <button
        className={`filter-pill ${isActive ? 'is-active' : ''}`}
        onClick={disabled ? undefined : handleOpen}
        disabled={disabled}
        style={{ paddingRight: isActive ? 32 : 12 }}
      >
        <IconCurrencyDollar size={13} />
        <span>{buildLabel(min, max, moneda)}</span>
        {!isActive && <IconChevronDown size={12} style={{ opacity: 0.5 }} />}
      </button>

      {isActive && (
        <button className="pill-close pill-close-abs" onClick={handleClear} disabled={disabled}>
          <IconX size={9} />
        </button>
      )}

      {/* Popover */}
      {open && (
        <>
          <div className="filter-overlay" onClick={() => setOpen(false)} />
          <div className="filter-popover filter-popover--amount">
            {/* Header */}
            <div className="filter-popover-header">
              <IconCurrencyDollar size={13} />
              Rango de monto
            </div>

            {/* Selector de moneda */}
            <div style={{ display: 'flex', gap: 6 }}>
              {(['ARS', 'USD'] as Moneda[]).map(m => (
                <button
                  key={m}
                  onClick={() => { setTempMoneda(m); setTempMin(''); setTempMax('') }}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-out',
                    border: tempMoneda === m
                      ? '0.5px solid var(--status-pagada)'
                      : '0.5px solid var(--border-dark)',
                    background: tempMoneda === m
                      ? 'rgba(29,158,117,0.15)'
                      : 'var(--bg-secondary)',
                    color: tempMoneda === m
                      ? 'var(--status-pagada)'
                      : 'var(--text-muted)',
                  }}
                >
                  {m === 'ARS' ? '🇦🇷 ARS' : '🇺🇸 USD'}
                </button>
              ))}
            </div>

            {/* Inputs min / max */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <span style={{
                  position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                }}>
                  {prefix}
                </span>
                <input
                  type="number"
                  min="0"
                  placeholder="Mínimo"
                  value={tempMin}
                  onChange={e => setTempMin(e.target.value)}
                  className="filter-popover-input"
                  style={{ paddingLeft: tempMoneda === 'USD' ? 36 : 22 }}
                />
              </div>

              <span className="filter-amount-separator">—</span>

              <div style={{ position: 'relative', flex: 1 }}>
                <span style={{
                  position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                }}>
                  {prefix}
                </span>
                <input
                  type="number"
                  min="0"
                  placeholder="Máximo"
                  value={tempMax}
                  onChange={e => setTempMax(e.target.value)}
                  className="filter-popover-input"
                  style={{ paddingLeft: tempMoneda === 'USD' ? 36 : 22 }}
                />
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