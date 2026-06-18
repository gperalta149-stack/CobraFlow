// frontend/src/features/analisis/pages/Analisis.tsx
import { useState } from 'react'
import { useAnalisis } from '../hooks/useAnalisis'
import { useMonedaConfig } from '../../../hooks/useMonedaConfig'
import { EvolucionPagosChart } from '../../dashboard/components/EvolucionPagosChart'
import { DistribucionBarras } from '../components/DistribucionBarras'
import { AgingReport } from '../components/AgingReport'
import {
  IconCash,
  IconFileInvoice,
  IconScale,
  IconChartBar,
  IconAlertCircle,
  IconAlertTriangle,
  IconClock,
} from '@tabler/icons-react'

type Periodo = 'semana' | 'mes' | 'trimestre' | 'semestre' | 'año'

const PERIODOS: { id: Periodo; label: string }[] = [
  { id: 'semana', label: 'Semana' },
  { id: 'mes', label: 'Mes' },
  { id: 'trimestre', label: 'Trimestre' },
  { id: 'semestre', label: 'Semestre' },
  { id: 'año', label: 'Año' },
]

function formatearMonedaNativa(monto: number, moneda: 'ARS' | 'USD'): string {
  if (moneda === 'USD') {
    return `USD ${monto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return `$${Math.round(monto).toLocaleString('es-AR')}`
}

function FormatearMonedaNativa({ monto, moneda }: { monto: number; moneda: 'ARS' | 'USD' }) {
  return <>{formatearMonedaNativa(monto, moneda)}</>
}

const COLOR_ARS = '#60a5fa'
const COLOR_USD = '#fbbf24'
const COLOR_DANGER = '#f87171'

interface KpiCardBimonedaProps {
  label: string
  icon: React.ReactNode
  iconColor: string
  valARS: number
  valUSD: number
  subtextARS?: string
  subtextUSD?: string
  colorMode?: 'currency' | 'danger' | 'auto'
  labelColorOverride?: string
}

function KpiCardBimoneda({
  label,
  icon,
  iconColor,
  valARS,
  valUSD,
  subtextARS,
  subtextUSD,
  colorMode = 'currency',
  labelColorOverride,
}: KpiCardBimonedaProps) {
  const { formatearMonto, debeMostrarEquivalencia } = useMonedaConfig()
  const mostrarEquivalencia = debeMostrarEquivalencia('analisis')

  const getColors = (valor: number, monedaColor: string) => {
    if (colorMode === 'danger') return { label: COLOR_DANGER, value: COLOR_DANGER }
    if (colorMode === 'auto') {
      const c = valor < 0 ? COLOR_DANGER : monedaColor
      return { label: c, value: c }
    }
    return { label: labelColorOverride ?? monedaColor, value: monedaColor }
  }

  const ars = getColors(valARS, COLOR_ARS)
  const usd = getColors(valUSD, COLOR_USD)

  const fmt = (v: number, moneda: 'ARS' | 'USD') => {
    const abs = Math.abs(v)
    const sign = v < 0 ? '-' : ''
    return `${sign}${formatearMonedaNativa(abs, moneda)}`
  }

  const arsFormatted = formatearMonto(valARS, valUSD, 'ARS', 'analisis')
  const usdFormatted = formatearMonto(valARS, valUSD, 'USD', 'analisis')

  return (
    <div className="metric-card">
      <div className="metric-card-header">
        <div className="metric-card-icon" style={{ background: `${iconColor}20`, color: iconColor }}>
          {icon}
        </div>
        <p className="metric-label">{label}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} translate="no">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="metric-currency-tag" style={{ color: ars.label }}>ARS</span>
            <span className="metric-value-dual" style={{ color: ars.value }}>
              {fmt(valARS, 'ARS')}
            </span>
          </div>
          {mostrarEquivalencia && arsFormatted.secundario && valARS !== 0 && (
            <p className="metric-subtitle" style={{ marginLeft: 32 }}>
              {arsFormatted.secundario}
            </p>
          )}
        </div>
        {subtextARS && <p className="metric-subtitle" style={{ marginLeft: 32 }}>{subtextARS}</p>}

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="metric-currency-tag" style={{ color: usd.label }}>USD</span>
            <span className="metric-value-dual" style={{ color: usd.value }}>
              {fmt(valUSD, 'USD')}
            </span>
          </div>
          {mostrarEquivalencia && usdFormatted.secundario && valUSD !== 0 && (
            <p className="metric-subtitle" style={{ marginLeft: 32 }}>
              {usdFormatted.secundario}
            </p>
          )}
        </div>
        {subtextUSD && <p className="metric-subtitle" style={{ marginLeft: 32 }}>{subtextUSD}</p>}
      </div>
    </div>
  )
}

export default function Analisis() {
  const [periodo, setPeriodo] = useState<Periodo>('mes')
  const { evolucionPagos, deudasPorEstadoData, clientesMora, balance, kpis, agingData, proyeccionARS, proyeccionUSD, loading, error } = useAnalisis(periodo)

  if (loading) {
    return (
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {[...Array(5)].map((_, i) => <div key={i} style={{ background: '#242938', borderRadius: 12, height: 115, opacity: 0.5 }} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[...Array(2)].map((_, i) => <div key={i} style={{ background: '#242938', borderRadius: 12, height: 280, opacity: 0.5 }} />)}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ background: '#242938', border: '0.5px solid #E24B4A40', borderRadius: 12, padding: 32, textAlign: 'center', maxWidth: 360 }}>
          <p style={{ fontWeight: 600, color: '#E24B4A', marginBottom: 8 }}>Error al cargar el análisis</p>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ background: '#E24B4A', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const thStyle: React.CSSProperties = {
    padding: '10px 16px', fontSize: 10, fontWeight: 600,
    color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em',
    textAlign: 'left', borderBottom: '0.5px solid #2e3347',
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px' }}>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 4, background: '#1a1d2e', borderRadius: 10, padding: 4, width: 'fit-content' }}>
          {PERIODOS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriodo(p.id)}
              style={{
                padding: '6px 16px',
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: periodo === p.id ? '#242938' : 'transparent',
                color: periodo === p.id ? '#f0f2f5' : '#6b7280',
                boxShadow: periodo === p.id ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        <KpiCardBimoneda
          label="Cobrado"
          icon={<IconCash size={15} />}
          iconColor={COLOR_ARS}
          valARS={balance.cobradoARS}
          valUSD={balance.cobradoUSD}
          colorMode="currency"
        />

        <KpiCardBimoneda
          label="Nuevas deudas"
          icon={<IconFileInvoice size={15} />}
          iconColor={COLOR_USD}
          valARS={balance.nuevasDeudasARS}
          valUSD={balance.nuevasDeudasUSD}
          colorMode="currency"
        />

        <KpiCardBimoneda
          label="Balance"
          icon={<IconScale size={15} />}
          iconColor="#94a3b8"
          valARS={balance.cobradoARS - balance.nuevasDeudasARS}
          valUSD={balance.cobradoUSD - balance.nuevasDeudasUSD}
          colorMode="auto"
        />

        <KpiCardBimoneda
          label="Recuperación"
          icon={<IconChartBar size={15} />}
          iconColor={COLOR_ARS}
          valARS={balance.cobradoARS}
          valUSD={balance.cobradoUSD}
          subtextARS={`${balance.recuperacionARS.toFixed(0)}% efectividad`}
          subtextUSD={`${balance.recuperacionUSD.toFixed(0)}% efectividad`}
          colorMode="currency"
          labelColorOverride={COLOR_DANGER}
        />

        <KpiCardBimoneda
          label="Deuda vencida"
          icon={<IconAlertCircle size={15} />}
          iconColor={COLOR_DANGER}
          valARS={kpis?.montoVencidoARS || 0}
          valUSD={kpis?.montoVencidoUSD || 0}
          subtextARS={`${kpis?.porcentajeVencidoARS.toFixed(0)}% de cartera`}
          subtextUSD={`${kpis?.porcentajeVencidoUSD.toFixed(0)}% de cartera`}
          colorMode="danger"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <EvolucionPagosChart data={evolucionPagos} variacionMensual={null} />
        <DistribucionBarras data={deudasPorEstadoData} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        <div style={{ backgroundColor: '#242938', border: '0.5px solid #2e3347', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #2e3347', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ padding: 6, background: '#f59e0b20', borderRadius: 8, color: '#f59e0b', display: 'flex' }}>
              <IconClock size={16} />
            </div>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', margin: 0 }}>Antigüedad de deuda</h2>
          </div>
          <div style={{ padding: '16px 20px' }}>
            <AgingReport data={agingData} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {(proyeccionARS > 0 || proyeccionUSD > 0) && (
            <div style={{ backgroundColor: '#242938', border: '0.5px solid #2e3347', borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Proyección próximos 30 días
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 32, alignItems: 'center', marginTop: 4 }}>
                {proyeccionARS > 0 && (
                  <div>
                    <span style={{ fontSize: 20, fontWeight: 700, color: '#34d399' }}>
                      <FormatearMonedaNativa monto={proyeccionARS} moneda="ARS" />
                    </span>
                  </div>
                )}
                {proyeccionARS > 0 && proyeccionUSD > 0 && (
                  <div style={{ width: '1px', background: '#2e3347', height: 24 }} />
                )}
                {proyeccionUSD > 0 && (
                  <div>
                    <span style={{ fontSize: 20, fontWeight: 700, color: '#34d399' }}>
                      <FormatearMonedaNativa monto={proyeccionUSD} moneda="USD" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {clientesMora.length > 0 && (
            <div style={{ backgroundColor: '#242938', border: '0.5px solid #2e3347', borderRadius: 12, overflow: 'hidden', flex: 1 }}>
              <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #2e3347', display: 'flex', alignItems: 'center' }}>
                <IconAlertTriangle size={18} style={{ color: '#fb923c', marginRight: 8 }} />
                <h2 style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', margin: 0 }}>Clientes con mayor mora activa</h2>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Cliente</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Deuda base</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Mora calc.</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Total a pagar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesMora.map((c) => (
                      <tr key={c.id} style={{ borderBottom: '0.5px solid #1e2130' }}>
                        <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#f0f2f5' }}>{c.nombre}</td>
                        <td style={{ padding: '10px 16px', fontSize: 13, textAlign: 'right', color: '#6b7280' }}>
                          <FormatearMonedaNativa monto={c.deuda_original} moneda={c.moneda} />
                        </td>
                        <td style={{ padding: '10px 16px', fontSize: 13, textAlign: 'right', fontWeight: 600, color: '#fb923c' }}>
                          <FormatearMonedaNativa monto={c.mora_acumulada} moneda={c.moneda} />
                        </td>
                        <td style={{ padding: '10px 16px', fontSize: 13, textAlign: 'right', fontWeight: 600, color: '#34d399' }}>
                          <FormatearMonedaNativa monto={c.total} moneda={c.moneda} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}