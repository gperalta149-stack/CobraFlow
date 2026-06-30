// frontend/src/features/dashboard/components/evolution/EvolucionToggle.tsx
import { COLORS } from './constants'

type Modo = 'ars' | 'usd' | 'ambos'

interface EvolucionToggleProps {
  modo: Modo
  setModo: (modo: Modo) => void
}

const BUTTONS: { key: Modo; label: string; color: string }[] = [
  { key: 'ars', label: 'ARS', color: COLORS.ARS },
  { key: 'usd', label: 'USD', color: COLORS.USD },
  { key: 'ambos', label: 'Ambos', color: '#f0f2f5' },
]

export function EvolucionToggle({ modo, setModo }: EvolucionToggleProps) {
  return (
    <div style={{ display: 'flex', gap: 4, background: '#1a1d2e', borderRadius: 8, padding: 3 }}>
      {BUTTONS.map(({ key, label, color }) => (
        <button
          key={key}
          onClick={() => setModo(key)}
          style={{
            padding: '4px 12px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: modo === key ? '#242938' : 'transparent',
            color: modo === key ? color : '#6b7280',
            boxShadow: modo === key ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}