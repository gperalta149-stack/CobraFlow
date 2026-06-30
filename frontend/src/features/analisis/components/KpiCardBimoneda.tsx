// frontend/src/features/analisis/components/KpiCardBimoneda.tsx
import { useMonedaConfig } from '../../../hooks/useMonedaConfig'
import { TextMuted, TextSmall } from '../../../components/ui/Typography'
import { fmtMonedaConSigno } from '../utils/formatMoneda'

const COLOR_ARS = '#60a5fa'
const COLOR_USD = '#fbbf24'
const COLOR_DANGER = '#f87171'

interface KpiCardBimonedaProps {
  label: string
  icon: React.ReactNode
  iconColor: string
  valARS: number
  valUSD: number
  subtextARS?: string
  subtextUSD?: string
  colorMode?: 'currency' | 'danger' | 'auto'
  labelColorOverride?: string
}

export function KpiCardBimoneda({
  label, icon, iconColor, valARS, valUSD,
  subtextARS, subtextUSD, colorMode = 'currency', labelColorOverride,
}: KpiCardBimonedaProps) {
  const { formatearMonto, debeMostrarEquivalencia } = useMonedaConfig()
  const mostrarEquivalencia = debeMostrarEquivalencia('analisis')

  const getColors = (valor: number, monedaColor: string) => {
    if (colorMode === 'danger') return { label: COLOR_DANGER, value: COLOR_DANGER }
    if (colorMode === 'auto') {
      const c = valor < 0 ? COLOR_DANGER : monedaColor
      return { label: c, value: c }
    }
    return { label: labelColorOverride ?? monedaColor, value: monedaColor }
  }

  const ars = getColors(valARS, COLOR_ARS)
  const usd = getColors(valUSD, COLOR_USD)
  const arsFormatted = formatearMonto(valARS, valUSD, 'ARS', 'analisis')
  const usdFormatted = formatearMonto(valARS, valUSD, 'USD', 'analisis')

  return (
    <div className="metric-card">
      <div className="metric-card-header">
        <div className="metric-card-icon" style={{ background: `${iconColor}20`, color: iconColor }}>
          {icon}
        </div>
        <p className="metric-label">{label}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} translate="no">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="metric-currency-tag" style={{ color: ars.label }}>ARS</span>
            <span className="metric-value-dual" style={{ color: ars.value }}>
              {fmtMonedaConSigno(valARS, 'ARS')}
            </span>
          </div>
          {mostrarEquivalencia && arsFormatted.secundario && valARS !== 0 && (
            <TextSmall style={{ marginLeft: 32, marginTop: 2 }}>{arsFormatted.secundario}</TextSmall>
          )}
        </div>
        {subtextARS && <TextMuted style={{ fontSize: 11, marginLeft: 32 }}>{subtextARS}</TextMuted>}

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="metric-currency-tag" style={{ color: usd.label }}>USD</span>
            <span className="metric-value-dual" style={{ color: usd.value }}>
              {fmtMonedaConSigno(valUSD, 'USD')}
            </span>
          </div>
          {mostrarEquivalencia && usdFormatted.secundario && valUSD !== 0 && (
            <TextSmall style={{ marginLeft: 32, marginTop: 2 }}>{usdFormatted.secundario}</TextSmall>
          )}
        </div>
        {subtextUSD && <TextMuted style={{ fontSize: 11, marginLeft: 32 }}>{subtextUSD}</TextMuted>}
      </div>
    </div>
  )
}