// frontend/src/features/auth/components/AuthLayout.tsx
import type { ReactNode } from 'react'
import { LoginVideo } from './LoginVideo'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      backgroundColor: '#0f1117',
    }}>
      {/* Panel izquierdo — video animado */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 48px',
        background: 'linear-gradient(135deg, #0f1117 0%, #141824 100%)',
        borderRight: '0.5px solid #2e3347',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Círculo decorativo de fondo */}
        <div style={{
          position: 'absolute', top: -120, right: -120,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(29,158,117,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: -80,
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(55,138,221,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo y tagline */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#1D9E75',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>C</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#f0f2f5', letterSpacing: '-0.3px' }}>
              CobraFlow
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#6b7280' }}>Sistema de gestión de cobranzas</p>
        </div>

        {/* Video */}
        <div style={{
          flex: 1,
          minHeight: 320,
          borderRadius: 16,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <LoginVideo />
        </div>

        {/* Features rápidas abajo del video */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 24,
          gap: 16,
        }}>
          {[
            { icon: '📊', text: 'Dashboard' },
            { icon: '⚠️', text: 'Alertas' },
            { icon: '💱', text: 'ARS / USD' },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#1a1d2e',
              padding: '8px 14px',
              borderRadius: 8,
              border: '0.5px solid #2e3347',
            }}>
              <span style={{ fontSize: 14 }}>{f.icon}</span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 64px',
        backgroundColor: '#0f1117',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {children}
        </div>
      </div>
    </div>
  )
}