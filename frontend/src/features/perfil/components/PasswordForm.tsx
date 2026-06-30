// frontend/src/features/perfil/components/PasswordForm.tsx
import { useState } from 'react'
import { IconEye, IconEyeOff, IconLock, IconCheck, IconX } from '@tabler/icons-react'
import type { PasswordFormData } from '../types'

interface PasswordFormProps {
  form: PasswordFormData
  error: string
  exito: string
  isSubmitting: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#1a1d2e',
  border: '0.5px solid #2e3347',
  borderRadius: 8,
  padding: '10px 40px 10px 14px',
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

type FieldKey = 'actual' | 'nuevo' | 'confirmar'

function getFuerza(password: string): { label: string; color: string; pct: number } {
  if (!password) return { label: '', color: '#2e3347', pct: 0 }
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { label: 'Débil', color: '#E24B4A', pct: 25 }
  if (score <= 3) return { label: 'Media', color: '#EF9F27', pct: 60 }
  return { label: 'Fuerte', color: '#1D9E75', pct: 100 }
}

export function PasswordForm({
  form, error, exito, isSubmitting, onChange, onSubmit,
}: PasswordFormProps) {
  const [showPassword, setShowPassword] = useState<Record<FieldKey, boolean>>({
    actual: false, nuevo: false, confirmar: false,
  })

  const toggleShow = (field: FieldKey) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const fuerza = getFuerza(form.passwordNuevo)
  const coincide = form.confirmar.length > 0 && form.passwordNuevo === form.confirmar
  const noCoincide = form.confirmar.length > 0 && form.passwordNuevo !== form.confirmar

  const PasswordInput = ({ field, name, placeholder, value, label }: {
    field: FieldKey; name: string; placeholder: string; value: string; label: string
  }) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={showPassword[field] ? 'text' : 'password'}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          disabled={isSubmitting}
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = '#1D9E75')}
          onBlur={e => (e.target.style.borderColor = '#2e3347')}
        />
        <button
          type="button"
          onClick={() => toggleShow(field)}
          style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6b7280', display: 'flex', alignItems: 'center', padding: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f0f2f5')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
        >
          {showPassword[field] ? <IconEyeOff size={16} /> : <IconEye size={16} />}
        </button>
      </div>
    </div>
  )

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <div style={{ padding: 6, background: '#1D9E7520', borderRadius: 8, color: '#1D9E75', display: 'flex' }}>
          <IconLock size={16} />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', margin: 0 }}>Cambiar contraseña</p>
          <p style={{ fontSize: 11, color: '#6b7280', marginTop: 1 }}>Usá una contraseña segura y única</p>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(226,75,74,0.1)', border: '0.5px solid rgba(226,75,74,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f87171' }}>
          {error}
        </div>
      )}

      {exito && (
        <div style={{ background: 'rgba(29,158,117,0.1)', border: '0.5px solid rgba(29,158,117,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#34d399' }}>
          ✓ {exito}
        </div>
      )}

      <PasswordInput
        field="actual" name="passwordActual" label="Contraseña actual"
        placeholder="Tu contraseña actual" value={form.passwordActual}
      />

      <div>
        <PasswordInput
          field="nuevo" name="passwordNuevo" label="Nueva contraseña"
          placeholder="Mínimo 6 caracteres" value={form.passwordNuevo}
        />

        {/* Barra de fuerza */}
        {form.passwordNuevo.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ height: 4, background: '#1a1d2e', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                width: `${fuerza.pct}%`, height: '100%',
                background: fuerza.color, borderRadius: 2,
                transition: 'width 0.2s, background 0.2s',
              }} />
            </div>
            <p style={{ fontSize: 11, color: fuerza.color, marginTop: 4, fontWeight: 500 }}>
              Seguridad: {fuerza.label}
            </p>
          </div>
        )}
      </div>

      <div>
        <PasswordInput
          field="confirmar" name="confirmar" label="Confirmar nueva contraseña"
          placeholder="Repetí la nueva contraseña" value={form.confirmar}
        />
        {(coincide || noCoincide) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
            {coincide ? (
              <>
                <IconCheck size={13} color="#1D9E75" />
                <span style={{ fontSize: 11, color: '#1D9E75' }}>Las contraseñas coinciden</span>
              </>
            ) : (
              <>
                <IconX size={13} color="#E24B4A" />
                <span style={{ fontSize: 11, color: '#E24B4A' }}>Las contraseñas no coinciden</span>
              </>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          backgroundColor: '#1D9E75',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '10px 0',
          fontSize: 13,
          fontWeight: 600,
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.6 : 1,
          marginTop: 4,
          transition: 'opacity 0.15s',
        }}
      >
        {isSubmitting ? 'Cambiando...' : 'Cambiar contraseña'}
      </button>
    </form>
  )
}