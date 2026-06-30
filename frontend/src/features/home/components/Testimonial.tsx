// frontend/src/features/home/components/Testimonial.tsx
import { H3, Text, TextSmall } from '../../../components/ui/Typography'
import { SectionHeader } from './SectionHeader'

interface TestimonialItem {
  text: string
  name: string
  role: string
  initials: string
  color: string
}

const TESTIMONIALS: TestimonialItem[] = [
  { text: '"CobraFlow me cambió la forma de cobrar. Antes perdía horas con planillas, ahora todo está automatizado y no se me escapa ningún vencimiento."', name: 'Carlos M.',  role: 'Comercio minorista · Córdoba',  initials: 'CM', color: '#1D9E75' },
  { text: '"Desde que uso CobraFlow bajé mi deuda incobrable un 40%. La mora automática es un golazo para el negocio."',                                    name: 'Laura G.',   role: 'Distribuidora · Rosario',        initials: 'LG', color: '#378ADD' },
  { text: '"Tenía clientes que me debían hace 6 meses y ni me acordaba. Ahora me llega la alerta sola y puedo actuar a tiempo."',                           name: 'Martín R.',  role: 'Ferretería · Buenos Aires',      initials: 'MR', color: '#EF9F27' },
  { text: '"Manejo deudas en ARS y USD y nunca había podido tener todo junto en un solo lugar. CobraFlow lo resolvió perfecto."',                           name: 'Sofía P.',   role: 'Importadora · Mendoza',          initials: 'SP', color: '#8b5cf6' },
  { text: '"El dashboard me da una visión completa que antes tardaba horas en armar en Excel. Es imprescindible para mi negocio."',                         name: 'Jorge F.',   role: 'Mayorista · Tucumán',            initials: 'JF', color: '#E24B4A' },
  { text: '"Generé más de 200 comprobantes en un mes. Mis clientes valoran el profesionalismo y yo gano tiempo."',                                         name: 'Valeria B.', role: 'Servicios · Córdoba',            initials: 'VB', color: '#ec4899' },
]

function TestiCard({ item }: { item: TestimonialItem }) {
  return (
    <div className="testi-card">
      <div className="testi-stars">★★★★★</div>

      <Text
        className="testi-text"
        style={{ fontSize: 14, color: '#c8cdd6', fontStyle: 'italic', lineHeight: 1.8 }}
      >
        {item.text}
      </Text>

      <div className="testi-author">
        <div className="testi-avatar" style={{ background: item.color }}>
          {item.initials}
        </div>
        <div>
          <H3 className="testi-name" style={{ fontSize: 14 }}>{item.name}</H3>
          <TextSmall className="testi-role" style={{ fontSize: 12 }}>{item.role}</TextSmall>
        </div>
      </div>
    </div>
  )
}

export function Testimonial() {
  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <SectionHeader
          eyebrow="Testimonios"
          title="Lo que dicen nuestros clientes"
          subtitle="Pasá el cursor para pausar"
        />
      </div>
      <div className="testi-track-wrap">
        <div className="testi-track">
          {/* Se eliminó la duplicación cruda. Si necesitás animación infinita continua por CSS, duplicá dinámicamente usando pseudo-elementos o clonando nodos en el DOM */}
          {TESTIMONIALS.map((t, i) => <TestiCard key={i} item={t} />)}
        </div>
      </div>
    </section>
  )
}