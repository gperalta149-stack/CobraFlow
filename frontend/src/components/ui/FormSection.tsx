// frontend/src/components/ui/FormSection.tsx
import type { ReactNode } from 'react'

interface FormSectionProps {
  title: string
  description?: string
  icon?: ReactNode
  children: ReactNode
}

export function FormSection({ title, description, icon, children }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            {icon}
          </div>
        )}
        <div>
          <h4 className="text-sm font-semibold text-white">{title}</h4>
          {description && <p className="text-xs text-gray-400">{description}</p>}
        </div>
      </div>
      <div className="pl-0">{children}</div>
    </div>
  )
}