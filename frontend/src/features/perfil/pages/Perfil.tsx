// frontend/src/features/perfil/pages/Perfil.tsx
import { useSearchParams } from 'react-router-dom'
import { IconUser, IconLock, IconMail, IconShieldCheck } from '@tabler/icons-react'
import { useAuth } from '../../auth/context/AuthContext'
import { usePerfil } from '../hooks/usePerfil'
import { usePassword } from '../hooks/usePassword'
import { PerfilForm } from '../components/PerfilForm'
import { PasswordForm } from '../components/PasswordForm'

type Tab = 'perfil' | 'contrasena'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'perfil',     label: 'Datos personales', icon: IconUser },
  { id: 'contrasena', label: 'Contraseña',        icon: IconLock },
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
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px' }}>

      {/* ── Hero card del usuario ── */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #1a2d26 0%, #1a1d2e 60%)',
        border: '0.5px solid #2e3347',
        borderRadius: 16,
        padding: '32px 28px',
        marginBottom: 24,
        overflow: 'hidden',
      }}>
        {/* glow decorativo */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(29,158,117,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1D9E75 0%, #15a877 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 700, color: '#fff', flexShrink: 0,
            boxShadow: '0 8px 24px rgba(29,158,117,0.35)',
            border: '3px solid rgba(29,158,117,0.25)',
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.2px' }}>
              {usuario?.nombre} {usuario?.apellido}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <IconMail size={13} color="#6b7280" />
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{usuario?.email}</p>
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              marginTop: 10, fontSize: 11, fontWeight: 600,
              background: 'rgba(29,158,117,0.15)',
              color: '#34d399',
              border: '0.5px solid rgba(29,158,117,0.3)',
              padding: '4px 10px', borderRadius: 20,
              textTransform: 'capitalize',
            }}>
              <IconShieldCheck size={12} />
              {usuario?.rol}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        display: 'flex', gap: 4,
        background: '#1a1d2e',
        border: '0.5px solid #2e3347',
        borderRadius: 12, padding: 4,
        marginBottom: 20,
      }}>
        {TABS.map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                padding: '9px 14px',
                borderRadius: 9,
                fontSize: 13, fontWeight: 600,
                border: 'none', cursor: 'pointer',
                transition: 'all 0.18s ease',
                background: active ? '#242938' : 'transparent',
                color: active ? '#f0f2f5' : '#6b7280',
                boxShadow: active ? '0 2px 8px rgba(0,0,0,0.35)' : 'none',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#94a3b8' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#6b7280' }}
            >
              <Icon size={15} color={active ? '#1D9E75' : 'currentColor'} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ── Contenido ── */}
      <div style={{
        backgroundColor: '#242938',
        border: '0.5px solid #2e3347',
        borderRadius: 14,
        padding: '28px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
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