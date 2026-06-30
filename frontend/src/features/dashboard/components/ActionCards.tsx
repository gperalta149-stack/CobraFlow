// frontend/src/features/dashboard/components/ActionCards.tsx
import { IconAlertTriangle, IconCash, IconEye } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useMonedaConfig } from '../../../hooks/useMonedaConfig'
import { H2, H1, TextSmall, TextMuted } from '../../../components/ui/Typography'
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
      <div className="metric-card" style={{ padding: '24px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <IconAlertTriangle size={32} style={{ color: '#4a5568', marginBottom: 12 }} />
          <TextMuted>No hay deudas vencidas</TextMuted>
        </div>
      </div>
    )
  }

  const isUSD = cliente.moneda === 'USD'

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
    <div className="metric-card" style={{ borderColor: '#E24B4A40', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="metric-card-header-spaced">
        <div className="metric-card-icon" style={{ background: '#E24B4A20', color: '#E24B4A' }}>
          <IconAlertTriangle size={16} />
        </div>
        <div>
          <p className="metric-card-title">Mayor riesgo</p>
          <p className="metric-card-subtitle" style={{ color: '#E24B4A' }}>{cliente.dias_vencido} días vencido</p>
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Nombre y descripción del cliente */}
        <div>
          <H2 style={{ fontSize: 20 }}>{cliente.nombre}</H2>
          <TextSmall style={{ color: '#94a3b8', marginTop: 4 }}>{cliente.descripcion}</TextSmall>
        </div>

        {/* Pendiente + Mora */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: '#1e2334', padding: 12, borderRadius: 8 }}>
            <TextSmall style={{ marginBottom: 6 }}>Pendiente</TextSmall>
            <H2 style={{ fontSize: 18, color: isUSD ? '#fbbf24' : '#f87171' }}>
              {formatCurrency(cliente.pendiente, cliente.moneda)}
            </H2>
            {mostrarEquivalencia && (
              <TextSmall style={{ marginTop: 4 }}>{pendienteEq}</TextSmall>
            )}
          </div>

          <div style={{ background: '#1e2334', padding: 12, borderRadius: 8 }}>
            <TextSmall style={{ marginBottom: 6 }}>Mora acumulada</TextSmall>
            <H2 style={{ fontSize: 18, color: '#fb923c' }}>
              {formatCurrency(cliente.mora, cliente.moneda)}
            </H2>
            {mostrarEquivalencia && (
              <TextSmall style={{ marginTop: 4 }}>{moraEq}</TextSmall>
            )}
          </div>
        </div>

        {/* Total a cobrar */}
        <div style={{ background: '#1D9E7510', border: '1px solid #1D9E7530', borderRadius: 10, padding: 16 }}>
          <TextSmall style={{ marginBottom: 6 }}>Total a cobrar</TextSmall>
          <H1 style={{ fontSize: 30, color: '#34d399' }}>
            {formatCurrency(cliente.total, cliente.moneda)}
          </H1>
          {mostrarEquivalencia && (
            <TextSmall style={{ marginTop: 4 }}>{totalEq}</TextSmall>
          )}
        </div>

        {/* Botones */}
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
            <IconEye size={16} /> Ver deuda
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
            <IconCash size={16} /> Registrar pago
          </button>
        </div>
      </div>
    </div>
  )
}