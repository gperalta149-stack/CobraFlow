// frontend/src/features/deudas/components/DeudaMoraCard.tsx
import { IconFlame } from '@tabler/icons-react'
import { DualMetricCard } from '../../../components/shared/DualMetricCard'

interface DeudaMoraCardProps {
  moraCount: number
  moraTotalARS: number
  moraTotalUSD: number
}

export function DeudaMoraCard({ moraCount, moraTotalARS, moraTotalUSD }: DeudaMoraCardProps) {
  return (
    <DualMetricCard
      label="Mora acumulada"
      ars={moraTotalARS}
      usd={moraTotalUSD}
      subtitle={`${moraCount} deuda${moraCount !== 1 ? 's' : ''} con mora`}
      icon={<IconFlame size={15} />}
      iconColor="#fb923c"
      prefix="+"
      valueColor="#fca5a5"
      emptyLabel="Sin mora acumulada"
      seccion="deudas"
      // ← ELIMINADO: mostrarEquivalencias={false}
    />
  )
}