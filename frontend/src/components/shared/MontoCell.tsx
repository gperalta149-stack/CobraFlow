import { useMonedaConfig } from '../../hooks/useMonedaConfig'

interface MontoCellProps {
  moneda: 'ARS' | 'USD'
  montoARS: number
  montoUSD: number
  seccion: 'dashboard' | 'deudas' | 'pagos' | 'analisis'
  mostrarSubtexto?: boolean
}

const formatARS = (v: number) => `$${Math.round(v).toLocaleString('es-AR')}`
const formatUSD = (v: number) =>
  `USD ${(Math.round(v * 100) / 100).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function MontoCell({ moneda, montoARS, montoUSD, seccion, mostrarSubtexto = true }: MontoCellProps) {
  const { debeMostrarEquivalencia } = useMonedaConfig()
  const mostrarEquivalencia = debeMostrarEquivalencia(seccion)

  const safeARS = typeof montoARS === 'number' ? montoARS : 0
  const safeUSD = typeof montoUSD === 'number' ? montoUSD : 0

  if (moneda === 'ARS') {
    return (
      <div translate="no">
        <p className="table-monto-ars">{formatARS(safeARS)}</p>
        {mostrarSubtexto && mostrarEquivalencia && safeUSD > 0 && (
          <p className="table-monto-eq">{formatUSD(safeUSD)}</p>
        )}
      </div>
    )
  }

  return (
    <div translate="no">
      <p className="table-monto-usd">{formatUSD(safeUSD)}</p>
      {mostrarSubtexto && mostrarEquivalencia && safeARS > 0 && (
        <p className="table-monto-eq">{formatARS(safeARS)}</p>
      )}
    </div>
  )
}