import api from '../../../services/api'
import type { LoginForm, RegisterForm, AuthResponse } from '../types'

export const authApi = {
  login: (data: LoginForm) => 
    api.post<AuthResponse>('/auth/login', {
      email: data.email.trim(),
      password: data.password
    }),
  
  register: (data: RegisterForm) => 
    api.post('/auth/register', {
      nombre: data.nombre.trim(),
      apellido: data.apellido.trim(),  // ← AGREGAR
      email: data.email.trim(),
      password: data.password
    }),
  
  updateProfile: (data: { nombre: string; apellido: string; email: string }) => 
    api.put('/auth/perfil', data),
  
  changePassword: (data: { passwordActual: string; passwordNuevo: string }) => 
    api.put('/auth/cambiar-password', data),
}