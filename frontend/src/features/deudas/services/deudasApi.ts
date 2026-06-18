import api from '../../../services/api'
import type { Deuda, Cliente, DeudaFormData } from '../types'

interface DeudaPayload {
  cliente_id: string
  descripcion: string
  monto_total: number
  fecha_vencimiento: string
  moneda: 'ARS' | 'USD'
  monto_original: number
  cotizacion: number
  numero_factura?: string
  observaciones?: string
}

export const deudasApi = {
  // Vista principal: pendientes + parciales + vencidas (excluye pagadas)
  getAll: (estado?: string) =>
    api.get<Deuda[]>(`/deudas${estado ? `?estado=${estado}` : ''}`),

  // Historial: solo deudas pagadas
  getHistorial: (cliente_id?: string) =>
    api.get<Deuda[]>(`/deudas/historial${cliente_id ? `?cliente_id=${cliente_id}` : ''}`),

  getClientes: () =>
    api.get<Cliente[]>('/clientes'),

  create: (data: DeudaFormData) => {
    const payload: DeudaPayload = {
      cliente_id: data.cliente_id,
      descripcion: data.descripcion.trim(),
      monto_total: Number(data.monto_total),
      fecha_vencimiento: data.fecha_vencimiento,
      moneda: data.moneda,
      monto_original: Number(data.monto_original),
      cotizacion: data.moneda === 'USD' ? Number(data.cotizacion) : 1,
    }

    if (data.numero_factura?.trim()) {
      payload.numero_factura = data.numero_factura.trim()
    }
    if (data.observaciones?.trim()) {
      payload.observaciones = data.observaciones.trim()
    }

    return api.post<Deuda>('/deudas', payload)
  },

  delete: (_id: string): Promise<void> => {
    return Promise.reject(
      new Error('Las deudas no pueden eliminarse. Son parte del historial contable.')
    )
  },
}