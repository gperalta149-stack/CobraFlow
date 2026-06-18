// frontend/src/features/analisis/components/DistribucionBarras.tsx
import { IconChartDonut } from '@tabler/icons-react'
import type { DatosComparativa } from '../../dashboard/types'

interface DistribucionBarrasProps {
  data: DatosComparativa[]
}

export function DistribucionBarras({ data }: DistribucionBarrasProps) {
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

  const total = data.reduce((sum, d) => sum + d.valor, 0)
  const max = Math.max(...data.map(d => d.valor))

  return (
    <div style={{
      backgroundColor: '#242938',
      border: '0.5px solid #2e3347',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #2e3347', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ padding: 6, background: 'rgba(148,163,184,0.15)', borderRadius: 8, color: '#94a3b8', display: 'flex' }}>
          <IconChartDonut size={15} />
        </div>
        <div>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', margin: 0 }}>Distribución por estado</h2>
          <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Composición del portfolio de deudas</p>
        </div>
      </div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {data.map(item => {
          const pct = total > 0 ? (item.valor / total) * 100 : 0
          const widthPct = max > 0 ? (item.valor / max) * 100 : 0
          return (
            <div key={item.nombre}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5' }}>{item.nombre}</span>
                </div>
                <span style={{ fontSize: 12, color: '#6b7280' }}>
                  {item.valor} {item.valor === 1 ? 'deuda' : 'deudas'} · {pct.toFixed(0)}%
                </span>
              </div>
              <div style={{ background: '#1a1d2e', borderRadius: 6, height: 8, overflow: 'hidden' }}>
                <div style={{
                  width: `${widthPct}%`,
                  height: '100%',
                  borderRadius: 6,
                  backgroundColor: item.color,
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}