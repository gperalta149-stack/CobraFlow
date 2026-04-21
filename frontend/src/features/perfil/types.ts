export interface PerfilFormData {
  nombre: string
  email: string
}

export interface PasswordFormData {
  passwordActual: string
  passwordNuevo: string
  confirmar: string
}

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: string
}