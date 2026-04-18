import { Link } from 'react-router-dom'
import PasswordInput from './PasswordInput'
import type { LoginForm, RegisterForm } from '../types'

interface AuthFormProps {
  form: LoginForm | RegisterForm
  loading: boolean
  error: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  isLogin?: boolean
}

export default function AuthForm({ 
  form, 
  loading, 
  error, 
  onChange, 
  onSubmit,
  isLogin = true 
}: AuthFormProps) {
  const title = isLogin ? "Iniciar sesión" : "Crear cuenta"
  const buttonText = loading ? (isLogin ? "Ingresando..." : "Creando cuenta...") : (isLogin ? "Ingresar" : "Crear cuenta")
  const footerText = isLogin ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"
  const footerLink = isLogin ? "/register" : "/login"
  const footerLinkText = isLogin ? "Crear cuenta" : "Iniciar sesión"

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500 mb-6">
        {isLogin ? "Accedé a tu cuenta" : "Empezá en menos de 1 minuto"}
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Solo mostrar campo nombre en registro */}
        {'nombre' in form && (
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={onChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={onChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <PasswordInput
          value={form.password}
          onChange={onChange}
          placeholder="Contraseña"
          name="password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {buttonText}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-6 text-center">
        {footerText}{' '}
        <Link to={footerLink} className="text-blue-600 hover:underline">
          {footerLinkText}
        </Link>
      </p>
    </>
  )
}