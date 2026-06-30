// frontend/src/features/analisis/components/MontoConEquivalencia.tsx
import { useMonedaConfig } from '../../../hooks/useMonedaConfig'
import { fmtMoneda } from '../utils/formatMoneda'

interface MontoConEquivalenciaProps {
  monto: number
  moneda: 'ARS' | 'USD'
  color?: string
  fontWeight?: number
  mostrarEquivalencia?: boolean
}

export function MontoConEquivalencia({
  monto, moneda, color = '#f0f2f5', fontWeight = 400, mostrarEquivalencia = true,
}: MontoConEquivalenciaProps) {
  const { cotizacion } = useMonedaConfig()

  const equivalente = moneda === 'ARS'
    ? fmtMoneda(monto / cotizacion, 'USD')
    : fmtMoneda(monto * cotizacion, 'ARS')

  return (
    <div>
      <span style={{ fontSize: 13, fontWeight, color }}>
        {fmtMoneda(monto, moneda)}
      </span>
      {mostrarEquivalencia && monto > 0 && (
        <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>
          {equivalente}
        </div>
      )}
    </div>
  )
}