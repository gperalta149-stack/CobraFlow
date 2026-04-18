import api from '../../../services/api'
import type { Deuda, Cliente, DeudaFormData } from '../types'

export const deudasApi = {
  getAll: (estado?: string) => 
    api.get<Deuda[]>(`/deudas${estado ? `?estado=${estado}` : ''}`),
  
  getClientes: () => 
    api.get<Cliente[]>('/clientes'),
  
  create: (data: DeudaFormData) => 
    api.post('/deudas', {
      ...data,
      monto_total: Number(data.monto_total),
      descripcion: data.descripcion.trim()
    }),
  
  delete: (id: string) => 
    api.delete(`/deudas/${id}`),
}