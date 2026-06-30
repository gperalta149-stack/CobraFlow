// frontend/src/features/dashboard/components/evolution/EvolucionTooltip.tsx

export const EvolucionTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1e2334',
        border: '0.5px solid #2e3347',
        borderRadius: 8,
        padding: '12px 16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#f0f2f5', marginBottom: 4 }}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ fontSize: 13, color: entry.color, margin: 0 }}>
            {entry.name}: {entry.value.toLocaleString('es-AR')}
          </p>
        ))}
      </div>
    )
  }
  return null
}