// frontend/src/features/home/components/ProductShowcase.tsx
import { useState } from 'react'
import { AppScreenshot } from './AppScreenshot'
import { SectionHeader } from './SectionHeader'
import {
  IconLayoutDashboard, IconUsers,
  IconFileInvoice, IconCash, IconChartBar,
} from '@tabler/icons-react'

import dashboardImg    from '../../../assets/screenshots/dashboard.png'
import clientesImg     from '../../../assets/screenshots/clientes.png'
import deudasImg       from '../../../assets/screenshots/deudas.png'
import pagosImg        from '../../../assets/screenshots/pagos.png'
import analisisImg     from '../../../assets/screenshots/analisis.png'

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
  img: string
  alt: string
  desc: string
}

const TABS: Tab[] = [
  {
    id: 'dashboard',
    label: 'Panel',
    icon: <IconLayoutDashboard size={16} />,
    img: dashboardImg,
    alt: 'Panel de control CobraFlow',
    desc: 'Resumen completo de tu cartera: deudas vencidas, recaudación del día y clientes en riesgo de un vistazo.',
  },
  {
    id: 'clientes',
    label: 'Clientes',
    icon: <IconUsers size={16} />,
    img: clientesImg,
    alt: 'Gestión de clientes CobraFlow',
    desc: 'Cartera de clientes con estado de deuda, historial de pagos y acceso rápido a su información.',
  },
  {
    id: 'deudas',
    label: 'Deudas',
    icon: <IconFileInvoice size={16} />,
    img: deudasImg,
    alt: 'Control de deudas CobraFlow',
    desc: 'Control total de deudas en ARS y USD, con mora automática, filtros avanzados y ordenamiento.',
  },
  {
    id: 'pagos',
    label: 'Pagos',
    icon: <IconCash size={16} />,
    img: pagosImg,
    alt: 'Registro de pagos CobraFlow',
    desc: 'Registro de cobros con comprobantes PDF, filtros por método y seguimiento en tiempo real.',
  },
  {
    id: 'analisis',
    label: 'Análisis',
    icon: <IconChartBar size={16} />,
    img: analisisImg,
    alt: 'Análisis de cartera CobraFlow',
    desc: 'Evolución de cobros, distribución por estado, balance y proyección de los próximos 30 días.',
  },
]

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const current = TABS.find(t => t.id === activeTab) ?? TABS[0]

  return (
    <section className="showcase-section">
      <SectionHeader
        eyebrow="El producto"
        title="Mirá cómo se ve por dentro"
        subtitle="Una interfaz diseñada para trabajar rápido, no para aprender a usarla."
      />

      {/* Tabs */}
      <div className="showcase-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`showcase-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="showcase-tab-icon">{tab.icon}</span>
            <span className="showcase-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Descripción de la tab activa */}
      <p className="showcase-desc">{current.desc}</p>

      {/* Screenshot con animación de fade al cambiar */}
      <div className="showcase-screenshot-wrap">
        <AppScreenshot
          key={current.id}
          src={current.img}
          alt={current.alt}
          className="showcase-screenshot-anim"
        />
      </div>
    </section>
  )
}