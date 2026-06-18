import { IconX, IconChevronDown } from '@tabler/icons-react'
import type { ReactNode } from 'react'

interface FilterPillProps {
  icon: ReactNode
  label: string
  isActive?: boolean
  activeClass?: string
  onClear?: (e: React.MouseEvent) => void
  onClick?: () => void
  disabled?: boolean
  children?: ReactNode   // para el select invisible
}

export function FilterPill({
  icon, label, isActive, activeClass = '',
  onClear, onClick, disabled, children,
}: FilterPillProps) {
  const pillClass = [
    'filter-pill',
    isActive ? 'is-active' : '',
    isActive && activeClass ? activeClass : '',
  ].filter(Boolean).join(' ')

  return (
    <div style={{ position: 'relative' }}>
      <button
        className={pillClass}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        style={{ paddingRight: isActive ? 32 : 12 }}
      >
        {icon}
        <span>{label}</span>
        {!isActive
          ? <IconChevronDown size={12} style={{ opacity: 0.5 }} />
          : null
        }
        {children}
      </button>

      {isActive && onClear && (
        <button
          className="pill-close pill-close-abs"
          onClick={onClear}
          disabled={disabled}
        >
          <IconX size={9} />
        </button>
      )}
    </div>
  )
}