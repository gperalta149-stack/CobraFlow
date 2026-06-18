// frontend/src/features/home/components/Features.tsx
import { IconChartBar, IconWallet, IconUsers } from '@tabler/icons-react'

const FEATURES = [
  { icon: IconChartBar, color: '#1D9E75', bg: 'rgba(29,158,117,0.12)', title: 'Visión 360°', desc: 'Dashboard en tiempo real con métricas clave para tomar decisiones rápidas.', pill: 'Cobrá más rápido', pillColor: '#1D9E75', pillBg: 'rgba(29,158,117,0.1)', pillBorder: 'rgba(29,158,117,0.25)' },
  { icon: IconWallet, color: '#378ADD', bg: 'rgba(55,138,221,0.12)', title: 'Control total', desc: 'Seguí cada deuda, vencimiento y pago sin perder ningún detalle.', pill: 'Reducí la morosidad', pillColor: '#378ADD', pillBg: 'rgba(55,138,221,0.1)', pillBorder: 'rgba(55,138,221,0.25)' },
  { icon: IconUsers, color: '#EF9F27', bg: 'rgba(239,159,39,0.12)', title: 'Gestión simple', desc: 'Administrá clientes, historial de pagos y deudas desde un solo lugar.', pill: 'Ahorrá tiempo', pillColor: '#EF9F27', pillBg: 'rgba(239,159,39,0.1)', pillBorder: 'rgba(239,159,39,0.25)' },
]

export function Features() {
  return (
    <section style={{ padding: '64px 48px' }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: '#1D9E75', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', marginBottom: 10 }}>Beneficios</p>
      <h2 style={{ fontSize: 30, fontWeight: 700, color: '#f0f2f5', textAlign: 'center', marginBottom: 8, letterSpacing: '-0.3px' }}>Todo lo que necesitás para cobrar mejor</h2>
      <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 40 }}>Sin planillas. Sin desorden. Sin plata perdida.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 900, margin: '0 auto' }}>
        {FEATURES.map((f, i) => {
          const Icon = f.icon
          return (
            <div key={i} style={{ background: '#1a1d2e', border: '0.5px solid #2e3347', borderRadius: 12, padding: '22px' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={20} color={f.color} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#f0f2f5', marginBottom: 8 }}>{f.title}</p>
              <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6, marginBottom: 12 }}>{f.desc}</p>
              <span style={{ fontSize: 10, fontWeight: 600, color: f.pillColor, background: f.pillBg, border: `0.5px solid ${f.pillBorder}`, padding: '3px 9px', borderRadius: 10 }}>
                ✓ {f.pill}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}