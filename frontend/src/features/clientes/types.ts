export interface Cliente {
  id: string
  nombre: string
  apellido: string
  dni: string
  email: string | null
  telefono: string | null
  direccion: string | null
  ciudad: string | null
  provincia: string | null
  empresa: string | null
  observaciones: string | null
  activo: boolean
  created_at: string
  updated_at: string
  total_deudas: number
  estadoDeuda?: 'pendiente' | 'parcial' | 'pagada' | 'vencida' | null
}

export interface ClienteFormData {
  nombre: string
  apellido: string
  dni: string
  email: string | null
  telefono: string | null
  direccion: string | null
  ciudad: string | null
  provincia: string | null
  empresa: string | null
  observaciones: string | null
}

export interface ClienteFilters {
  buscar: string
}