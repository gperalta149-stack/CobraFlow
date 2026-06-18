// frontend/src/features/perfil/pages/Perfil.tsx
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'
import { usePerfil } from '../hooks/usePerfil'
import { usePassword } from '../hooks/usePassword'
import { PerfilForm } from '../components/PerfilForm'
import { PasswordForm } from '../components/PasswordForm'

type Tab = 'perfil' | 'contrasena'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'perfil',     label: 'Datos personales', icon: 'ti-user' },
  { id: 'contrasena', label: 'Contraseña',        icon: 'ti-lock' },
]

export default function Perfil() {
  const { usuario } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') as Tab) ?? 'perfil'

  const perfil   = usePerfil()
  const password = usePassword()

  const setTab = (tab: Tab) => setSearchParams({ tab })

  const initials = usuario
    ? `${usuario.nombre?.[0] ?? ''}${usuario.apellido?.[0] ?? ''}`.toUpperCase()
    : '?'

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '24px' }}>

      {/* Avatar + nombre */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: '#1D9E75',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700, color: '#fff', flexShrink: 0,
        }}>
          {initials}
        </div>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: '#f0f2f5', margin: 0 }}>
            {usuario?.nombre} {usuario?.apellido}
          </h1>
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{usuario?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4,
        background: '#1a1d2e',
        borderRadius: 10, padding: 4,
        marginBottom: 20,
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            style={{
              flex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '7px 12px',
              borderRadius: 7,
              fontSize: 13, fontWeight: 500,
              border: 'none', cursor: 'pointer',
              transition: 'all 0.15s',
              background: activeTab === tab.id ? '#242938' : 'transparent',
              color: activeTab === tab.id ? '#f0f2f5' : '#6b7280',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
            }}
          >
            <i className={`ti ${tab.icon}`} style={{ fontSize: 14 }} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div style={{
        backgroundColor: '#242938',
        border: '0.5px solid #2e3347',
        borderRadius: 12,
        padding: '24px',
      }}>
        {activeTab === 'perfil' && (
          <PerfilForm
            form={perfil.formPerfil}
            error={perfil.error}
            exito={perfil.exito}
            isSubmitting={perfil.isSubmitting}
            rol={usuario?.rol ?? ''}
            onChange={perfil.handleChange}
            onSubmit={perfil.handleSubmit}
          />
        )}
        {activeTab === 'contrasena' && (
          <PasswordForm
            form={password.formPassword}
            error={password.error}
            exito={password.exito}
            isSubmitting={password.isSubmitting}
            onChange={password.handleChange}
            onSubmit={password.handleSubmit}
          />
        )}
      </div>
    </div>
  )
}