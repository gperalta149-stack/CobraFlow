export interface Cliente {
  id: string
  nombre: string
  email: string
  telefono: string
  direccion: string
  activo: boolean
}

export interface ClienteFormData {
  nombre: string
  email: string
  telefono: string
  direccion: string
}

export interface ClienteFilters {
  buscar: string
}