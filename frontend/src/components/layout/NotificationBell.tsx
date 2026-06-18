// frontend/src/components/layout/NotificationBell.tsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconBell, IconAlertCircle, IconClock,
  IconCash, IconFlame, IconCheck, IconChartBar,
} from '@tabler/icons-react'
import { useAlertas } from '../../hooks/useAlertas'
import { useMoraConfig } from '../../hooks/useMoraConfig'
import type { Alerta, UltimoPago } from '../../features/dashboard/types'

interface Notificacion {
  id: string
  tipo: 'vencida' | 'vence_hoy' | 'vence_pronto' | 'pago_reciente' | 'mora'
  titulo: string
  descripcion: string
  monto?: string
  color: string
  icono: React.ReactNode
  ruta: string
  urgente: boolean
}

const getDias = (dateString: string): number => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const due = new Date(dateString); due.setHours(0, 0, 0, 0)
    return Math.ceil((due.getTime() - today.getTime()) / 86400000)
  } catch { return 0 }
}

const fmtMonto = (saldo: number, moneda: string, cotizacion: number): string => {
  if (moneda === 'USD') {
    const usd = cotizacion > 0 ? saldo / cotizacion : saldo
    return `USD ${usd.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return `$${Math.round(saldo).toLocaleString('es-AR')}`
}

export function NotificationBell() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [leidas, setLeidas] = useState<Set<string>>(new Set())
  const panelRef = useRef<HTMLDivElement>(null)

  const { alertas, deudasVencidas, ultimosPagos, loading } = useAlertas()
  const { config: moraConfig } = useMoraConfig()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const notificaciones: Notificacion[] = []

  // Deudas vencidas — máximo 3 individuales, resto agrupado
  const primeras = deudasVencidas.slice(0, 3)
  primeras.forEach((d: Alerta) => {
    const dias = Math.abs(getDias(d.fecha_vencimiento))
    notificaciones.push({
      id: `vencida-${d.id}`,
      tipo: 'vencida',
      titulo: d.clientes?.nombre ?? 'Cliente',
      descripcion: `Vencida hace ${dias} día${dias !== 1 ? 's' : ''}`,
      monto: fmtMonto(Number(d.saldo_pendiente), d.moneda, Number(d.cotizacion) || 1450),
      color: '#E24B4A',
      icono: <IconAlertCircle size={15} />,
      ruta: `/deudas?deuda=${d.deuda_id ?? d.id}`,
      urgente: true,
    })
  })
  if (deudasVencidas.length > 3) {
    notificaciones.push({
      id: 'vencidas-resto',
      tipo: 'vencida',
      titulo: `${deudasVencidas.length - 3} deudas vencidas más`,
      descripcion: 'Requieren atención inmediata',
      color: '#E24B4A',
      icono: <IconAlertCircle size={15} />,
      ruta: '/deudas?estado=vencida',
      urgente: true,
    })
  }

  // Vencen hoy
  alertas
    .filter((a: Alerta) => getDias(a.fecha_vencimiento) === 0)
    .forEach((a: Alerta) => {
      notificaciones.push({
        id: `hoy-${a.id}`,
        tipo: 'vence_hoy',
        titulo: a.clientes?.nombre ?? 'Cliente',
        descripcion: 'Vence hoy',
        monto: fmtMonto(Number(a.saldo_pendiente), a.moneda, Number(a.cotizacion) || 1450),
        color: '#EF9F27',
        icono: <IconClock size={15} />,
        ruta: `/deudas?deuda=${a.deuda_id ?? a.id}`,
        urgente: true,
      })
    })

  // Vencen en 1–7 días
  const proximos7 = alertas.filter((a: Alerta) => {
    const d = getDias(a.fecha_vencimiento)
    return d > 0 && d <= 7
  })
  if (proximos7.length > 0) {
    notificaciones.push({
      id: 'proximos-7d',
      tipo: 'vence_pronto',
      titulo: `${proximos7.length} deuda${proximos7.length !== 1 ? 's' : ''} vencen esta semana`,
      descripcion: proximos7
        .map((a: Alerta) => a.clientes?.nombre)
        .filter(Boolean)
        .slice(0, 3)
        .join(', '),
      color: '#378ADD',
      icono: <IconClock size={15} />,
      ruta: '/deudas',
      urgente: false,
    })
  }

  // Vencen en 8–30 días
  const proximos30 = alertas.filter((a: Alerta) => {
    const d = getDias(a.fecha_vencimiento)
    return d > 7 && d <= 30
  })
  if (proximos30.length > 0) {
    notificaciones.push({
      id: 'proximos-30d',
      tipo: 'vence_pronto',
      titulo: `${proximos30.length} deuda${proximos30.length !== 1 ? 's' : ''} vencen este mes`,
      descripcion: 'Revisá el calendario de vencimientos',
      color: '#60a5fa',
      icono: <IconClock size={15} />,
      ruta: '/deudas',
      urgente: false,
    })
  }

  // Pagos de las últimas 24hs
  const ayer = new Date(); ayer.setDate(ayer.getDate() - 1)
  const recientes = ultimosPagos.filter((p: UltimoPago) => new Date(p.created_at) > ayer)
  if (recientes.length > 0) {
    notificaciones.push({
      id: 'pagos-recientes',
      tipo: 'pago_reciente',
      titulo: `${recientes.length} pago${recientes.length !== 1 ? 's' : ''} registrado${recientes.length !== 1 ? 's' : ''} hoy`,
      descripcion: recientes
        .map((p: UltimoPago) => p.clientes?.nombre)
        .filter(Boolean)
        .slice(0, 3)
        .join(', '),
      color: '#1D9E75',
      icono: <IconCash size={15} />,
      ruta: '/pagos',
      urgente: false,
    })
  }

  // Mora activa sobre deudas vencidas
  if (moraConfig?.mora_activa && deudasVencidas.length > 0) {
    notificaciones.push({
      id: 'mora-activa',
      tipo: 'mora',
      titulo: 'Mora acumulándose',
      descripcion: `${deudasVencidas.length} deuda${deudasVencidas.length !== 1 ? 's' : ''} generando mora al ${moraConfig.mora_porcentaje}%`,
      color: '#fb923c',
      icono: <IconFlame size={15} />,
      ruta: '/analisis',
      urgente: false,
    })
  }

  const noLeidas = notificaciones.filter(n => !leidas.has(n.id))
  const badge = noLeidas.length
  const urgentes = noLeidas.filter(n => n.urgente).length

  const marcarTodasLeidas = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLeidas(new Set(notificaciones.map(n => n.id)))
  }

  const handleClick = (n: Notificacion) => {
    setLeidas(prev => new Set([...prev, n.id]))
    setOpen(false)
    navigate(n.ruta)
  }

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'relative',
          width: 36, height: 36,
          background: open ? '#242938' : 'transparent',
          border: '0.5px solid',
          borderColor: open ? '#3a4159' : 'transparent',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: badge > 0 ? '#f0f2f5' : '#6b7280',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#242938'
          e.currentTarget.style.borderColor = '#3a4159'
        }}
        onMouseLeave={e => {
          if (!open) {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'transparent'
          }
        }}
      >
        <IconBell size={18} />
        {badge > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            minWidth: 16, height: 16, padding: '0 4px',
            background: urgentes > 0 ? '#E24B4A' : '#378ADD',
            borderRadius: 8, fontSize: 10, fontWeight: 700, color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1, border: '1.5px solid #1a1f2e',
          }}>
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 380, background: '#1e2334',
          border: '0.5px solid #2e3347', borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          zIndex: 9999, overflow: 'hidden',
        }}>
          {/* Header con botón "Marcar todo" rediseñado */}
          <div style={{
            padding: '14px 16px', borderBottom: '0.5px solid #2e3347',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5' }}>
                Notificaciones
              </span>
              {badge > 0 && (
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  background: urgentes > 0 ? 'rgba(226,75,74,0.15)' : 'rgba(55,138,221,0.15)',
                  color: urgentes > 0 ? '#E24B4A' : '#378ADD',
                  border: `0.5px solid ${urgentes > 0 ? 'rgba(226,75,74,0.3)' : 'rgba(55,138,221,0.3)'}`,
                  padding: '2px 8px', borderRadius: 10,
                }}>
                  {badge} nueva{badge !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            {badge > 0 && (
              <button
                onClick={marcarTodasLeidas}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'rgba(29,158,117,0.1)',
                  border: '0.5px solid rgba(29,158,117,0.3)',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: 11, fontWeight: 500,
                  color: '#1D9E75',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(29,158,117,0.2)'
                  e.currentTarget.style.borderColor = 'rgba(29,158,117,0.5)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(29,158,117,0.1)'
                  e.currentTarget.style.borderColor = 'rgba(29,158,117,0.3)'
                }}
              >
                <IconCheck size={11} />
                Marcar todo como leído
              </button>
            )}
          </div>

          {/* Lista */}
          <div style={{ maxHeight: 380, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#4a5568 #1e2130' }}>
            {loading ? (
              <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                <p style={{ fontSize: 12, color: '#6b7280' }}>Cargando...</p>
              </div>
            ) : notificaciones.length === 0 ? (
              <div style={{ padding: '40px 16px', textAlign: 'center' }}>
                <IconCheck size={28} style={{ color: '#1D9E75', marginBottom: 8 }} />
                <p style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', marginBottom: 4 }}>Todo en orden</p>
                <p style={{ fontSize: 11, color: '#6b7280' }}>No hay alertas pendientes</p>
              </div>
            ) : (
              notificaciones.map((n, idx) => {
                const esLeida = leidas.has(n.id)
                return (
                  <div
                    key={n.id}
                    onClick={() => handleClick(n)}
                    style={{
                      padding: '12px 16px',
                      borderBottom: idx < notificaciones.length - 1 ? '0.5px solid #252b3b' : 'none',
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                      cursor: 'pointer',
                      background: esLeida ? 'transparent' : `${n.color}08`,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#242938'}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = esLeida ? 'transparent' : `${n.color}08`
                    }}
                  >
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: `${n.color}20`, color: n.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {n.icono}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <p style={{
                          fontSize: 13, fontWeight: esLeida ? 500 : 600,
                          color: esLeida ? '#94a3b8' : '#f0f2f5', margin: 0,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {n.titulo}
                        </p>
                        {n.monto && (
                          <span style={{ fontSize: 12, fontWeight: 600, color: n.color, flexShrink: 0 }}>
                            {n.monto}
                          </span>
                        )}
                      </div>
                      <p style={{
                        fontSize: 11, color: '#6b7280', marginTop: 2,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {n.descripcion}
                      </p>
                    </div>

                    {!esLeida && (
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: n.color, flexShrink: 0, marginTop: 4,
                      }} />
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Footer rediseñado con dos botones */}
          {notificaciones.length > 0 && (
            <div style={{
              padding: '12px 16px',
              borderTop: '0.5px solid #2e3347',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
            }}>
              <button
                onClick={() => { navigate('/deudas'); setOpen(false) }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '8px 12px',
                  background: 'rgba(226,75,74,0.1)',
                  border: '0.5px solid rgba(226,75,74,0.25)',
                  borderRadius: 8,
                  fontSize: 12, fontWeight: 500,
                  color: '#f87171',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(226,75,74,0.18)'
                  e.currentTarget.style.borderColor = 'rgba(226,75,74,0.45)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(226,75,74,0.1)'
                  e.currentTarget.style.borderColor = 'rgba(226,75,74,0.25)'
                }}
              >
                <IconAlertCircle size={13} />
                Ver deudas
              </button>

              <button
                onClick={() => { navigate('/analisis'); setOpen(false) }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '8px 12px',
                  background: 'rgba(96,165,250,0.1)',
                  border: '0.5px solid rgba(96,165,250,0.25)',
                  borderRadius: 8,
                  fontSize: 12, fontWeight: 500,
                  color: '#60a5fa',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(96,165,250,0.18)'
                  e.currentTarget.style.borderColor = 'rgba(96,165,250,0.45)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(96,165,250,0.1)'
                  e.currentTarget.style.borderColor = 'rgba(96,165,250,0.25)'
                }}
              >
                <IconChartBar size={13} />
                Ver análisis
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}