// frontend/src/features/dashboard/components/StatsCards.tsx
import { IconWallet, IconAlertCircle, IconTrendingUp, IconCalendar } from '@tabler/icons-react'
import { DualMetricCard } from '../../../components/shared/DualMetricCard'
import { MetricCard } from '../../../components/shared/MetricCard'
import type { KPIs } from '../types'

interface StatsCardsProps {
  kpis: KPIs | null
}

function formatCurrency(value: number, currency: 'ARS' | 'USD'): string {
  if (currency === 'USD') {
    return `USD ${value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return `$${Math.round(value).toLocaleString('es-AR')}`
}

export function StatsCards({ kpis }: StatsCardsProps) {
  if (!kpis) return null

  const variacion = kpis.variacionMensual
  const variacionNum = variacion ? parseFloat(variacion) : 0
  const isPositive = variacionNum >= 0

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12,
      marginBottom: 20,
      alignItems: 'stretch',
    }}>
      <DualMetricCard
        label="Monto vencido"
        ars={kpis.montoVencidoARS}
        usd={kpis.montoVencidoUSD}
        icon={<IconAlertCircle size={15} />}
        iconColor="#E24B4A"
        arsColor="#f87171"
        seccion="dashboard"
        subtitle={`${kpis.deudasVencidas} deuda${kpis.deudasVencidas !== 1 ? 's' : ''} vencida${kpis.deudasVencidas !== 1 ? 's' : ''}`}
      />

      <DualMetricCard
        label="Recaudado hoy"
        ars={kpis.totalRecaudadoHoyARS}
        usd={kpis.totalRecaudadoHoyUSD}
        icon={<IconWallet size={15} />}
        iconColor="#1D9E75"
        arsColor="#34d399"
        seccion="dashboard"
        subtitle={`${kpis.cantidadPagosHoy} pago${kpis.cantidadPagosHoy !== 1 ? 's' : ''} hoy`}
      />

      <MetricCard
        label="Recuperación"
        value={`${kpis.recuperacionPorcentaje.toFixed(0)}%`}
        icon={<IconTrendingUp size={15} />}
        iconColor="#378ADD"
        valueColor="#60a5fa"
        seccion="dashboard"
        subtitle={`${kpis.deudasCobradas} de ${kpis.deudasTotalesParaRecuperacion} deudas cobradas`}
      />

      <div style={{
        backgroundColor: '#242938',
        border: '0.5px solid #2e3347',
        borderRadius: 12,
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              padding: 6,
              background: '#f59e0b20',
              borderRadius: 8,
              color: '#f59e0b',
              display: 'flex',
            }}>
              <IconCalendar size={15} />
            </div>
            <p style={{
              fontSize: 10,
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              margin: 0,
            }}>
              Variación mensual
            </p>
          </div>
          {variacion && (
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: isPositive ? '#34d399' : '#f87171',
            }}>
              {isPositive ? '↗' : '↘'} {Math.abs(variacionNum).toFixed(1)}%
            </span>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Mes anterior</p>
          <p style={{ fontSize: 13, fontWeight: 500, color: '#f0f2f5' }}>
            {formatCurrency(kpis.totalRecaudadoMesPasadoARS ?? 0, 'ARS')}
            <span style={{ fontSize: 11, color: '#6b7280', margin: '0 6px' }}>·</span>
            <span style={{ fontSize: 12, color: '#fbbf24' }}>
              {formatCurrency(kpis.totalRecaudadoMesPasadoUSD ?? 0, 'USD')}
            </span>
          </p>
        </div>

        <div>
          <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Mes actual</p>
          <p style={{ fontSize: 13, fontWeight: 500, color: '#f0f2f5' }}>
            {formatCurrency(kpis.totalRecaudadoMesARS, 'ARS')}
            <span style={{ fontSize: 11, color: '#6b7280', margin: '0 6px' }}>·</span>
            <span style={{ fontSize: 12, color: '#fbbf24' }}>
              {formatCurrency(kpis.totalRecaudadoMesUSD, 'USD')}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}