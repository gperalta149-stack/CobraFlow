// frontend/src/features/analisis/components/AgingReport.tsx
import type { AgingData } from '../hooks/useAnalisis'

interface AgingReportProps {
  data: AgingData[]
}

export function AgingReport({ data }: AgingReportProps) {
  if (!data.length) {
    return (
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Sin deudas vencidas</p>
      </div>
    )
  }

  // Encontrar el tramo con mayor monto total (ARS + USD)
  let maxTotal = 0
  let maxTramo = ''
  data.forEach(item => {
    const total = item.montoARS + item.montoUSD
    if (total > maxTotal) {
      maxTotal = total
      maxTramo = item.tramo
    }
  })

  return (
    <div>
      {/* ELIMINAR ESTE TÍTULO DUPLICADO */}
      {/* <h3 style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', marginBottom: 16 }}>Antigüedad de deuda</h3> */}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {data.map((item) => {
          const isMax = item.tramo === maxTramo
          const hasARS = item.montoARS > 0
          const hasUSD = item.montoUSD > 0

          return (
            <div key={item.tramo}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8' }}>
                  {item.tramo}
                  {isMax && (
                    <span style={{
                      marginLeft: 8,
                      fontSize: 10,
                      fontWeight: 600,
                      color: '#f59e0b',
                      background: '#f59e0b20',
                      padding: '2px 8px',
                      borderRadius: 10,
                    }}>
                      Tramo mayor
                    </span>
                  )}
                </span>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  {hasARS && (
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#60a5fa' }}>
                      {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(item.montoARS)}
                    </span>
                  )}
                  {!hasARS && hasUSD && <span style={{ fontSize: 13, color: '#6b7280' }}>—</span>}
                  
                  {hasUSD && (
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#fbbf24' }}>
                      {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.montoUSD)}
                    </span>
                  )}
                  {!hasUSD && hasARS && <span style={{ fontSize: 13, color: '#6b7280' }}>—</span>}
                </div>
              </div>
              <div style={{
                height: 4,
                backgroundColor: '#1e2130',
                borderRadius: 2,
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${(item.montoARS + item.montoUSD) / (data.reduce((acc, d) => acc + d.montoARS + d.montoUSD, 0) || 1) * 100}%`,
                  height: '100%',
                  backgroundColor: isMax ? '#f59e0b' : '#2e3347',
                  borderRadius: 2,
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}