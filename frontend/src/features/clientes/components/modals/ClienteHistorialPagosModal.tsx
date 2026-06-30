// frontend/src/features/clientes/components/modals/ClienteHistorialPagosModal.tsx

import { useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { IconX, IconReceipt, IconCash, IconDownload } from '@tabler/icons-react'
import { clientesApi } from '../../services/clientesApi'
import { deudasApi } from '../../../deudas/services/deudasApi'
import type { Deuda } from '../../../deudas/types'

interface Pago {
  id: string
  monto: number
  monto_original?: number
  moneda?: string
  fecha_pago: string
  observaciones: string
  metodo_pago?: string
  deudas: { descripcion: string; monto_total: number }
}

interface DeudaPagada {
  id: string
  descripcion: string
  monto_total: number
  monto_original?: number
  moneda: string
  updated_at: string
  numero_factura?: string
}

interface ClienteHistorialPagosProps {
  clienteId: string
  clienteNombre: string
  onClose: () => void
}

type EventoTimeline =
  | { tipo: 'deuda'; fecha: string; data: DeudaPagada }
  | { tipo: 'pago'; fecha: string; data: Pago }

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric', month: 'long', day: 'numeric',
    })
  } catch { return dateString }
}

const fmtARS = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`
const fmtUSD = (n: number) => `USD ${Number(n).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function ClienteHistorialPagos({ clienteId, clienteNombre, onClose }: ClienteHistorialPagosProps) {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [deudasPagadas, setDeudasPagadas] = useState<DeudaPagada[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pagosRes, historialRes] = await Promise.all([
          clientesApi.getPagosByCliente(clienteId),
          deudasApi.getHistorial(clienteId),
        ])
        
        setPagos(pagosRes.data)
        
        // ✅ Mapear Deuda[] a DeudaPagada[]
        const deudasPagadasMapped: DeudaPagada[] = historialRes.data.map((deuda: Deuda) => ({
          id: deuda.id,
          descripcion: deuda.descripcion || 'Sin descripción',
          monto_total: deuda.monto_total,
          monto_original: deuda.monto_original,
          moneda: deuda.moneda || 'ARS',
          updated_at: deuda.updated_at || new Date().toISOString(),
          numero_factura: deuda.numero_factura,
        }))
        
        setDeudasPagadas(deudasPagadasMapped)
      } catch (error) {
        console.error('Error cargando historial:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [clienteId])

  const timeline = useMemo<EventoTimeline[]>(() => {
    const eventosPago: EventoTimeline[] = pagos.map(p => ({ tipo: 'pago', fecha: p.fecha_pago, data: p }))
    const eventosDeuda: EventoTimeline[] = deudasPagadas.map(d => ({ tipo: 'deuda', fecha: d.updated_at, data: d }))
    return [...eventosPago, ...eventosDeuda].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    )
  }, [pagos, deudasPagadas])

  const totalRecaudadoARS = pagos.filter(p => p.moneda !== 'USD').reduce((sum, p) => sum + Number(p.monto), 0)
  const totalRecaudadoUSD = pagos.filter(p => p.moneda === 'USD').reduce((sum, p) => sum + Number(p.monto_original ?? p.monto), 0)

  const exportarCSV = () => {
    const h = ['Fecha', 'Tipo', 'Descripción', 'Monto', 'Moneda']
    const rows = timeline.map(e => {
      if (e.tipo === 'pago') {
        return [formatDate(e.fecha), 'Pago recibido', e.data.deudas?.descripcion ?? '', e.data.monto, e.data.moneda ?? 'ARS']
      }
      return [formatDate(e.fecha), 'Deuda saldada', e.data.descripcion, e.data.monto_total, e.data.moneda]
    })
    const csv = [h, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `historial_${clienteNombre.replace(/\s+/g, '_')}.csv`
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  const modalContent = (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16,
    }}>
      <div style={{
        backgroundColor: '#242938', borderRadius: 16,
        width: '100%', maxWidth: 640, maxHeight: '85vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        border: '0.5px solid #2e3347',
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '0.5px solid #2e3347',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f0f2f5', margin: 0 }}>
              Historial — {clienteNombre}
            </h2>
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
              Deudas saldadas y pagos recibidos
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4 }}
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Resumen */}
        {!loading && timeline.length > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
            padding: '14px 24px', borderBottom: '0.5px solid #2e3347',
          }}>
            <div style={{ background: '#1a1d2e', borderRadius: 10, padding: '10px 14px' }}>
              <p style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                Total recaudado
              </p>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#34d399' }}>
                {totalRecaudadoARS > 0 && fmtARS(totalRecaudadoARS)}
                {totalRecaudadoARS > 0 && totalRecaudadoUSD > 0 && ' · '}
                {totalRecaudadoUSD > 0 && fmtUSD(totalRecaudadoUSD)}
              </p>
            </div>
            <div style={{ background: '#1a1d2e', borderRadius: 10, padding: '10px 14px' }}>
              <p style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                Eventos
              </p>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#f0f2f5' }}>
                {pagos.length} pago{pagos.length !== 1 ? 's' : ''} · {deudasPagadas.length} deuda{deudasPagadas.length !== 1 ? 's' : ''} saldada{deudasPagadas.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px' }}>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0', fontSize: 13 }}>Cargando...</p>
          ) : timeline.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0', fontSize: 13 }}>
              Sin historial registrado para este cliente
            </p>
          ) : (
            <div style={{ position: 'relative' }}>
              {timeline.map((e, i) => {
                const esPago = e.tipo === 'pago'
                const color = esPago ? '#1D9E75' : '#378ADD'
                const Icon = esPago ? IconCash : IconReceipt

                return (
                  <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: i < timeline.length - 1 ? 16 : 0 }}>
                    {/* Línea vertical + ícono */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: `${color}20`, color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={14} />
                      </div>
                      {i < timeline.length - 1 && (
                        <div style={{ width: 1, flex: 1, background: '#2e3347', marginTop: 4 }} />
                      )}
                    </div>

                    {/* Contenido */}
                    <div style={{ flex: 1, paddingBottom: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', margin: 0 }}>
                            {esPago ? 'Pago recibido' : 'Deuda saldada'}
                          </p>
                          <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>
                            {esPago ? e.data.deudas?.descripcion ?? '—' : e.data.descripcion}
                          </p>
                          {esPago && e.data.observaciones && (
                            <p style={{ fontSize: 11, color: '#6b7280', margin: '2px 0 0' }}>
                              {e.data.observaciones}
                            </p>
                          )}
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color, margin: 0 }}>
                            {esPago
                              ? (e.data.moneda === 'USD' ? fmtUSD(e.data.monto_original ?? e.data.monto) : fmtARS(e.data.monto))
                              : (e.data.moneda === 'USD' ? fmtUSD(e.data.monto_original ?? e.data.monto_total) : fmtARS(e.data.monto_total))
                            }
                          </p>
                          <p style={{ fontSize: 11, color: '#6b7280', margin: '2px 0 0' }}>
                            {formatDate(e.fecha)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '0.5px solid #2e3347',
          display: 'flex', gap: 10,
        }}>
          <button
            onClick={exportarCSV}
            disabled={timeline.length === 0}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '9px 0', backgroundColor: '#1a1d2e', border: '0.5px solid #2e3347',
              borderRadius: 8, color: '#94a3b8', fontSize: 13, fontWeight: 500,
              cursor: timeline.length === 0 ? 'not-allowed' : 'pointer',
              opacity: timeline.length === 0 ? 0.5 : 1,
            }}
          >
            <IconDownload size={15} /> Exportar CSV
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '9px 0', backgroundColor: '#1D9E75', border: 'none',
              borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}