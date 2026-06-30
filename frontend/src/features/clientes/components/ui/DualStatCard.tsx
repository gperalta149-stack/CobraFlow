// frontend/src/components/ui/DualStatCard.tsx
interface DualStatCardProps {
  label: string
  ars: number
  usd: number
  cotizacion: number   // ← necesario para calcular equivalencias reales
  color?: 'white' | 'orange'
}

const colorClasses = {
  white: 'text-white',
  orange: 'text-orange-400',
}

const fmtARS = (v: number) => `$${Math.round(v).toLocaleString('es-AR')}`
const fmtUSD = (v: number) => `USD ${v.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function DualStatCard({ label, ars, usd, cotizacion, color = 'white' }: DualStatCardProps) {
  const hasArs = ars > 0
  const hasUsd = usd > 0

  // Equivalencias cruzadas reales
  const arsEquivalenteDeUsd = usd * cotizacion   // cuánto valen en pesos los dólares que tiene
  const usdEquivalenteDeArs = ars / cotizacion   // cuánto valen en dólares los pesos que tiene

  return (
    <div className="bg-[#1e2334] rounded-xl p-4 text-center">
      <p className="text-xs text-gray-400 mb-1">{label}</p>

      {!hasArs && !hasUsd && (
        <p className={`text-lg font-bold ${colorClasses[color]}`}>—</p>
      )}

      {/* Bloque ARS: monto nativo + su equivalencia en USD */}
      {hasArs && (
        <div className="mb-1.5">
          <p className={`text-lg font-bold ${colorClasses[color]}`}>{fmtARS(ars)}</p>
          <p className="text-xs text-gray-400">≈ {fmtUSD(usdEquivalenteDeArs)}</p>
        </div>
      )}

      {/* Bloque USD: monto nativo + su equivalencia en ARS */}
      {hasUsd && (
        <div className={hasArs ? 'pt-1.5 border-t border-gray-700' : ''}>
          <p className={`font-bold ${colorClasses[color]} ${hasArs ? 'text-sm' : 'text-lg'}`}>
            {fmtUSD(usd)}
          </p>
          <p className="text-xs text-gray-400">≈ {fmtARS(arsEquivalenteDeUsd)}</p>
        </div>
      )}
    </div>
  )
}