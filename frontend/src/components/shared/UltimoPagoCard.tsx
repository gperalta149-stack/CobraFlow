// frontend/src/components/shared/UltimoPagoCard.tsx
import { IconCash } from '@tabler/icons-react'

interface UltimoPagoCardProps {
  clienteNombre: string
  montoARS: number
  montoUSD: number
  moneda: 'ARS' | 'USD'
  fecha: string
  metodoPago?: string
  metodoEmoji?: string
  metodoLabel?: string
}

const fmtARS = (v: number) => `$${Math.round(v).toLocaleString('es-AR')}`
const fmtUSD = (v: number) =>
  `USD ${(Math.round(v * 100) / 100).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function UltimoPagoCard({
  clienteNombre, montoARS, montoUSD, moneda,
  fecha, metodoEmoji, metodoLabel,
}: UltimoPagoCardProps) {
  const isUSD = moneda === 'USD'

  return (
    <div style={{
      backgroundColor: '#242938',
      border: '0.5px solid #2e3347',
      borderRadius: 12,
      padding: '16px 20px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        <div style={{
          padding: 6,
          background: '#1D9E7520',
          borderRadius: 8,
          color: '#1D9E75',
          display: 'flex',
        }}>
          <IconCash size={15} />
        </div>
        <p style={{
          fontSize: 10, fontWeight: 600,
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          Último pago
        </p>
      </div>

      {/* Cliente */}
      <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {clienteNombre}
      </p>

      {/* Monto - con labels ARS/USD en lugar de banderas */}
      <div translate="no" style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 6 }}>
        {isUSD ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: '#fbbf24',
                letterSpacing: '0.04em',
                opacity: 0.8,
              }}>
                USD
              </span>
              <span style={{ fontSize: 22, fontWeight: 600, color: '#fbbf24' }}>{fmtUSD(montoUSD)}</span>
            </div>
            <p style={{ fontSize: 11, color: '#6b7280', marginLeft: 28 }}>≈ {fmtARS(montoARS)}</p>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: '#60a5fa',
                letterSpacing: '0.04em',
                opacity: 0.8,
              }}>
                ARS
              </span>
              <span style={{ fontSize: 22, fontWeight: 600, color: '#60a5fa' }}>{fmtARS(montoARS)}</span>
            </div>
            {montoUSD > 0 && (
              <p style={{ fontSize: 11, color: '#6b7280', marginLeft: 28 }}>≈ {fmtUSD(montoUSD)}</p>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <p style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>{fecha}</p>
      {metodoLabel && (
        <p style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
          {metodoEmoji} {metodoLabel}
        </p>
      )}
    </div>
  )
}