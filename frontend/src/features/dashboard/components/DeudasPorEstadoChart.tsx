// frontend/src/features/dashboard/components/DeudasPorEstadoChart.tsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { DatosComparativa } from '../types'

interface DeudasPorEstadoChartProps {
  data: DatosComparativa[]
}

const CustomTooltip = ({ active, payload }: {
  active?: boolean
  payload?: { name: string; value: number }[]
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
        <p style={{ color: '#f0f2f5', fontWeight: 600, marginBottom: 2 }}>{payload[0].name}</p>
        <p style={{ color: '#6b7280' }}>{payload[0].value} deudas</p>
      </div>
    )
  }
  return null
}

export function DeudasPorEstadoChart({ data }: DeudasPorEstadoChartProps) {
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
        <p style={{ fontSize: 13, color: '#6b7280' }}>Sin datos para mostrar</p>
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
      <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #2e3347' }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', margin: 0 }}>Distribución por estado</h2>
        <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Composición del portfolio de deudas</p>
      </div>
      <div style={{ padding: 16, height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={90}
              dataKey="valor"
              nameKey="nombre"
              label={({ cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 }) => {
                if (percent < 0.08) return null
                const RADIAN = Math.PI / 180
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5
                const x = cx + radius * Math.cos(-midAngle * RADIAN)
                const y = cy + radius * Math.sin(-midAngle * RADIAN)
                return (
                  <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                )
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ fontSize: 11, color: '#6b7280' }}>{value}</span>
              )}
              wrapperStyle={{ paddingTop: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}