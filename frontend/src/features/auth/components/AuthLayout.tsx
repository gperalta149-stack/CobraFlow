
import type { ReactNode } from 'react'
import { LoginVideo } from './LoginVideo'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <style>{`
        .auth-layout {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background-color: #0f1117;
        }

        .auth-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px;
          background: linear-gradient(135deg, #0f1117 0%, #141824 100%);
          border-right: 0.5px solid #2e3347;
          position: relative;
          overflow: hidden;
        }

        .auth-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 64px;
          background-color: #0f1117;
        }

        .auth-video {
          flex: 1;
          min-height: 320px;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        .auth-logo {
          width: 46px;
          height: 46px;
          object-fit: contain;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .auth-layout {
            grid-template-columns: 1fr;
          }

          .auth-left {
            padding: 28px 24px 20px;
            border-right: none;
            border-bottom: 0.5px solid #2e3347;
          }

          .auth-video {
            min-height: 180px;
            max-height: 220px;
          }

          .auth-tagline {
            margin-top: 16px !important;
          }

          .auth-right {
            padding: 32px 24px;
          }
        }

        @media (max-width: 420px) {
          .auth-video {
            min-height: 140px;
          }
        }
      `}</style>

      <div className="auth-layout">

        {/* Panel izquierdo — video animado */}
        <div className="auth-left">

          {/* Círculos decorativos de fondo */}
          <div style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(29,158,117,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(55,138,221,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Logo CobraFlow */}
          <div style={{ marginBottom: 32, position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 8,
            }}>
              <img
                src="/branding/cobraflow-cobra.png"
                alt="CobraFlow"
                className="auth-logo"
              />

              <span style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#f0f2f5',
                letterSpacing: '-0.3px',
              }}>
                CobraFlow
              </span>
            </div>

            <p style={{
              fontSize: 13,
              color: '#6b7280',
              margin: 0,
            }}>
              Sistema de gestión de cobranzas
            </p>
          </div>

          {/* Video */}
          <div className="auth-video">
            <LoginVideo />
          </div>

          {/* Frase elegante */}
          <div
            className="auth-tagline"
            style={{
              marginTop: 24,
              textAlign: 'center',
              padding: '12px 20px',
              borderTop: '0.5px solid rgba(255,255,255,0.06)',
            }}
          >
            <p style={{
              fontSize: 13,
              color: '#6b7280',
              letterSpacing: '0.04em',
              margin: 0,
            }}>
              La forma más inteligente de gestionar tus cobranzas
            </p>
          </div>
        </div>

        {/* Panel derecho — formulario */}
        <div className="auth-right">
          <div style={{ width: '100%', maxWidth: 400 }}>
            {children}
          </div>
        </div>

      </div>
    </>
  )
}
