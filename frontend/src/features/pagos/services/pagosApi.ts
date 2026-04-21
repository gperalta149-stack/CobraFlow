import api from '../../../services/api'
import type { Pago, Deuda, PagoFormData } from '../types'

export const pagosApi = {
  getAll: () => api.get<Pago[]>('/pagos'),
  
  getDeudasPendientes: () => 
    api.get<Deuda[]>('/deudas').then(({ data }) => 
      data.filter((d: Deuda) => d.estado !== 'pagada')
    ),
  
  create: (data: PagoFormData) => 
    api.post('/pagos', { 
      ...data, 
      monto: Number(data.monto) 
    }),
}