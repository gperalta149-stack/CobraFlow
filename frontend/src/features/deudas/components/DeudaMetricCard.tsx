// frontend/src/features/deudas/components/DeudaMetricCard.tsx
import type { ReactNode } from 'react'
import { DualMetricCard } from '../../../components/shared/DualMetricCard'

interface DeudaMetricCardProps {
  label: string
  ars: number
  usd: number
  subtitle: string
  icon: ReactNode
  iconColor?: string
  valueColor?: string
  emptyLabel?: string
  emptyIcon?: string
  mostrarEquivalencias?: boolean
}

export function DeudaMetricCard({
  label, ars, usd, subtitle, icon,
  iconColor = '#60a5fa', 
  valueColor, 
  emptyLabel, 
  emptyIcon,
  mostrarEquivalencias,
}: DeudaMetricCardProps) {
  return (
    <DualMetricCard
      label={label}
      ars={ars}
      usd={usd}
      icon={icon}
      iconColor={iconColor}
      valueColor={valueColor}
      subtitle={subtitle}
      emptyLabel={emptyLabel}
      emptyIcon={emptyIcon}
      seccion="deudas"
      mostrarEquivalencias={mostrarEquivalencias}
    />
  )
}