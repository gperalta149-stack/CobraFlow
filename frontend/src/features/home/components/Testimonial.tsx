// frontend/src/features/home/components/Testimonial.tsx
export function Testimonial() {
  return (
    <div style={{ margin: '0 48px' }}>
      <div style={{ background: '#1a1d2e', border: '0.5px solid #2e3347', borderRadius: 14, padding: '36px', textAlign: 'center' }}>
        <div style={{ color: '#EF9F27', fontSize: 16, marginBottom: 16 }}>★★★★★</div>
        <p style={{ fontSize: 15, color: '#c8cdd6', lineHeight: 1.7, fontStyle: 'italic', maxWidth: 520, margin: '0 auto 20px' }}>
          "CobraFlow me cambió la forma de cobrar. Antes perdía horas con planillas, ahora todo está automatizado y no se me escapa ningún vencimiento."
        </p>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#f0f2f5' }}>Carlos M.</p>
        <p style={{ fontSize: 12, color: '#6b7280', marginTop: 3 }}>Comercio minorista</p>
      </div>
    </div>
  )
}