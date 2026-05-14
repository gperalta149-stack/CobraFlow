import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { TopCliente } from '../types'

interface TopClientesChartProps {
  clientes: TopCliente[]
  maxSaldo: number
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']

// Formateador para eje X
const formatXAxis = (value: number) => `$${value.toLocaleString()}`

// Tooltip personalizado
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow-lg border border-gray-200">
        <p className="text-sm font-medium">{payload[0].payload.nombre}</p>
        <p className="text-sm text-red-600 font-semibold">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    )
  }
  return null
}

export function TopClientesChart({ clientes }: TopClientesChartProps) {
  if (clientes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-400">
        No hay datos de clientes para mostrar
      </div>
    )
  }

  const data = clientes.map((c, index) => ({
    nombre: c.clientes.nombre,
    saldo: c.saldo_pendiente,
    color: COLORS[index % COLORS.length]
  }))

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="border-b border-gray-100 p-5">
        <h2 className="font-bold text-gray-800 text-lg">📊 Top clientes con mayor deuda</h2>
        <p className="text-xs text-gray-400 mt-1">Ranking de clientes que más deben</p>
      </div>
      <div className="p-5">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={formatXAxis} />
              <YAxis type="category" dataKey="nombre" width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="saldo" radius={[0, 8, 8, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}