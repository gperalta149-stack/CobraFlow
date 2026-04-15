import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface Usuario {
  id: string
  nombre: string
  email: string
  rol: string
}

interface AuthContextType {
  usuario: Usuario | null
  token: string | null
  loading: boolean
  login: (token: string, usuario: Usuario) => void
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // 🔹 Cargar sesión al iniciar
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token')
      const storedUsuario = localStorage.getItem('usuario')

      if (storedToken && storedUsuario) {
        setToken(storedToken)
        setUsuario(JSON.parse(storedUsuario))
      }
    } catch (error) {
      console.error('Error cargando sesión:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
    } finally {
      setLoading(false)
    }
  }, [])

  // 🔹 Login
  const login = (newToken: string, newUsuario: Usuario) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('usuario', JSON.stringify(newUsuario))
    setToken(newToken)
    setUsuario(newUsuario)
  }

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setToken(null)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        loading,
        login,
        logout,
        isAdmin: usuario?.rol === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// 🔹 Hook seguro
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (context === null) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return context
}