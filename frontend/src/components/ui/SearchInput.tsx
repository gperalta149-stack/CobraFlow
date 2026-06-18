// frontend/src/components/ui/SearchInput.tsx
import { IconSearch } from '@tabler/icons-react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function SearchInput({ value, onChange, placeholder = "Buscar...", disabled }: SearchInputProps) {
  return (
    <div className="relative w-full">
      <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="dark-input"
      />
    </div>
  )
}