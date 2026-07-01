// frontend/src/features/perfil/types.ts

export interface PerfilFormData {
  nombre: string
  apellido: string
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

// ════════════════════════════════════════════════════════════════
// AGREGAR ESTOS TIPOS
// ════════════════════════════════════════════════════════════════

export interface MoraConfig {
  mora_activa: boolean
  mora_porcentaje: number
  mora_tipo: 'unica' | 'mensual'
}

export interface MonedaConfig {
  moneda_principal: 'ARS' | 'USD'
  mostrar_equivalencia: boolean
}

