// frontend/src/features/dashboard/components/evolution/EvolucionPagosChart.tsx
import { IconChartLine } from '@tabler/icons-react'
import { useState } from 'react'
import { useMonedaConfig } from '../../../../hooks/useMonedaConfig'
import type { DatosEvolucionPagos } from '../../../dashboard/types'
import { COLORS } from './constants'
import { EvolucionChartARS } from './EvolucionChartARS'
import { EvolucionChartUSD } from './EvolucionChartUSD'
import { EvolucionDualChart } from './EvolucionDualChart'
import { EvolucionEmptyState } from './EvolucionEmptyState'
import { EvolucionToggle } from './EvolucionToggle'
import { prepareChartData } from './utils'

interface EvolucionPagosChartProps {
  data: DatosEvolucionPagos[]
  variacionMensual: string | null
  periodoLabel?: string  // ← AGREGAR
}

type Modo = 'ars' | 'usd' | 'ambos'

export function EvolucionPagosChart({ 
  data, 
  variacionMensual, 
  periodoLabel = 'Últimos 6 meses'  // ← AGREGAR con valor por defecto
}: EvolucionPagosChartProps) {
  const [modo, setModo] = useState<Modo>('ambos')
  const { cotizacion } = useMonedaConfig()
  const cotizacionActual = cotizacion || 1450

  if (!data || data.length === 0) {
    return <EvolucionEmptyState />
  }

  const chartData = prepareChartData(data, cotizacionActual)

  const getModoLabel = () => {
    if (modo === 'ars') return '🇦🇷 ARS'
    if (modo === 'usd') return '🇺🇸 USD'
    return '🇦🇷 ARS + 🇺🇸 USD'
  }

  return (
    <div style={{
      backgroundColor: '#242938',
      border: '0.5px solid #2e3347',
      borderRadius: 12,
      padding: '20px',
      height: '100%',
      minHeight: modo === 'ambos' ? 380 : 320,
    }}>
      {/* Header con icono */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            padding: 6,
            background: '#1D9E7520',
            borderRadius: 8,
            color: '#1D9E75',
            display: 'flex',
          }}>
            <IconChartLine size={18} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', margin: 0 }}>Evolución de cobros</p>
            <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
              {periodoLabel} · {getModoLabel()}  {/* ← USAR periodoLabel */}
            </p>
          </div>
        </div>
        
        <EvolucionToggle modo={modo} setModo={setModo} />
      </div>

      {/* Contenido según modo */}
      {modo === 'ars' && <EvolucionChartARS data={chartData} />}
      {modo === 'usd' && <EvolucionChartUSD data={chartData} />}
      {modo === 'ambos' && <EvolucionDualChart data={chartData} />}

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 12, paddingTop: 12, borderTop: '0.5px solid #2e3347',
      }}>
        <p style={{ fontSize: 10, color: '#6b7280' }}>{data.length} meses de datos</p>
        {variacionMensual && (
          <p style={{
            fontSize: 11,
            fontWeight: 600,
            color: Number(variacionMensual) >= 0 ? COLORS.POSITIVE : COLORS.NEGATIVE,
          }}>
            {Number(variacionMensual) >= 0 ? '↗' : '↘'} {variacionMensual}%
          </p>
        )}
      </div>
    </div>
  )
}