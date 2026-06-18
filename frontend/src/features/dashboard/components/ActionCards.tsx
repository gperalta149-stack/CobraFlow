// frontend/src/features/dashboard/components/ActionCards.tsx
import { IconAlertTriangle, IconCash, IconEye } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useMonedaConfig } from '../../../hooks/useMonedaConfig'
import type { ClienteMayorRiesgo } from '../types'

function formatCurrency(value: number, currency: 'ARS' | 'USD'): string {
  if (currency === 'USD') {
    return `USD ${value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return `$${Math.round(value).toLocaleString('es-AR')}`
}

export function ClienteMayorRiesgoCard({ cliente }: { cliente: ClienteMayorRiesgo | null }) {
  const navigate = useNavigate()
  const { debeMostrarEquivalencia, cotizacion } = useMonedaConfig()
  const mostrarEquivalencia = debeMostrarEquivalencia('dashboard')

  if (!cliente) {
    return (
      <div style={{
        backgroundColor: '#242938',
        border: '0.5px solid #2e3347',
        borderRadius: 12,
        padding: '24px',
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div>
          <IconAlertTriangle size={32} style={{ color: '#4a5568', marginBottom: 12 }} />
          <p style={{ fontSize: 13, color: '#94a3b8' }}>No hay deudas vencidas</p>
        </div>
      </div>
    )
  }

  const isUSD = cliente.moneda === 'USD'

  // Equivalencias
  const pendienteEq = isUSD
    ? `≈ $${Math.round(cliente.pendiente * cotizacion).toLocaleString('es-AR')} ARS`
    : `≈ USD ${(cliente.pendiente / cotizacion).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const moraEq = isUSD
    ? `≈ $${Math.round(cliente.mora * cotizacion).toLocaleString('es-AR')} ARS`
    : `≈ USD ${(cliente.mora / cotizacion).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const totalEq = isUSD
    ? `≈ $${Math.round(cliente.total * cotizacion).toLocaleString('es-AR')} ARS`
    : `≈ USD ${(cliente.total / cotizacion).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div style={{
      backgroundColor: '#242938',
      border: '0.5px solid #E24B4A40',
      borderRadius: 12,
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '0.5px solid #2e3347',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{ padding: 6, background: '#E24B4A20', borderRadius: 8, color: '#E24B4A', display: 'flex' }}>
          <IconAlertTriangle size={16} />
        </div>
        <div>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', margin: 0 }}>Mayor riesgo</h2>
          <p style={{ fontSize: 11, color: '#E24B4A', margin: 0 }}>{cliente.dias_vencido} días vencido</p>
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#f0f2f5', margin: 0 }}>
            {cliente.nombre}
          </p>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
            {cliente.descripcion}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: '#1e2334', padding: 12, borderRadius: 8 }}>
            <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>Pendiente</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: isUSD ? '#fbbf24' : '#f87171' }}>
              {formatCurrency(cliente.pendiente, cliente.moneda)}
            </p>
            {mostrarEquivalencia && (
              <p style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>{pendienteEq}</p>
            )}
          </div>

          <div style={{ background: '#1e2334', padding: 12, borderRadius: 8 }}>
            <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>Mora acumulada</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#fb923c' }}>
              {formatCurrency(cliente.mora, cliente.moneda)}
            </p>
            {mostrarEquivalencia && (
              <p style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>{moraEq}</p>
            )}
          </div>
        </div>

        <div style={{
          background: '#1D9E7510',
          border: '1px solid #1D9E7530',
          borderRadius: 10,
          padding: 16,
        }}>
          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>Total a cobrar</p>
          <p style={{ fontSize: 30, fontWeight: 700, color: '#34d399', margin: 0 }}>
            {formatCurrency(cliente.total, cliente.moneda)}
          </p>
          {mostrarEquivalencia && (
            <p style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>{totalEq}</p>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => navigate(`/deudas?deuda=${cliente.deuda_id}`)}
            style={{
              flex: 1, height: 42,
              background: '#2a3045', border: '1px solid #3b4259',
              borderRadius: 8, color: '#cbd5e1',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1e2334' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#2a3045' }}
          >
            <IconEye size={16} />
            Ver deuda
          </button>

          <button
            onClick={() => navigate(`/pagos?deuda=${cliente.deuda_id}`)}
            style={{
              flex: 1, height: 42,
              background: '#1D9E75', border: 'none',
              borderRadius: 8, color: '#fff',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#158f66' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1D9E75' }}
          >
            <IconCash size={16} />
            Registrar pago
          </button>
        </div>
      </div>
    </div>
  )
}