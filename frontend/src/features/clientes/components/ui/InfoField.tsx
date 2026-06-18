// frontend/src/components/ui/InfoField.tsx
import type { ReactNode } from 'react'

interface InfoFieldProps {
  icon: ReactNode
  label: string
  value: string | number | ReactNode
  children?: ReactNode
}

export function InfoField({ icon, label, value, children }: InfoFieldProps) {
  return (
    <div className="bg-[#1e2334] rounded-xl p-3">
      <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
        {icon} {label}
      </p>
      <p className="text-base text-white font-medium">{value || '-'}</p>
      {children && <div className="mt-1">{children}</div>}
    </div>
  )
}