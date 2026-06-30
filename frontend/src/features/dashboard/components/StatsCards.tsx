// frontend/src/features/dashboard/components/StatsCards.tsx
import { IconWallet, IconAlertCircle, IconTrendingUp, IconCalendar } from '@tabler/icons-react'
import { DualMetricCard } from '../../../components/shared/DualMetricCard'
import { MetricCard } from '../../../components/shared/MetricCard'
import { TextMuted } from '../../../components/ui/Typography'
import { useMonedaConfig } from '../../../hooks/useMonedaConfig'  // ← AGREGAR
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
  // ← AGREGAR el hook
  const { debeMostrarEquivalencia } = useMonedaConfig()
  const mostrarEquivalencia = debeMostrarEquivalencia('dashboard')

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

      {/* Variación mensual - con toggle de equivalencias */}
      <div className="metric-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="metric-card-header" style={{ marginBottom: 0 }}>
            <div className="metric-card-icon" style={{ background: '#f59e0b20', color: '#f59e0b' }}>
              <IconCalendar size={15} />
            </div>
            <p className="metric-label">Variación mensual</p>
          </div>
          {variacion && (
            <span style={{ fontSize: 12, fontWeight: 600, color: isPositive ? '#34d399' : '#f87171' }}>
              {isPositive ? '↗' : '↘'} {Math.abs(variacionNum).toFixed(1)}%
            </span>
          )}
        </div>

        <div className="metric-mini-row">
          <TextMuted className="metric-mini-label">Mes anterior</TextMuted>
          <p className="metric-mini-value">
            {formatCurrency(kpis.totalRecaudadoMesPasadoARS ?? 0, 'ARS')}
            {mostrarEquivalencia && (  // ← condición: solo mostrar USD si está activado
              <>
                <span className="sep">·</span>
                <span className="usd">
                  {formatCurrency(kpis.totalRecaudadoMesPasadoUSD ?? 0, 'USD')}
                </span>
              </>
            )}
          </p>
        </div>

        <div>
          <TextMuted className="metric-mini-label">Mes actual</TextMuted>
          <p className="metric-mini-value">
            {formatCurrency(kpis.totalRecaudadoMesARS, 'ARS')}
            {mostrarEquivalencia && (  // ← condición: solo mostrar USD si está activado
              <>
                <span className="sep">·</span>
                <span className="usd">
                  {formatCurrency(kpis.totalRecaudadoMesUSD, 'USD')}
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}