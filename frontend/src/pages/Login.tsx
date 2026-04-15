import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { handleApiError } from '../utils/handleApiError'

interface LoginResponse {
  token: string
  usuario: {
    id: string
    nombre: string
    email: string
    rol: string
  }
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  
  // 🔹 Mejora 4: Auto-focus (UX pro)
  const emailInputRef = useRef<HTMLInputElement>(null)
  
  useEffect(() => {
    emailInputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 🔹 Mejora 1: Evitar doble submit REAL
    if (loading) return
    
    setLoading(true)
    setError('')
    
    // 🔹 Mejora 2: Trim del email (detalle fino)
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    
    // Validación rápida antes de enviar
    if (!trimmedEmail || !trimmedPassword) {
      setError('Por favor complete todos los campos')
      setLoading(false)
      return
    }
    
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', { 
        email: trimmedEmail, 
        password: trimmedPassword 
      })
      login(data.token, data.usuario)
      navigate('/dashboard')
    } catch (err) {
      // 🔹 Mejora 3: Manejo de errores específicos
      // El handleApiError ya maneja 401 automáticamente
      setError(handleApiError(err, 'Credenciales incorrectas'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">CobraFlow</h1>
        <p className="text-center text-gray-500 mb-6">Sistema de Gestión de Cobranza</p>
        
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              ref={emailInputRef} // 🔹 Mejora 4: Auto-focus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@cobraflow.com"
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loading}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ingresando...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-500 mt-4">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  )
}