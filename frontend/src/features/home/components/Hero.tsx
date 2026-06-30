// frontend/src/features/home/components/Hero.tsx
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconRocket } from '@tabler/icons-react'
import { DisplayHeading, TextSmall } from '../../../components/ui/Typography'

function animateMoney(el: HTMLElement, target: number, duration: number) {
  const start = Date.now()
  const update = () => {
    const progress = Math.min((Date.now() - start) / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3)
    el.textContent = '$' + Math.round(target * ease).toLocaleString('es-AR')
    if (progress < 1) requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}

function animatePct(el: HTMLElement, target: number, duration: number) {
  const start = Date.now()
  const update = () => {
    const progress = Math.min((Date.now() - start) / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3)
    el.textContent = Math.round(target * ease) + '%'
    if (progress < 1) requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}

const KPI_ITEMS = [
  { label: 'Recaudado',    color: '#34d399', init: '$0' },
  { label: 'Pendiente',    color: '#f87171', init: '$0' },
  { label: 'Recuperación', color: '#60a5fa', init: '0%' },
] as const

const BAR_ITEMS = [
  { label: 'En término', pct: '72%', width: '72%', color: '#34d399', delay: '.9s' },
  { label: 'Atrasado',   pct: '18%', width: '18%', color: '#f87171', delay: '1.1s' },
  { label: 'En Mora',    pct: '10%', width: '10%', color: '#fb923c', delay: '1.3s' },
] as const

export function Hero() {
  const navigate = useNavigate()
  const v1Ref = useRef<HTMLDivElement>(null)
  const v2Ref = useRef<HTMLDivElement>(null)
  const v3Ref = useRef<HTMLDivElement>(null)
  const refs = [v1Ref, v2Ref, v3Ref]

  useEffect(() => {
    const timer = setTimeout(() => {
      if (v1Ref.current) animateMoney(v1Ref.current, 847500, 1400)
      if (v2Ref.current) animateMoney(v2Ref.current, 320000, 1400)
      if (v3Ref.current) animatePct(v3Ref.current, 72, 1400)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="hero-section">
      <div className="home-orb" style={{ width: 420, height: 420, background: 'rgba(29,158,117,.07)', top: -120, left: '50%', transform: 'translateX(-50%)', animationDuration: '4s' }} />
      <div className="home-orb" style={{ width: 240, height: 240, background: 'rgba(96,165,250,.05)', top: 20, right: '4%', animationDuration: '5s', animationDelay: '1s' }} />
      <div className="home-orb" style={{ width: 180, height: 180, background: 'rgba(251,191,36,.04)', top: 60, left: '4%', animationDuration: '6s', animationDelay: '2s' }} />

      <div className="hero-badge home-fade-up">
        <span className="hero-badge-dot" />
        Plataforma de cobranza inteligente para PyMEs
      </div>

      <DisplayHeading
        className="hero-title home-fade-up delay-1"
        style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-1.5px' }}
      >
        Gestioná tus <span className="hero-accent">cobranzas</span>
        <br />sin esfuerzo
      </DisplayHeading><br></br>


      {/*<Text
        className="hero-subtitle home-fade-up delay-2"
        style={{ fontSize: 19, color: '#94a3b8', maxWidth: 580, lineHeight: 1.7 }}
      >
        Control total de deudas, pagos y clientes en un solo lugar.
        Automatizá tu negocio y aumentá tu recaudación.
      </Text>*/}

      <div className="hero-buttons home-fade-up delay-3">
        <button className="hero-btn-primary" onClick={() => navigate('/register')}>
          <IconRocket size={18} /> Comenzar gratis
        </button>
        <button className="hero-btn-secondary" onClick={() => navigate('/login')}>
          Ya tengo cuenta
        </button>
      </div>

      <div className="hero-dashboard-wrap home-fade-up delay-4">
        <div className="hero-dashboard">
          <div className="hero-db-card">
            <div className="hero-db-shimmer" />

            <div className="hero-db-top">
              <TextSmall className="hero-db-title" style={{ fontSize: 14, color: '#94a3b8' }}>
                Panel de cobranzas
              </TextSmall>
              <span className="hero-live">
                <span className="hero-live-dot" /> En vivo
              </span>
            </div>

            <div className="hero-kpi-grid">
              {KPI_ITEMS.map(({ label, color, init }, i) => (
                <div key={label} className="hero-kpi-item">
                  <TextSmall className="hero-kpi-label">{label}</TextSmall>
                  <div ref={refs[i]} className="hero-kpi-value" style={{ color }}>{init}</div>
                </div>
              ))}
            </div>

            <div className="hero-bar-row">
              {BAR_ITEMS.map(({ label, pct, width, color, delay }) => (
                <div key={label} className="hero-bar-item">
                  <TextSmall className="hero-bar-label" style={{ fontSize: 12, color: '#94a3b8', width: 60 }}>
                    {label}
                  </TextSmall>
                  <div className="hero-bar-track">
                    <div className="hero-bar-fill" style={{ width, background: color, animationDelay: delay }} />
                  </div>
                  <TextSmall className="hero-bar-pct" style={{ fontSize: 12, color: '#94a3b8', width: 32, textAlign: 'right' }}>
                    {pct}
                  </TextSmall>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}