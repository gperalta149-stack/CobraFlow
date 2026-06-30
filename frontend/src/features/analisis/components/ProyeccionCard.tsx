// frontend/src/features/analisis/components/ProyeccionCard.tsx
import { TextSmall, H2 } from '../../../components/ui/Typography'
import { fmtMoneda } from '../utils/formatMoneda'

interface ProyeccionCardProps {
  proyeccionARS: number
  proyeccionUSD: number
}

export function ProyeccionCard({ proyeccionARS, proyeccionUSD }: ProyeccionCardProps) {
  if (proyeccionARS <= 0 && proyeccionUSD <= 0) return null

  return (
    <div style={{ backgroundColor: '#242938', border: '0.5px solid #2e3347', borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
      <TextSmall style={{ textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        Proyección próximos 30 días
      </TextSmall>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, alignItems: 'center', marginTop: 4 }}>
        {proyeccionARS > 0 && (
          <H2 style={{ fontSize: 20, color: '#34d399' }}>{fmtMoneda(proyeccionARS, 'ARS')}</H2>
        )}
        {proyeccionARS > 0 && proyeccionUSD > 0 && (
          <div style={{ width: 1, background: '#2e3347', height: 24 }} />
        )}
        {proyeccionUSD > 0 && (
          <H2 style={{ fontSize: 20, color: '#34d399' }}>{fmtMoneda(proyeccionUSD, 'USD')}</H2>
        )}
      </div>
    </div>
  )
}