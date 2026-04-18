export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: string
}

export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  nombre: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  usuario: Usuario
}