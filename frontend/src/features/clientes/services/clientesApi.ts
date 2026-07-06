import api from '../../../services/api'
import type { Cliente, ClienteFormData } from '../types'

export const clientesApi = {
  getAll: (buscar?: string, page?: number, limit?: number) => {
    const params = new URLSearchParams()
    if (buscar) params.append('buscar', buscar)
    params.append('page', (page ?? 1).toString())
    params.append('limit', (limit ?? 500).toString())
    const url = `/clientes?${params.toString()}`
    return api.get<Cliente[]>(url)
  },

  // NUEVO: Obtener clientes archivados
  getArchivados: (buscar?: string, page?: number, limit?: number) => {
    const params = new URLSearchParams()
    if (buscar) params.append('buscar', buscar)
    params.append('page', (page ?? 1).toString())
    params.append('limit', (limit ?? 500).toString())
    const url = `/clientes/archivados?${params.toString()}`
    return api.get<Cliente[]>(url)
  },

  getById: (id: string) => api.get<Cliente>(`/clientes/${id}`),

  create: (data: ClienteFormData) => {
    console.log('📤 Enviando datos:', data)
    return api.post('/clientes', {
      nombre: data.nombre?.trim(),
      apellido: data.apellido?.trim(),
      dni: data.dni?.trim(),
      email: data.email?.trim() || null,
      telefono: data.telefono?.trim() || null,
      direccion: data.direccion?.trim() || null,
      ciudad: data.ciudad?.trim() || null,
      provincia: data.provincia?.trim() || null,
      empresa: data.empresa?.trim() || null,
      observaciones: data.observaciones?.trim() || null
    })
  },

  update: (id: string, data: ClienteFormData) =>
    api.put(`/clientes/${id}`, {
      nombre: data.nombre?.trim(),
      apellido: data.apellido?.trim(),
      dni: data.dni?.trim(),
      email: data.email?.trim() || null,
      telefono: data.telefono?.trim() || null,
      direccion: data.direccion?.trim() || null,
      ciudad: data.ciudad?.trim() || null,
      provincia: data.provincia?.trim() || null,
      empresa: data.empresa?.trim() || null,
      observaciones: data.observaciones?.trim() || null
    }),

  // NUEVO: Archivar cliente (soft delete)
  archivar: (id: string) => api.post(`/clientes/${id}/archivar`),

  // NUEVO: Restaurar cliente archivado
  restaurar: (id: string) => api.post(`/clientes/${id}/restaurar`),

  // ❌ ELIMINAR este método (ya no se usa)
  // delete: (id: string) => api.delete(`/clientes/${id}`),

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
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}