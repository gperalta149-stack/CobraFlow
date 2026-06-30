// frontend/src/features/home/components/Features.tsx
import { useRef } from 'react'
import {
  IconUsers, IconFileInvoice, IconBell,
  IconChartBar, IconFlame, IconFileText,
} from '@tabler/icons-react'
import { H3, Text } from '../../../components/ui/Typography'
import { SectionHeader } from './SectionHeader'

interface Feature {
  icon: React.ReactNode
  iconColor: string
  iconBg: string
  title: string
  desc: string
  tag: string
  tagBg: string
  tagColor: string
}

const FEATURES: Feature[] = [
  {
    icon: <IconUsers size={26} />,
    iconColor: '#34d399', iconBg: 'rgba(29,158,117,.12)',
    title: 'Gestión de clientes',
    desc: 'Cartera completa con historial de pagos, deudas y alertas por cliente.',
    tag: 'Incluido', tagBg: 'rgba(29,158,117,.12)', tagColor: '#34d399',
  },
  {
    icon: <IconFileInvoice size={26} />,
    iconColor: '#60a5fa', iconBg: 'rgba(96,165,250,.12)',
    title: 'Control de deudas',
    desc: 'ARS y USD nativos con mora automática y vencimientos configurables.',
    tag: 'Multi-moneda', tagBg: 'rgba(96,165,250,.12)', tagColor: '#60a5fa',
  },
  {
    icon: <IconBell size={26} />,
    iconColor: '#fbbf24', iconBg: 'rgba(251,191,36,.12)',
    title: 'Alertas automáticas',
    desc: 'Notificaciones de vencimientos próximos, mora acumulada y deudas críticas.',
    tag: 'Tiempo real', tagBg: 'rgba(251,191,36,.12)', tagColor: '#fbbf24',
  },
  {
    icon: <IconChartBar size={26} />,
    iconColor: '#fb923c', iconBg: 'rgba(251,146,60,.12)',
    title: 'Análisis avanzado',
    desc: 'Dashboard con evolución, recuperación y proyección de cobros futuros.',
    tag: 'Análisis', tagBg: 'rgba(251,146,60,.12)', tagColor: '#fb923c',
  },
  {
    icon: <IconFlame size={26} />,
    iconColor: '#f87171', iconBg: 'rgba(248,113,113,.12)',
    title: 'Mora configurable',
    desc: 'Recargo mensual o único que se calcula solo sobre deudas vencidas.',
    tag: 'Automático', tagBg: 'rgba(248,113,113,.12)', tagColor: '#f87171',
  },
  {
    icon: <IconFileText size={26} />,
    iconColor: '#a78bfa', iconBg: 'rgba(167,139,250,.12)',
    title: 'Comprobantes PDF',
    desc: 'Generá comprobantes de pago profesionales con un solo clic.',
    tag: 'Exportable', tagBg: 'rgba(167,139,250,.12)', tagColor: '#a78bfa',
  },
]

function FeatureCard({ feature }: { feature: Feature }) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    cardRef.current.style.transform   = `translateY(-10px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale(1.02)`
    cardRef.current.style.borderColor = 'rgba(29,158,117,.45)'
    cardRef.current.style.boxShadow   = '0 24px 48px rgba(0,0,0,.45)'
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform   = ''
    cardRef.current.style.borderColor = ''
    cardRef.current.style.boxShadow   = ''
  }

  const handleMouseEnter = () => {
    if (!shineRef.current) return
    shineRef.current.style.transition = 'none'
    shineRef.current.style.left       = '-100%'
    void shineRef.current.offsetWidth
    shineRef.current.style.transition = 'left .55s ease'
    shineRef.current.style.left       = '160%'
  }

  return (
    <div
      ref={cardRef}
      className="feature-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div ref={shineRef} className="feature-card-shine" />

      <div className="feature-icon" style={{ background: feature.iconBg, color: feature.iconColor }}>
        {feature.icon}
      </div>

      {/* H3 con override de tamaño — el app usa 14px, la card necesita 17px */}
      <H3 className="feature-title" style={{ fontSize: 17 }}>
        {feature.title}
      </H3>

      <Text className="feature-desc" style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>
        {feature.desc}
      </Text>

      <span className="feature-tag" style={{ background: feature.tagBg, color: feature.tagColor }}>
        {feature.tag}
      </span>
    </div>
  )
}

export function Features() {
  return (
    <section className="features-section">
      <SectionHeader
        eyebrow="Funcionalidades"
        title="Todo lo que necesitás"
        subtitle="Diseñado para PyMEs argentinas que quieren cobrar mejor"
      />
      <div className="features-grid">
        {FEATURES.map((f, i) => <FeatureCard key={i} feature={f} />)}
      </div>
    </section>
  )
}