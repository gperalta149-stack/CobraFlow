// frontend/src/features/home/components/CTA.tsx
import { useNavigate } from 'react-router-dom'
import { IconRocket } from '@tabler/icons-react'

export function CTA() {
  const navigate = useNavigate()
  return (
    <section style={{ padding: '64px 48px', textAlign: 'center' }}>
      <div style={{ background: '#1a1d2e', border: '0.5px solid rgba(29,158,117,0.3)', borderRadius: 16, padding: '48px', maxWidth: 520, margin: '0 auto' }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#f0f2f5', marginBottom: 10, letterSpacing: '-0.3px' }}>
          Dejá de perder dinero por desorden
        </h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>Sin costos ocultos. Sin complicaciones. Empezá hoy.</p>
        <button
          onClick={() => navigate('/register')}
          style={{ padding: '12px 28px', fontSize: 13, fontWeight: 600, background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 9, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <IconRocket size={15} /> Crear cuenta gratis
        </button>
      </div>
    </section>
  )
}