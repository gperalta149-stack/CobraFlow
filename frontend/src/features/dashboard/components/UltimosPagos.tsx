// frontend/src/features/dashboard/components/UltimosPagos.tsx
import { IconHistory } from '@tabler/icons-react'
import { useMonedaConfig } from '../../../hooks/useMonedaConfig'
import type { UltimoPago } from '../types'

interface UltimosPagosProps {
  pagos: UltimoPago[]
}

function getMetodoLabel(metodo: string): string {
  const labels: Record<string, string> = {
    efectivo: 'Efectivo', transferencia: 'Transferencia',
    tarjeta_credito: 'TC', tarjeta_debito: 'TD',
    cheque: 'Cheque', mercado_pago: 'MP',
    paypal: 'PayPal', cripto: 'Cripto', otro: 'Otro',
  }
  return labels[metodo] ?? metodo
}

function getMetodoColor(metodo: string): string {
  const colors: Record<string, string> = {
    efectivo: '#1D9E75', transferencia: '#378ADD',
    tarjeta_credito: '#f59e0b', tarjeta_debito: '#f59e0b',
    cheque: '#E24B4A', mercado_pago: '#009EE3',
  }
  return colors[metodo] ?? '#6b7280'
}

export function UltimosPagos({ pagos }: UltimosPagosProps) {
  const { debeMostrarEquivalencia, cotizacion } = useMonedaConfig()
  const mostrarEquivalencia = debeMostrarEquivalencia('dashboard')

  const pagosMostrar = pagos.slice(0, 10)

  const fmtPrincipal = (pago: UltimoPago): string => {
    if (pago.moneda === 'USD') {
      return `USD ${pago.monto_original.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return `$${Math.round(pago.monto).toLocaleString('es-AR')}`
  }

  const fmtEquivalencia = (pago: UltimoPago): string => {
    if (pago.moneda === 'USD') {
      return `≈ $${Math.round(pago.monto_original * cotizacion).toLocaleString('es-AR')} ARS`
    }
    return `≈ USD ${(pago.monto / cotizacion).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  if (!pagosMostrar.length) {
    return (
      <div style={{ backgroundColor: '#242938', border: '0.5px solid #2e3347', borderRadius: 12, padding: '24px', textAlign: 'center', height: '100%' }}>
        <IconHistory size={32} style={{ color: '#4a5568', marginBottom: 12 }} />
        <p style={{ fontSize: 13, color: '#94a3b8' }}>No hay pagos registrados aún</p>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: '#242938', border: '0.5px solid #2e3347',
      borderRadius: 12, overflow: 'hidden', height: '100%',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #2e3347', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ padding: 6, background: '#1D9E7520', borderRadius: 8, color: '#1D9E75', display: 'flex' }}>
          <IconHistory size={16} />
        </div>
        <div>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', margin: 0 }}>Últimos pagos</h2>
          <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Últimos movimientos</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#4a5568 #1e2130' }}>
        {pagosMostrar.map((pago, idx) => (
          <div key={pago.id} style={{
            padding: '14px 20px',
            borderBottom: idx < pagosMostrar.length - 1 ? '0.5px solid #1e2130' : 'none',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', marginBottom: 6 }}>
                {pago.clientes?.nombre || 'Cliente'}
              </p>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                  backgroundColor: pago.moneda === 'USD' ? '#fbbf2420' : '#34d39920',
                  color: pago.moneda === 'USD' ? '#fbbf24' : '#34d399',
                }}>
                  {pago.moneda}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 4,
                  backgroundColor: `${getMetodoColor(pago.metodo_pago)}20`,
                  color: getMetodoColor(pago.metodo_pago),
                }}>
                  {getMetodoLabel(pago.metodo_pago)}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: pago.moneda === 'USD' ? '#fbbf24' : '#f0f2f5', margin: 0 }}>
                {fmtPrincipal(pago)}
              </p>
              {mostrarEquivalencia && (
                <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                  {fmtEquivalencia(pago)}
                </p>
              )}
              <p style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>
                {new Date(pago.created_at).toLocaleDateString('es-AR')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}