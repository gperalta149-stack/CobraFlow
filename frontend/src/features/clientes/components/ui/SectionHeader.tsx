// frontend/src/components/ui/SectionHeader.tsx
import type { ReactNode } from 'react'

interface SectionHeaderProps {
  icon: ReactNode
  title: string
}

export function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2e3347]">
      {icon}
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{title}</h3>
    </div>
  )
}