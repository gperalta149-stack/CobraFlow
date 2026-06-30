// frontend/src/features/home/components/HowItWorks.tsx
import { H3, TextMuted } from '../../../components/ui/Typography'
import { SectionHeader } from './SectionHeader'

interface Step {
  n: string
  title: string
  desc: string
}

const STEPS: Step[] = [
  {
    n: '1',
    title: 'Creás tus clientes',
    desc: 'Registrá tu cartera de clientes en minutos con toda su información de contacto y datos de pago.',
  },
  {
    n: '2',
    title: 'Registrás deudas',
    desc: 'Cargá las deudas con montos, fechas y monedas. ARS o USD nativo con tipo de cambio histórico.',
  },
  {
    n: '3',
    title: 'Controlás pagos',
    desc: 'Gestioná cobros y seguí el estado en tiempo real con alertas automáticas de vencimiento y mora.',
  },
]

function StepCard({ step }: { step: Step }) {
  return (
    <div className="step-card">
      <div className="step-num">{step.n}</div>
      <H3 className="step-title" style={{ fontSize: 17 }}>{step.title}</H3>
      <TextMuted className="step-desc" style={{ fontSize: 14, lineHeight: 1.7 }}>{step.desc}</TextMuted>
    </div>
  )
}

export function HowItWorks() {
  return (
    <section className="steps-section">
      <SectionHeader
        eyebrow="Cómo funciona"
        title="En 3 pasos simples"
        subtitle="Empezá a cobrar mejor desde el primer día"
      />
      <div className="steps-grid">
        {STEPS.map((s, i) => <StepCard key={i} step={s} />)}
      </div>
    </section>
  )
}