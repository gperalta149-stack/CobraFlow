// frontend/src/features/perfil/components/PerfilForm.tsx
import type { PerfilFormData } from '../types'

interface PerfilFormProps {
  form: PerfilFormData
  error: string
  exito: string
  isSubmitting: boolean
  rol: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
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

export function PerfilForm({ form, error, exito, isSubmitting, rol, onChange, onSubmit }: PerfilFormProps) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

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

      <div>
        <label style={labelStyle}>Nombre</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={onChange}
          style={inputStyle}
          required
          disabled={isSubmitting}
          onFocus={e => (e.target.style.borderColor = '#1D9E75')}
          onBlur={e => (e.target.style.borderColor = '#2e3347')}
        />
      </div>

      <div>
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          style={inputStyle}
          required
          disabled={isSubmitting}
          onFocus={e => (e.target.style.borderColor = '#1D9E75')}
          onBlur={e => (e.target.style.borderColor = '#2e3347')}
        />
      </div>

      <div style={{
        background: '#1a1d2e',
        border: '0.5px solid #2e3347',
        borderRadius: 8,
        padding: '10px 14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 12, color: '#6b7280' }}>Rol</span>
        <span style={{
          fontSize: 11, fontWeight: 600,
          background: 'rgba(29,158,117,0.15)',
          color: '#1D9E75',
          border: '0.5px solid rgba(29,158,117,0.3)',
          padding: '3px 8px', borderRadius: 6,
          textTransform: 'capitalize',
        }}>
          {rol}
        </span>
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
        }}
      >
        {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  )
}