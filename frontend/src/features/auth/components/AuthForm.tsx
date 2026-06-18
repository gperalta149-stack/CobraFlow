// frontend/src/features/auth/components/AuthForm.tsx
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import type { LoginForm, RegisterForm } from '../types'

interface AuthFormProps {
  form: LoginForm | RegisterForm
  loading: boolean
  error: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  isLogin?: boolean
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#1a1d2e',
  border: '0.5px solid #2e3347',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 13,
  color: '#f0f2f5',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 6,
  display: 'block',
}

export default function AuthForm({ 
  form, 
  loading, 
  error, 
  onChange, 
  onSubmit,
  isLogin = true 
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  const title = isLogin ? "Bienvenido de nuevo" : "Crear cuenta"
  const subtitle = isLogin ? "Ingresá tus credenciales para continuar" : "Completá los datos para comenzar"
  const buttonText = loading 
    ? (isLogin ? "Ingresando..." : "Creando cuenta...") 
    : (isLogin ? "Ingresar" : "Crear cuenta")
  const footerText = isLogin ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"
  const footerLink = isLogin ? "/register" : "/login"
  const footerLinkText = isLogin ? "Registrate" : "Ingresá"

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#1D9E75'
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#2e3347'
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f0f2f5', marginBottom: 6, letterSpacing: '-0.3px' }}>
          {title}
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          {subtitle}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(226,75,74,0.1)',
          border: '0.5px solid rgba(226,75,74,0.3)',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: 13,
          color: '#f87171',
          marginBottom: 20,
        }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Campos para registro */}
        {!isLogin && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Nombre</label>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={'nombre' in form ? form.nombre : ''}
                onChange={onChange}
                style={inputStyle}
                required
                disabled={loading}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <label style={labelStyle}>Apellido</label>
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={'apellido' in form ? form.apellido : ''}
                onChange={onChange}
                style={inputStyle}
                disabled={loading}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={onChange}
            style={inputStyle}
            required
            disabled={loading}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Password - con toggle mostrar/ocultar */}
        <div>
          <label style={labelStyle}>Contraseña</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Tu contraseña"
              value={form.password ?? ''}
              onChange={onChange}
              style={inputStyle}
              required
              disabled={loading}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                fontSize: 12,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f0f2f5')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
            >
              {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: '#1D9E75',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '11px 0',
            fontSize: 13,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            marginTop: 4,
            transition: 'opacity 0.15s, transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(29,158,117,0.3)'
            }
          }}
          onMouseLeave={e => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }
          }}
        >
          {buttonText}
        </button>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 4 }}>
          {footerText}{' '}
          <Link 
            to={footerLink} 
            style={{ color: '#1D9E75', fontWeight: 600, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
          >
            {footerLinkText}
          </Link>
        </p>
      </form>
    </div>
  )
}