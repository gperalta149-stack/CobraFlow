import api from '../../../services/api'
import type { Cliente, ClienteFormData } from '../types'

export const clientesApi = {
  getAll: (buscar?: string, page?: number, limit?: number) => {
    const params = new URLSearchParams()

    if (buscar) params.append('buscar', buscar)

    if (page && limit) {
      params.append('page', page.toString())
      params.append('limit', limit.toString())
    }

    const url = `/clientes${params.toString() ? `?${params.toString()}` : ''}`

    return api.get<Cliente[]>(url)
  },

  getById: (id: string) =>
    api.get<Cliente>(`/clientes/${id}`),

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

  exportToExcel: (buscar?: string) => 
    api.get(`/clientes/export/excel${buscar ? `?buscar=${buscar}` : ''}`, {
      responseType: 'blob'
    }),

  getPagosByCliente: (clienteId: string) => 
    api.get(`/pagos/cliente/${clienteId}`),

  getResumenFinanciero: (clienteId: string) => 
    api.get(`/clientes/${clienteId}/resumen-financiero`),

    importCsv: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return api.post('/clientes/import/csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
}