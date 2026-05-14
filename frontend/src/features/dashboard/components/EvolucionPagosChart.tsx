import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { DatosEvolucionPagos } from '../types'

interface EvolucionPagosChartProps {
  data: DatosEvolucionPagos[]
}

// Formateador para eje Y
const formatYAxis = (value: number) => `$${value.toLocaleString()}`

// Tooltip personalizado
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow-lg border border-gray-200">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-green-600 font-semibold">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    )
  }
  return null
}

export function EvolucionPagosChart({ data }: EvolucionPagosChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-400">
        No hay datos suficientes para mostrar el gráfico
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-gray-800 mb-4">📈 Evolución de pagos (últimos 6 meses)</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="recaudado" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">Evolución mensual de la recaudación</p>
    </div>
  )
}