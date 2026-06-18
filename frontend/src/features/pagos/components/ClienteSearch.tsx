// frontend/src/features/pagos/components/ClienteSearch.tsx
import { IconSearch, IconX } from '@tabler/icons-react'
import type { Cliente } from '../../clientes/types'

interface ClienteSearchProps {
  value: string
  selected: string
  sugerencias: Cliente[]
  mostrar: boolean
  onChange: (v: string) => void
  onSelect: (c: Cliente) => void
  onClear: () => void
  onFocus: () => void
  onBlur: () => void
}

export function ClienteSearch({ value, selected, sugerencias, mostrar, onChange, onSelect, onClear, onFocus, onBlur }: ClienteSearchProps) {
  return (
    <div style={{ position: 'relative' }}>
      <div className="pagos-search-wrapper">
        <span className="pagos-search-icon"><IconSearch size={14} /></span>
        <input
          type="text"
          placeholder="Buscar cliente por nombre, DNI, email o empresa..."
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          className="pagos-search-input"
        />
        {(value || selected) && (
          <button className="pagos-search-clear" onClick={onClear}>
            <IconX size={14} />
          </button>
        )}
      </div>
      {mostrar && value && sugerencias.length > 0 && (
        <div className="pagos-search-dropdown">
          {sugerencias.map(c => (
            <button key={c.id} className="pagos-search-option" onMouseDown={() => onSelect(c)}>
              <div className="pagos-search-avatar">{c.nombre?.[0]?.toUpperCase()}</div>
              <div>
                <p className="pagos-search-option-name">{c.apellido}, {c.nombre}</p>
                <p className="pagos-search-option-sub">{c.dni}{c.empresa ? ` · ${c.empresa}` : ''}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}