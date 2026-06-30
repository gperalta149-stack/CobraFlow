// frontend/src/features/dashboard/components/evolution/EvolucionChartARS.tsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { EvolucionTooltip } from './EvolucionTooltip'
import { formatYAxisARS, getMaxValue } from './utils'
import { COLORS, CHART_HEIGHT } from './constants'

interface EvolucionChartARSProps {
  data: any[]
}

export function EvolucionChartARS({ data }: EvolucionChartARSProps) {
  const maxARS = getMaxValue(data, 'ARS')

  return (
    <div style={{ height: CHART_HEIGHT.SINGLE }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e3347" />
          <XAxis dataKey="mes" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
          <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} domain={[0, maxARS * 1.2]} tickFormatter={formatYAxisARS} tick={{ fill: '#94a3b8' }} />
          <Tooltip content={<EvolucionTooltip />} />
          <Line type="monotone" dataKey="ARS" stroke={COLORS.ARS} strokeWidth={2.5} dot={{ r: 3, fill: COLORS.ARS, strokeWidth: 0 }} activeDot={{ r: 5 }} name="ARS" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}