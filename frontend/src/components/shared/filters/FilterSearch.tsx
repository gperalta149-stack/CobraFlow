import { useRef, useState, useEffect } from 'react'
import { IconSearch, IconX } from '@tabler/icons-react'

interface Suggestion {
  id: string
  label: string      // nombre principal
  sublabel?: string  // DNI, empresa, etc.
  initial: string    // letra para el avatar
}

interface FilterSearchProps {
  value: string
  placeholder?: string
  suggestions: Suggestion[]
  onSearch: (value: string) => void
  onSelect: (id: string, label: string) => void
  onClear: () => void
  selectedId?: string
}

export function FilterSearch({
  value, placeholder = 'Buscar...', suggestions,
  onSearch, onSelect, onClear, selectedId,
}: FilterSearchProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <IconSearch size={14} style={{
          position: 'absolute', left: 12,
          color: 'var(--text-muted)', pointerEvents: 'none',
        }} />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => { onSearch(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          style={{
            width: '100%',
            padding: '9px 36px',
            background: 'var(--bg-card)',
            border: '0.5px solid var(--border-dark)',
            borderRadius: 10,
            fontSize: 13,
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onFocusCapture={e => {
            e.currentTarget.style.borderColor = 'var(--status-pagada)'
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(29,158,117,0.15)'
          }}
          onBlurCapture={e => {
            e.currentTarget.style.borderColor = 'var(--border-dark)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
        {(value || selectedId) && (
          <button
            onClick={onClear}
            style={{
              position: 'absolute', right: 10,
              background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', padding: 2,
              borderRadius: 4, transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <IconX size={14} />
          </button>
        )}
      </div>

      {open && value && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', zIndex: 200,
          top: 'calc(100% + 4px)', left: 0, right: 0,
          background: 'var(--bg-card)',
          border: '0.5px solid var(--border-dark)',
          borderRadius: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
          overflow: 'hidden',
          animation: 'filter-pop 0.12s ease-out',
        }}>
          {suggestions.map(s => (
            <button
              key={s.id}
              onMouseDown={() => { onSelect(s.id, s.label); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '9px 14px',
                background: 'transparent', border: 'none',
                borderBottom: '0.5px solid var(--border-dark)',
                cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(29,158,117,0.15)',
                color: 'var(--status-pagada)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, flexShrink: 0,
              }}>
                {s.initial}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{s.label}</p>
                {s.sublabel && (
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{s.sublabel}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}