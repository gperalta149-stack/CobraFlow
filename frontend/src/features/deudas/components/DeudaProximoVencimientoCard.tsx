// frontend/src/features/deudas/components/DeudaProximoVencimientoCard.tsx
import { IconCalendar } from '@tabler/icons-react'
import { useMonedaConfig } from '../../../hooks/useMonedaConfig'

const fmtARS = (v: number) => `$${Math.round(v).toLocaleString('es-AR')}`
const fmtUSD = (v: number) =>
  `USD ${v.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

interface Vencimiento {
  fecha_vencimiento: string
  moneda: string
  saldo_pendiente: number
  cotizacion: number
  clientes?: { nombre: string }
}

interface DeudaProximoVencimientoCardProps {
  proximoVencimiento: Vencimiento | null
  cotizacionActual: number
}

export function DeudaProximoVencimientoCard({ proximoVencimiento, cotizacionActual }: DeudaProximoVencimientoCardProps) {
  const { debeMostrarEquivalencia } = useMonedaConfig()
  const mostrarEquivalencia = debeMostrarEquivalencia('deudas')

  const proxIsUSD = proximoVencimiento?.moneda === 'USD'
  const proxCotiz = Number(proximoVencimiento?.cotizacion) || cotizacionActual
  const proxSaldo = Number(proximoVencimiento?.saldo_pendiente ?? 0)
  const proxUSD   = proxIsUSD ? proxSaldo / proxCotiz : proxSaldo / cotizacionActual
  const proxARS   = proxIsUSD ? proxSaldo : proxSaldo
  const proxFecha = proximoVencimiento
    ? new Date(proximoVencimiento.fecha_vencimiento).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : null

  return (
    <div style={{ backgroundColor: '#242938', border: '0.5px solid #2e3347', borderRadius: 12, padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        <div style={{ padding: 6, background: '#94a3b820', borderRadius: 8, color: '#94a3b8', display: 'flex' }}>
          <IconCalendar size={15} />
        </div>
        <p style={{ fontSize: 10, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Próximo vencimiento
        </p>
      </div>

      {proximoVencimiento ? (
        <>
          <p style={{ fontSize: 22, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{proxFecha}</p>
          <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>{proximoVencimiento.clientes?.nombre}</p>
          <div translate="no">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: proxIsUSD ? '#fbbf24' : '#60a5fa', letterSpacing: '0.04em', opacity: 0.8 }}>
                {proxIsUSD ? 'USD' : 'ARS'}
              </span>
              <p style={{ fontSize: 16, fontWeight: 600, color: proxIsUSD ? '#fbbf24' : '#60a5fa' }}>
                {proxIsUSD ? fmtUSD(proxUSD) : fmtARS(proxARS)}
              </p>
            </div>
            {mostrarEquivalencia && (
              <p style={{ fontSize: 11, color: '#6b7280', marginLeft: 28 }}>
                ≈ {proxIsUSD ? fmtARS(proxSaldo) : fmtUSD(proxSaldo / cotizacionActual)}
              </p>
            )}
          </div>
        </>
      ) : (
        <span style={{ fontSize: 14, color: '#4a5568' }}>Sin vencimientos</span>
      )}
    </div>
  )
}