// frontend/src/components/shared/filters/FilterSearch.tsx
import { useState, useRef, useEffect, useMemo } from 'react'
import { IconSearch, IconX } from '@tabler/icons-react'
import '../../../styles/search.css'

export interface Suggestion {
  id: string
  label: string
  sublabel?: string
  avatar?: string
}

interface FilterSearchProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (id: string, label: string) => void
  onClear?: () => void
  placeholder?: string
  suggestions?: Suggestion[]
  disabled?: boolean
  className?: string
  showClear?: boolean
}

export function FilterSearch({
  value,
  onChange,
  onSelect,
  onClear,
  placeholder = 'Buscar...',
  suggestions = [],
  disabled = false,
  className = '',
  showClear = true,
}: FilterSearchProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Filtrar sugerencias basado en el valor
  const filteredSuggestions = useMemo(() => {
    if (!value.trim() || !suggestions.length) return []
    const q = value.toLowerCase()
    return suggestions
      .filter(s => 
        s.label.toLowerCase().includes(q) ||
        s.sublabel?.toLowerCase().includes(q)
      )
      .slice(0, 6)
  }, [value, suggestions])

  const handleClear = () => {
    onChange('')
    onClear?.()
    setShowSuggestions(false)
  }

  const handleSelect = (suggestion: Suggestion) => {
    if (onSelect) {
      onSelect(suggestion.id, suggestion.label)
    }
    onChange(suggestion.label)
    setShowSuggestions(false)
  }

  return (
    <div ref={wrapperRef} className={`search-wrapper ${className}`}>
      <IconSearch size={14} className="search-icon" />
      
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setShowSuggestions(true)
        }}
        onFocus={() => setShowSuggestions(true)}
        disabled={disabled}
        className="search-input"
      />
      
      {showClear && value && (
        <button onClick={handleClear} className="search-clear">
          <IconX size={14} />
        </button>
      )}

      {showSuggestions && value && filteredSuggestions.length > 0 && (
        <div className="search-dropdown">
          {filteredSuggestions.map((s) => (
            <button
              key={s.id}
              onMouseDown={() => handleSelect(s)}
              className="search-option"
            >
              {s.avatar && (
                <div className="search-avatar">{s.avatar}</div>
              )}
              <div>
                <p className="search-option-name">{s.label}</p>
                {s.sublabel && (
                  <p className="search-option-sub">{s.sublabel}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}