// frontend/src/components/shared/DualMetricCard.tsx
import type { ReactNode } from 'react'
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react'
import { useMonedaConfig } from '../../hooks/useMonedaConfig'
import { Equivalencia } from './Equivalencia'

interface DualMetricCardProps {
  label: string
  ars: number
  usd: number
  subtitle?: string
  icon?: ReactNode
  iconColor?: string
  trend?: { value: number; label: string }
  emptyLabel?: string
  emptyIcon?: string
  valueColor?: string
  arsColor?: string
  usdColor?: string
  prefix?: string
  seccion?: 'dashboard' | 'deudas' | 'pagos' | 'analisis'
  mostrarEquivalencias?: boolean
}

const roundTwo = (v: number) => Math.round(v * 100) / 100
const fmtARS = (v: number) => `$${Math.round(v).toLocaleString('es-AR')}`
const fmtUSD = (v: number) =>
  `USD ${roundTwo(v).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function DualMetricCard({
  label, ars, usd, subtitle, icon,
  iconColor = '#60a5fa',
  trend, emptyLabel, emptyIcon,
  valueColor, arsColor, usdColor, prefix = '',
  seccion = 'dashboard',
  mostrarEquivalencias,
}: DualMetricCardProps) {
  const { debeMostrarEquivalencia, formatearMonto } = useMonedaConfig()
  
  const equivalenciasActivas = mostrarEquivalencias !== undefined 
    ? mostrarEquivalencias 
    : debeMostrarEquivalencia(seccion)

  const hasArs = ars > 0
  const hasUsd = usd > 0
  const isEmpty = !hasArs && !hasUsd
  const trendUp = trend ? trend.value >= 0 : false

  const colorArs = arsColor || valueColor || '#60a5fa'
  const colorUsd = usdColor || valueColor || '#fbbf24'

  const arsFormatted = formatearMonto(ars, usd, 'ARS', seccion)
  const usdFormatted = formatearMonto(ars, usd, 'USD', seccion)

  const mostrarEquivArs = equivalenciasActivas && arsFormatted.secundario && hasUsd
  const mostrarEquivUsd = equivalenciasActivas && usdFormatted.secundario && hasArs

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
          fontSize: 10,
          fontWeight: 600,
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          margin: 0,
        }}>
          {label}
        </p>
      </div>

      {isEmpty ? (
        emptyLabel ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {emptyIcon && <span>{emptyIcon}</span>}
            <span style={{ fontSize: 14, fontWeight: 500, color: '#1D9E75' }}>{emptyLabel}</span>
          </div>
        ) : (
          <span style={{
            fontSize: 'var(--metric-value-size, 22px)',
            fontWeight: 600,
            color: '#4a5568',
          }}>—</span>
        )
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} translate="no">
          {hasArs && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: colorArs,
                  letterSpacing: '0.04em',
                  opacity: 0.8,
                }}>ARS</span>
                <span style={{
                  fontSize: 'var(--metric-value-size, 22px)',
                  fontWeight: 600,
                  color: colorArs,
                  lineHeight: 1,
                }}>
                  {prefix}{fmtARS(ars)}
                </span>
              </div>
              <Equivalencia visible={mostrarEquivArs}>
                <p style={{
                  fontSize: 11,
                  color: '#6b7280',
                  margin: 0,
                  paddingLeft: 32,
                }}>
                  {arsFormatted.secundario}
                </p>
              </Equivalencia>
            </div>
          )}
          {hasUsd && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: colorUsd,
                  letterSpacing: '0.04em',
                  opacity: 0.8,
                }}>USD</span>
                <span style={{
                  fontSize: 'var(--metric-value-size, 22px)',
                  fontWeight: 600,
                  color: colorUsd,
                  lineHeight: 1,
                }}>
                  {prefix}{fmtUSD(usd)}
                </span>
              </div>
              <Equivalencia visible={mostrarEquivUsd}>
                <p style={{
                  fontSize: 11,
                  color: '#6b7280',
                  margin: 0,
                  paddingLeft: 32,
                }}>
                  {usdFormatted.secundario}
                </p>
              </Equivalencia>
            </div>
          )}
        </div>
      )}

      {trend && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginTop: 10,
          fontSize: 11,
          fontWeight: 600,
          color: trendUp ? '#34d399' : '#f87171',
        }}>
          {trendUp
            ? <IconTrendingUp size={13} color="#34d399" />
            : <IconTrendingDown size={13} color="#f87171" />}
          <span>{trendUp ? '+' : ''}{trend.value.toFixed(1)}%</span>
          <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 400 }}>{trend.label}</span>
        </div>
      )}

      {subtitle && (
        <p style={{
          fontSize: 11,
          color: '#6b7280',
          marginTop: 10,
        }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}