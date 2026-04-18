import api from '../../../services/api'
import type { Cliente, ClienteFormData } from '../types'

export const clientesApi = {
  getAll: (buscar?: string) => 
    api.get<Cliente[]>(`/clientes${buscar ? `?buscar=${buscar}` : ''}`),
  
  create: (data: ClienteFormData) => 
    api.post('/clientes', {
      nombre: data.nombre.trim(),
      email: data.email.trim() || null,
      telefono: data.telefono.trim() || null,
      direccion: data.direccion.trim() || null
    }),
  
  update: (id: string, data: ClienteFormData) => 
    api.put(`/clientes/${id}`, {
      nombre: data.nombre.trim(),
      email: data.email.trim() || null,
      telefono: data.telefono.trim() || null,
      direccion: data.direccion.trim() || null
    }),
  
  delete: (id: string) => 
    api.delete(`/clientes/${id}`),
}