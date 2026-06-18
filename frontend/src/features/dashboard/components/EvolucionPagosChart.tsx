// frontend/src/features/dashboard/components/EvolucionPagosChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { IconChartLine } from '@tabler/icons-react'
import type { DatosEvolucionPagos } from '../types'

interface EvolucionPagosChartProps {
  data: DatosEvolucionPagos[]
  variacionMensual: number | null
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1a1d2e',
        border: '0.5px solid #2e3347',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 12,
      }}>
        <p style={{ color: '#6b7280', marginBottom: 2 }}>{label}</p>
        <p style={{ color: '#34d399', fontWeight: 600 }}>
          ${payload[0].value.toLocaleString('es-AR')}
        </p>
      </div>
    )
  }
  return null
}

export function EvolucionPagosChart({ data, variacionMensual }: EvolucionPagosChartProps) {
  const positiva = variacionMensual !== null && variacionMensual >= 0

  if (data.length === 0) {
    return (
      <div style={{
        backgroundColor: '#242938',
        border: '0.5px solid #2e3347',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 260,
      }}>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Sin datos suficientes</p>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: '#242938',
      border: '0.5px solid #2e3347',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '0.5px solid #2e3347',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ padding: 6, background: 'rgba(96,165,250,0.15)', borderRadius: 8, color: '#60a5fa', display: 'flex' }}>
            <IconChartLine size={15} />
          </div>
          <div>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', margin: 0 }}>Evolución de cobros</h2>
            <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Últimos 6 meses</p>
          </div>
        </div>
        {variacionMensual !== null && (
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: positiva ? '#34d399' : '#f87171' }}>
              {positiva ? '↑' : '↓'} {Math.abs(variacionMensual).toFixed(1)}%
            </span>
            <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>vs mes anterior</p>
          </div>
        )}
      </div>
      <div style={{ padding: 16, height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e3347" vertical={false} />
            <XAxis
              dataKey="mes"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="recaudado" fill="#1D9E75" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}