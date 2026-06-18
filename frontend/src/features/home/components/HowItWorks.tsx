// frontend/src/features/home/components/HowItWorks.tsx
const STEPS = [
  { n: '1', title: 'Creás tus clientes', desc: 'Registrá tu cartera de clientes en minutos con toda su información.' },
  { n: '2', title: 'Registrás deudas', desc: 'Cargá las deudas con montos, fechas y monedas. ARS o USD.' },
  { n: '3', title: 'Controlás pagos', desc: 'Gestioná cobros y seguí el estado en tiempo real con alertas automáticas.' },
]

export function HowItWorks() {
  return (
    <section style={{ padding: '0 48px 64px' }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: '#1D9E75', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', marginBottom: 10 }}>Cómo funciona</p>
      <h2 style={{ fontSize: 30, fontWeight: 700, color: '#f0f2f5', textAlign: 'center', marginBottom: 8, letterSpacing: '-0.3px' }}>En 3 pasos simples</h2>
      <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 40 }}>Empezá a cobrar mejor desde el primer día</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 900, margin: '0 auto' }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ background: '#1a1d2e', border: '0.5px solid #2e3347', borderRadius: 12, padding: '22px' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(29,158,117,0.12)', border: '0.5px solid rgba(29,158,117,0.25)', color: '#1D9E75', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              {s.n}
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#f0f2f5', marginBottom: 8 }}>{s.title}</p>
            <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}