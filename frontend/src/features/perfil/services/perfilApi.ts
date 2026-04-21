import api from '../../../services/api'
import type { PerfilFormData, PasswordFormData } from '../types'

export const perfilApi = {
  updatePerfil: (data: PerfilFormData) => 
    api.put('/auth/perfil', data),
  
  changePassword: (data: Omit<PasswordFormData, 'confirmar'>) => 
    api.put('/auth/cambiar-password', {
      passwordActual: data.passwordActual,
      passwordNuevo: data.passwordNuevo
    }),
}