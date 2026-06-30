// frontend/src/features/pagos/components/PagosMetrics.tsx
import { DualMetricCard } from '../../../components/shared/DualMetricCard'
import { UltimoPagoCard } from '../../../components/shared/UltimoPagoCard'
import { IconWallet, IconClock } from '@tabler/icons-react'
import { metodosEmoji, metodosLabel } from '../constants/metodos'
import type { Pago } from '../types'

interface PagosMetricsProps {
  totalARS: number
  totalUSD: number
  totalFiltrados: number
  mesARS: number
  mesUSD: number
  variacionARS: number | null
  mesAnteriorNombre: string
  ultimoPago: Pago | undefined
  ultimoPagoARS: number
  ultimoPagoUSD: number
}

// ← Asegurar que sea export function (no default)
export function PagosMetrics({
  totalARS, totalUSD, totalFiltrados,
  mesARS, mesUSD, variacionARS, mesAnteriorNombre,
  ultimoPago, ultimoPagoARS, ultimoPagoUSD,
}: PagosMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <DualMetricCard
        label="Total recaudado"
        ars={totalARS}
        usd={totalUSD}
        subtitle={`${totalFiltrados} pago${totalFiltrados !== 1 ? 's' : ''} en vista`}
        icon={<IconWallet size={15} />}
        seccion="pagos"
      />
      <DualMetricCard
        label="Este mes"
        ars={mesARS}
        usd={mesUSD}
        trend={variacionARS !== null ? { value: variacionARS, label: `vs ${mesAnteriorNombre}` } : undefined}
        icon={<IconClock size={15} />}
        seccion="pagos"
      />

      <UltimoPagoCard
        clienteNombre={ultimoPago?.clientes?.nombre ?? 'Sin pagos aún'}
        montoARS={ultimoPagoARS}
        montoUSD={ultimoPagoUSD}
        moneda={ultimoPago?.moneda ?? 'ARS'}
        fecha={ultimoPago ? new Date(ultimoPago.fecha_pago).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
        metodoPago={ultimoPago?.metodo_pago}
        metodoEmoji={ultimoPago?.metodo_pago ? metodosEmoji[ultimoPago.metodo_pago] : undefined}
        metodoLabel={ultimoPago?.metodo_pago ? metodosLabel[ultimoPago.metodo_pago] : undefined}
      />
    </div>
  )
}