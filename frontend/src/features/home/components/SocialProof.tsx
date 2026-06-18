// frontend/src/features/home/components/SocialProof.tsx
export function SocialProof() {
  const items = [
    { value: '+120', label: 'Negocios activos', color: '#1D9E75' },
    { value: '+35%', label: 'Más cobranza', color: '#1D9E75' },
    { value: '24/7', label: 'Disponibilidad', color: '#1D9E75' },
    { value: '★ 4.9', label: 'Satisfacción', color: '#EF9F27' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '0.5px solid #2e3347', borderBottom: '0.5px solid #2e3347' }}>
      {items.map((item, i) => (
        <div key={i} style={{ padding: '24px', textAlign: 'center', borderRight: i < items.length - 1 ? '0.5px solid #2e3347' : 'none' }}>
          <p style={{ fontSize: 26, fontWeight: 700, color: item.color }}>{item.value}</p>
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{item.label}</p>
        </div>
      ))}
    </div>
  )
}