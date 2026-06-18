// frontend/src/features/home/components/Hero.tsx
import { useNavigate } from 'react-router-dom'
import { IconArrowRight } from '@tabler/icons-react'

export function Hero() {
  const navigate = useNavigate()
  return (
    <section style={{ padding: '80px 48px 64px', textAlign: 'center' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'rgba(29,158,117,0.12)', border: '0.5px solid rgba(29,158,117,0.3)',
        color: '#1D9E75', fontSize: 11, fontWeight: 600,
        padding: '4px 14px', borderRadius: 20, marginBottom: 28,
      }}>
        <IconArrowRight size={12} /> Plataforma de cobranza inteligente
      </div>

      <h1 style={{ fontSize: 48, fontWeight: 700, color: '#f0f2f5', lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: 20 }}>
        Gestioná tus{' '}
        <span style={{ color: '#1D9E75' }}>cobranzas</span>
        {' '}sin esfuerzo
      </h1>

      <p style={{ fontSize: 17, color: '#6b7280', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.6 }}>
        Control total de deudas, pagos y clientes en un solo lugar.
        Automatizá tu negocio y aumentá tu recaudación.
      </p>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/register')}
          style={{ padding: '12px 28px', fontSize: 14, fontWeight: 600, background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}
        >
          Comenzar ahora
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{ padding: '12px 28px', fontSize: 14, fontWeight: 500, background: 'transparent', color: '#94a3b8', border: '0.5px solid #2e3347', borderRadius: 10, cursor: 'pointer' }}
        >
          Ya tengo cuenta
        </button>
      </div>
    </section>
  )
}