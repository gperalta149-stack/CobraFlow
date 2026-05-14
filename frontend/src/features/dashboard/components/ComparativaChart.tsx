import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { DatosComparativa } from '../types'

interface ComparativaChartProps {
  data: DatosComparativa[]
}

// Formateador para eje X
const formatXAxis = (value: number) => `$${value.toLocaleString()}`

// Tooltip personalizado
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow-lg border border-gray-200">
        <p className="text-sm font-medium">{payload[0].payload.nombre}</p>
        <p className="text-sm font-semibold" style={{ color: payload[0].payload.color }}>
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    )
  }
  return null
}

export function ComparativaChart({ data }: ComparativaChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-400">
        No hay datos suficientes para mostrar el gráfico
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-gray-800 mb-4">⚖️ Comparativa: Deuda vs Cobrado</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={formatXAxis} />
            <YAxis type="category" dataKey="nombre" width={120} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="valor" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">Comparación entre el total adeudado y el total cobrado</p>
    </div>
  )
}