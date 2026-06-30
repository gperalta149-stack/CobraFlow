// frontend/src/features/dashboard/components/evolution/EvolucionEmptyState.tsx
import { IconChartLine } from '@tabler/icons-react'
import { CHART_HEIGHT } from './constants'

export function EvolucionEmptyState() {
  return (
    <div style={{
      backgroundColor: '#242938',
      border: '0.5px solid #2e3347',
      borderRadius: 12,
      padding: '40px',
      textAlign: 'center',
      height: '100%',
      minHeight: CHART_HEIGHT.EMPTY,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <IconChartLine size={32} style={{ color: '#4a5568', marginBottom: 12 }} />
      <p style={{ fontSize: 13, color: '#6b7280' }}>Sin datos de cobros</p>
    </div>
  )
}