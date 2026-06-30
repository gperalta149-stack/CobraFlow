// frontend/src/features/analisis/pages/Analisis.tsx
import { IconAlertCircle, IconCash, IconChartBar, IconClock, IconFileInvoice, IconScale } from '@tabler/icons-react'
import { useState } from 'react'
import { H3, TextMuted } from '../../../components/ui/Typography'
import '../../../styles/analisis.css'
import { AgingReport } from '../components/AgingReport'
import { ClientesMoraTable } from '../components/ClientesMoraTable'
import { DistribucionBarras } from '../components/DistribucionBarras'
import { EvolucionPagosChart } from '../components/evolution/EvolucionPagosChart'
import { KpiCardBimoneda } from '../components/KpiCardBimoneda'
import { PeriodoSelector, type Periodo } from '../components/PeriodoSelector'
import { ProyeccionCard } from '../components/ProyeccionCard'
import { useAnalisis } from '../hooks/useAnalisis'

const COLOR_ARS = '#60a5fa'
const COLOR_USD = '#fbbf24'
const COLOR_DANGER = '#f87171'

const PERIODO_LABELS: Record<Periodo, string> = {
  semana: 'Últimos 7 días',
  mes: 'Último mes',
  trimestre: 'Último trimestre',
  semestre: 'Último semestre',
  año: 'Último año',
}

export default function Analisis() {
  const [periodo, setPeriodo] = useState<Periodo>('mes')
  const [year, setYear] = useState(new Date().getFullYear())

  const {
    evolucionPagos,
    deudasPorEstadoData,
    clientesMora,
    balance,
    kpis,
    agingData,
    proyeccionARS,
    proyeccionUSD,
    loading,
    error,
  } = useAnalisis(periodo)

  if (loading) {
    return (
      <div className="analisis-loading">
        <div className="skeleton-grid">
          {[...Array(5)].map((_, i) => <div key={i} className="item" />)}
        </div>
        <div className="skeleton-charts">
          {[...Array(2)].map((_, i) => <div key={i} className="item" />)}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ background: '#242938', border: '0.5px solid #E24B4A40', borderRadius: 12, padding: 32, textAlign: 'center', maxWidth: 360 }}>
          <H3 style={{ color: '#E24B4A', marginBottom: 8 }}>Error al cargar el análisis</H3>
          <TextMuted style={{ marginBottom: 16 }}>{error}</TextMuted>
          <button
            onClick={() => window.location.reload()}
            style={{ background: '#E24B4A', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="analisis-container">

      {/* ════════════════════════════════════════════════ */}
      {/* SECCIÓN 1: ANÁLISIS DEL PERÍODO */}
      {/* ELIMINADO EL TÍTULO "Análisis del período" */}
      {/* ════════════════════════════════════════════════ */}

      {/* Periodo Selector con Año */}
      <PeriodoSelector
        periodo={periodo}
        onChange={setPeriodo}
        year={year}
        onYearChange={setYear}
      />

      {/* KPI Cards - filtrados por período */}
      <div className="analisis-kpi-grid">
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

      {/* Gráficos - filtrados por período */}
      <div className="analisis-charts-grid">
        <EvolucionPagosChart 
          data={evolucionPagos} 
          variacionMensual={null}
          periodoLabel={PERIODO_LABELS[periodo]}
        />
        <DistribucionBarras data={deudasPorEstadoData} />
      </div>

      {/* ════════════════════════════════════════════════ */}
      {/* SECCIÓN 2: RIESGO ACTUAL DE LA CARTERA */}
      {/* ════════════════════════════════════════════════ */}
      <div className="analisis-section-header analisis-section-spacer">
        <div className="indicator indicator-red" />
        <span className="label">Riesgo actual de la cartera</span>
        <div className="line" />
      </div>

      <div className="analisis-riesgo-grid">
        {/* Antigüedad de deuda */}
        <div className="dark-card">
          <div className="metric-card-header-spaced">
            <div className="metric-card-icon" style={{ background: '#f59e0b20', color: '#f59e0b' }}>
              <IconClock size={16} />
            </div>
            <div>
              <p className="metric-card-title">Antigüedad de deuda</p>
              <p className="metric-card-subtitle">Estado actual de la cartera</p>
            </div>
          </div>
          <div style={{ padding: '16px 20px' }}>
            <AgingReport data={agingData} />
          </div>
        </div>

        {/* Proyección + Mora */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ProyeccionCard proyeccionARS={proyeccionARS} proyeccionUSD={proyeccionUSD} />
          <ClientesMoraTable 
            clientes={clientesMora}
            subtitle="Estado actual de la cartera"
          />
        </div>
      </div>

    </div>
  )
}