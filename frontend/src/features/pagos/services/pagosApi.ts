// frontend/src/features/pagos/services/pagosApi.ts
import api from '../../../services/api'
import type { Pago, Deuda, PagoFormData } from '../types'

export const pagosApi = {
  // Modificar getAll para aceptar parámetros opcionales
  getAll: (params?: { desde?: string; hasta?: string }) =>
    api.get<Pago[]>('/pagos', { params }),

  getDeudasPendientes: () =>
    api.get<Deuda[]>('/deudas').then(({ data }) =>
      data.filter((d: Deuda) => d.estado !== 'pagada')
    ),

  create: (data: PagoFormData) =>
    api.post('/pagos', {
      deuda_id: data.deuda_id,
      monto: Number(data.monto),
      moneda_pago: data.moneda_pago,
      cotizacion_pago: Number(data.cotizacion_pago),
      metodo_pago: data.metodo_pago,
      observaciones: data.observaciones,
    }),
}