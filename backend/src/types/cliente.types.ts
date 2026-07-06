export interface ClienteInsert {
  usuario_id: string
  nombre: string
  apellido: string
  dni: string
  telefono: string
  email: string | null
  direccion: string | null
  ciudad: string | null
  provincia: string | null
  empresa: string | null
  observaciones: string | null
}

export interface ClienteUpdate {
  updated_at: Date
  nombre?: string
  apellido?: string
  dni?: string
  email?: string | null
  telefono?: string | null
  direccion?: string | null
  ciudad?: string | null
  provincia?: string | null
  empresa?: string | null
  observaciones?: string | null
}

export interface ClienteBasico {
  id: string
  nombre: string
  apellido: string
  activo?: boolean
  dni?: string
}