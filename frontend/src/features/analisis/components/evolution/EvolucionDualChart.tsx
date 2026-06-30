// frontend/src/features/dashboard/components/evolution/EvolucionDualChart.tsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { EvolucionTooltip } from './EvolucionTooltip'
import { formatYAxisARS, formatYAxisUSD, getMaxValue } from './utils'
import { COLORS, CHART_HEIGHT } from './constants'

interface EvolucionDualChartProps {
  data: any[]
}

export function EvolucionDualChart({ data }: EvolucionDualChartProps) {
  const maxARS = getMaxValue(data, 'ARS')
  const maxUSD = getMaxValue(data, 'USD')

  return (
    <>
      {/* ARS Chart */}
      <div style={{ height: CHART_HEIGHT.DUAL }}>
        <p style={{ fontSize: 9, color: COLORS.ARS, marginBottom: 2, fontWeight: 600 }}>🇦🇷 ARS</p>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 0, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e3347" />
            <XAxis dataKey="mes" stroke="#6b7280" fontSize={8} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
            <YAxis stroke="#6b7280" fontSize={8} tickLine={false} axisLine={false} domain={[0, maxARS * 1.2]} tickFormatter={formatYAxisARS} tick={{ fill: '#94a3b8' }} width={45} />
            <Tooltip content={<EvolucionTooltip />} />
            <Line type="monotone" dataKey="ARS" stroke={COLORS.ARS} strokeWidth={2} dot={{ r: 2, fill: COLORS.ARS, strokeWidth: 0 }} activeDot={{ r: 4 }} name="ARS" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Separador */}
      <div style={{ height: 1, background: COLORS.BORDER, margin: '6px 0' }} />

      {/* USD Chart */}
      <div style={{ height: CHART_HEIGHT.DUAL }}>
        <p style={{ fontSize: 9, color: COLORS.USD, marginBottom: 2, fontWeight: 600 }}>🇺🇸 USD</p>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 0, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e3347" />
            <XAxis dataKey="mes" stroke="#6b7280" fontSize={8} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
            <YAxis stroke="#6b7280" fontSize={8} tickLine={false} axisLine={false} domain={[0, maxUSD * 1.2]} tickFormatter={formatYAxisUSD} tick={{ fill: '#94a3b8' }} width={45} />
            <Tooltip content={<EvolucionTooltip />} />
            <Line type="monotone" dataKey="USD" stroke={COLORS.USD} strokeWidth={2} dot={{ r: 2, fill: COLORS.USD, strokeWidth: 0 }} activeDot={{ r: 4 }} name="USD" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}