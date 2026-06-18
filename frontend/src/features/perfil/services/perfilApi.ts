// frontend/src/features/perfil/services/perfilApi.ts
import api from '../../../services/api'
import type { PerfilFormData, PasswordFormData } from '../types'

export interface MoraConfig {
  mora_activa: boolean
  mora_porcentaje: number
  mora_tipo: 'mensual' | 'unica'
}

export interface ConfiguracionMoneda {
  mostrarEquivalencias: boolean
  mostrarUsdEnArs: boolean
  mostrarArsEnUsd: boolean
  secciones: {
    dashboard: boolean
    deudas: boolean
    pagos: boolean
    analisis: boolean
  }
}

export const perfilApi = {
  // Perfil
  updatePerfil: (data: PerfilFormData) =>
    api.put('/auth/perfil', data),

  changePassword: (data: Omit<PasswordFormData, 'confirmar'>) =>
    api.put('/auth/cambiar-password', {
      passwordActual: data.passwordActual,
      passwordNuevo: data.passwordNuevo
    }),

  // Configuración de mora
  getMora: () =>
    api.get<MoraConfig>('/auth/mora'),

  updateMora: (data: MoraConfig) =>
    api.put('/auth/mora', data),

  // Configuración de moneda (NUEVO)
  getConfiguracionMoneda: () =>
    api.get<ConfiguracionMoneda>('/auth/moneda'),

  updateConfiguracionMoneda: (data: ConfiguracionMoneda) =>
    api.put('/auth/moneda', data),
}