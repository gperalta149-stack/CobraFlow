import { MetricCard } from '../../../components/shared/MetricCard'
import {
  IconUsers, IconCreditCard, IconAlertCircle,
  IconCircleCheck, IconArchive,
} from '@tabler/icons-react'

interface ClientesMetricsProps {
  totalClientes: number
  clientesConDeuda: number
  clientesMorosos: number
  clientesAlDia: number
  totalArchivados: number
}

export function ClientesMetrics({
  totalClientes, clientesConDeuda,
  clientesMorosos, clientesAlDia, totalArchivados,
}: ClientesMetricsProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
      <MetricCard
        label="Total clientes"
        value={totalClientes}
        subtitle="activos en el sistema"
        icon={<IconUsers size={15} />}
        iconColor="#60a5fa"
        valueColor="#fff"
      />
      <MetricCard
        label="Con deuda"
        value={clientesConDeuda}
        subtitle="pendiente o vencida"
        icon={<IconCreditCard size={15} />}
        iconColor="#fb923c"
        valueColor="#fb923c"
      />
      <MetricCard
        label="Morosos"
        value={clientesMorosos}
        subtitle="deuda vencida"
        icon={<IconAlertCircle size={15} />}
        iconColor="#E24B4A"
        valueColor="#E24B4A"
      />
      <MetricCard
        label="Al día"
        value={clientesAlDia}
        subtitle="sin deuda activa"
        icon={<IconCircleCheck size={15} />}
        iconColor="#1D9E75"
        valueColor="#1D9E75"
      />
      <MetricCard
        label="Archivados"
        value={totalArchivados}
        subtitle="inactivos"
        icon={<IconArchive size={15} />}
        iconColor="#6b7280"
        valueColor="#6b7280"
      />
    </div>
  )
}