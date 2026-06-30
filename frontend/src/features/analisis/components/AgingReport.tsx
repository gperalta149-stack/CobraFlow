// frontend/src/features/analisis/components/AgingReport.tsx
import { useMonedaConfig } from '../../../hooks/useMonedaConfig'
import type { AgingData } from '../types'  // ← CAMBIAR: importar desde types, no desde useAnalisis

interface AgingReportProps {
  data: AgingData[]
}

export function AgingReport({ data }: AgingReportProps) {
  const { debeMostrarEquivalencia, cotizacion } = useMonedaConfig()
  const mostrarEquivalencia = debeMostrarEquivalencia('analisis')

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

  // Función para formatear con equivalencia
  const fmtMontoConEquivalencia = (monto: number, moneda: 'ARS' | 'USD') => {
    if (moneda === 'USD') {
      const arsEq = monto * cotizacion
      return {
        principal: `USD ${monto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        secundario: mostrarEquivalencia ? `≈ $${Math.round(arsEq).toLocaleString('es-AR')}` : null
      }
    } else {
      const usdEq = monto / cotizacion
      return {
        principal: `$${Math.round(monto).toLocaleString('es-AR')}`,
        secundario: mostrarEquivalencia ? `≈ USD ${usdEq.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : null
      }
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {data.map((item) => {
          const isMax = item.tramo === maxTramo
          const hasARS = item.montoARS > 0
          const hasUSD = item.montoUSD > 0

          const arsFormatted = fmtMontoConEquivalencia(item.montoARS, 'ARS')
          const usdFormatted = fmtMontoConEquivalencia(item.montoUSD, 'USD')

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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    {hasARS && (
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#60a5fa' }}>
                        {arsFormatted.principal}
                      </span>
                    )}
                    {!hasARS && hasUSD && <span style={{ fontSize: 13, color: '#6b7280' }}>—</span>}
                    
                    {hasUSD && (
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#fbbf24' }}>
                        {usdFormatted.principal}
                      </span>
                    )}
                    {!hasUSD && hasARS && <span style={{ fontSize: 13, color: '#6b7280' }}>—</span>}
                  </div>
                  {/* Equivalencias */}
                  {mostrarEquivalencia && (
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 10, color: '#6b7280' }}>
                      {hasARS && arsFormatted.secundario && (
                        <span>{arsFormatted.secundario}</span>
                      )}
                      {hasUSD && usdFormatted.secundario && (
                        <span>{usdFormatted.secundario}</span>
                      )}
                    </div>
                  )}
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