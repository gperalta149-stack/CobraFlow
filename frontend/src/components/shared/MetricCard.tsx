// frontend/src/components/shared/MetricCard.tsx
import type { ReactNode } from 'react'

interface MetricCardProps {
  label: string
  value: number | string
  subtitle?: string
  icon?: ReactNode
  iconColor?: string
  valueColor?: string
  seccion?: 'dashboard' | 'deudas' | 'pagos' | 'analisis'
}

export function MetricCard({
  label, value, subtitle,
  icon, iconColor = '#60a5fa', valueColor = '#fff',
}: MetricCardProps) {
  return (
    <div style={{
      backgroundColor: '#242938',
      border: '0.5px solid #2e3347',
      borderRadius: 12,
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: 140,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        {icon && (
          <div style={{
            padding: 6,
            background: `${iconColor}20`,
            borderRadius: 8,
            color: iconColor,
            display: 'flex',
          }}>
            {icon}
          </div>
        )}
        <p style={{
          fontSize: 10, fontWeight: 600,
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          margin: 0,
        }}>
          {label}
        </p>
      </div>

      <p style={{
        fontSize: 'var(--metric-value-size, 22px)',
        fontWeight: 600,
        lineHeight: 1,
        color: valueColor,
      }}>
        {typeof value === 'number' ? value.toLocaleString('es-AR') : value}
      </p>

      {subtitle && (
        <p style={{ fontSize: 11, color: '#6b7280', marginTop: 10 }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}