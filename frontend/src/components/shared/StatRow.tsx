// frontend/src/components/shared/StatRow.tsx
interface StatRowProps {
  label: string
  value: string | number
  valueColor?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

const valueColorClasses = {
  default: 'text-white',
  success: 'text-emerald-400',
  warning: 'text-orange-400',
  danger: 'text-red-400',
}

export function StatRow({ label, value, valueColor = 'default', className = '' }: StatRowProps) {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`font-semibold ${valueColorClasses[valueColor]}`}>
        {typeof value === 'number' ? value.toLocaleString('es-AR') : value}
      </span>
    </div>
  )
}