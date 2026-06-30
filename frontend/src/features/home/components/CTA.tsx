// frontend/src/features/home/components/CTA.tsx
import { useNavigate } from 'react-router-dom'
import { IconRocket } from '@tabler/icons-react'
import { DisplayHeading, TextMuted } from '../../../components/ui/Typography'

export function CTA() {
  const navigate = useNavigate()

  return (
    <section className="cta-section">
      <div className="cta-card">
        <div className="cta-orb" style={{ background: 'rgba(29,158,117,.06)',  top: -80,  right: -60, animationDuration: '4s' }} />
        <div className="cta-orb" style={{ background: 'rgba(96,165,250,.04)', bottom: -50, left: -40, animationDuration: '5s', animationDelay: '1s' }} />

        <DisplayHeading
          className="cta-title"
          style={{ fontSize: 32, letterSpacing: '-.5px' }}
        >
          Dejá de perder dinero por desorden
        </DisplayHeading> <br />

        <TextMuted
          className="cta-subtitle"
          style={{ fontSize: 16, lineHeight: 1.6 }}
        >
          Sin costos ocultos. Sin complicaciones. Empezá hoy.
        </TextMuted> <br />

        <div className="cta-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <button className="cta-btn" onClick={() => navigate('/register')}>
            <IconRocket size={18} /> Crear cuenta gratis
          </button>
          
          {/* Botón secundario agregado para mejorar la UX de usuarios recurrentes */}
          <button 
            className="cta-link" 
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}
          >
            ¿Ya tenés una cuenta? Iniciá sesión
          </button>
        </div>
      </div>
    </section>
  )
}