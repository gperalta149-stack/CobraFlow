// frontend/src/features/dashboard/components/AlertasList.tsx
import { useNavigate } from 'react-router-dom'
import { IconAlertCircle } from '@tabler/icons-react'
import { useMonedaConfig } from '../../../hooks/useMonedaConfig'
import type { Alerta } from '../types'

interface AlertasListProps {
  alertas: Alerta[]
  deudasVencidas?: Alerta[]
}

const getDias = (dateString: string): number => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const due = new Date(dateString); due.setHours(0, 0, 0, 0)
    return Math.ceil((due.getTime() - today.getTime()) / 86400000)
  } catch { return 0 }
}

const formatDateCorta = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
  } catch { return dateString }
}

export function AlertasList({ alertas, deudasVencidas = [] }: AlertasListProps) {
  const navigate = useNavigate()
  const { debeMostrarEquivalencia, cotizacion } = useMonedaConfig()
  const mostrarEquivalencia = debeMostrarEquivalencia('dashboard')

  const fmtMonto = (saldo: number, moneda: string, cotizacionDeuda: number): string => {
    if (moneda === 'USD') {
      const cotiz = cotizacionDeuda > 0 ? cotizacionDeuda : cotizacion
      const usd = saldo / cotiz
      return `USD ${usd.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return `$${Math.round(saldo).toLocaleString('es-AR')}`
  }

  const fmtEquivalencia = (saldo: number, moneda: string, cotizacionDeuda: number): string => {
    if (moneda === 'USD') {
      const cotiz = cotizacionDeuda > 0 ? cotizacionDeuda : cotizacion
      const usd = saldo / cotiz
      return `≈ $${Math.round(usd * cotizacion).toLocaleString('es-AR')} ARS`
    }
    return `≈ USD ${(saldo / cotizacion).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const handleVer = (a: Alerta) => {
    if (a.deuda_id) navigate(`/deudas?deuda=${a.deuda_id}`)
    else if (a.cliente_id) navigate(`/deudas?cliente=${a.cliente_id}`)
    else navigate('/deudas')
  }

  const todasAlertas = [
    ...deudasVencidas.map(a => ({ ...a, esVencida: true })),
    ...alertas.map(a => ({ ...a, esVencida: false })),
  ].sort((a, b) => {
    if (a.esVencida && !b.esVencida) return -1
    if (!a.esVencida && b.esVencida) return 1
    return getDias(a.fecha_vencimiento) - getDias(b.fecha_vencimiento)
  })

  const totalItems = todasAlertas.length

  return (
    <div style={{
      backgroundColor: '#242938',
      border: '0.5px solid #2e3347',
      borderRadius: 12,
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '0.5px solid #2e3347',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ padding: 6, background: '#E24B4A20', borderRadius: 8, color: '#E24B4A', display: 'flex' }}>
            <IconAlertCircle size={16} />
          </div>
          <div>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', margin: 0 }}>Atención inmediata</h2>
            <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Vencidas y próximas</p>
          </div>
        </div>
        {totalItems > 0 && (
          <span style={{
            fontSize: 11, fontWeight: 600,
            background: 'rgba(226,75,74,0.15)', color: '#E24B4A',
            border: '0.5px solid rgba(226,75,74,0.3)',
            padding: '3px 10px', borderRadius: 6,
          }}>
            {totalItems}
          </span>
        )}
      </div>

      <div>
        {totalItems === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <IconAlertCircle size={32} style={{ color: '#34d399', marginBottom: 12 }} />
            <p style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', marginBottom: 4 }}>Todo al día</p>
            <p style={{ fontSize: 11, color: '#6b7280' }}>Sin deudas pendientes</p>
          </div>
        ) : (
          todasAlertas.map((a, idx) => {
            const dias = getDias(a.fecha_vencimiento)
            const diasAbs = Math.abs(dias)
            const esVencida = a.esVencida
            const color = esVencida ? '#E24B4A' : dias <= 2 ? '#E24B4A' : '#EF9F27'
            const label = esVencida
              ? `${diasAbs}d`
              : dias === 0 ? 'Hoy' : dias === 1 ? 'Mañana' : `${dias}d`
            const saldo = Number(a.saldo_pendiente)
            const cotizDeuda = Number(a.cotizacion)

            return (
              <div
                key={a.id}
                style={{
                  padding: '14px 20px',
                  borderBottom: idx < todasAlertas.length - 1 ? '0.5px solid #1e2130' : 'none',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'flex-start', gap: 12,
                  cursor: 'pointer', transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1e2130')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                onClick={() => handleVer(a)}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5' }}>
                      {a.clientes.nombre}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 600,
                      background: `${color}20`, color,
                      padding: '2px 10px', borderRadius: 12,
                    }}>
                      {label}
                    </span>
                  </div>
                  <p style={{
                    fontSize: 11, color: '#6b7280',
                    margin: '6px 0 0',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {a.descripcion}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{
                    fontSize: 14, fontWeight: 600,
                    color: esVencida ? '#f87171' : '#f0f2f5',
                    margin: 0,
                  }}>
                    {fmtMonto(saldo, a.moneda, cotizDeuda)}
                  </p>
                  {mostrarEquivalencia && (
                    <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                      {fmtEquivalencia(saldo, a.moneda, cotizDeuda)}
                    </p>
                  )}
                  <p style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>
                    {formatDateCorta(a.fecha_vencimiento)}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}