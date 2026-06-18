// frontend/src/features/clientes/components/ClienteFilters.tsx
import { IconSearch } from '@tabler/icons-react'

interface ClienteFiltersProps {
  buscar: string
  setBuscar: (value: string) => void
  disabled?: boolean
}

export function ClienteFilters({ buscar, setBuscar, disabled }: ClienteFiltersProps) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <IconSearch size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
      <input
        type="text"
        placeholder="Buscar por nombre, DNI o email..."
        value={buscar}
        onChange={(e) => setBuscar(e.target.value)}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '10px 16px 10px 40px',
          backgroundColor: '#242938',
          border: '0.5px solid #2e3347',
          borderRadius: '10px',
          fontSize: '13px',
          color: '#ffffff',
          outline: 'none',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#2a3045'
          e.currentTarget.style.borderColor = '#1D9E75'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#242938'
          e.currentTarget.style.borderColor = '#2e3347'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#1D9E75'
          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(29, 158, 117, 0.2)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#2e3347'
          e.currentTarget.style.boxShadow = 'none'
        }}
      />
    </div>
  )
}