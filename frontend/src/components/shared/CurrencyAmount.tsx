// frontend/src/components/shared/CurrencyAmount.tsx
interface CurrencyAmountProps {
  amount: number
  currency: 'ARS' | 'USD'
  showSymbol?: boolean
  className?: string
}

export function CurrencyAmount({ amount, currency, showSymbol = true, className = '' }: CurrencyAmountProps) {
  const formatARS = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`
    return `$${n.toLocaleString('es-AR')}`
  }

  const formatUSD = (n: number) => {
    if (n >= 1000) return `USD ${(n / 1000).toFixed(1)}k`
    return `USD ${n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatted = currency === 'ARS' ? formatARS(amount) : formatUSD(amount)
  const icon = currency === 'ARS' ? '🇦🇷' : '🇺🇸'

  return (
    <span className={`font-medium ${className}`} translate="no">
      {showSymbol && <span className="mr-1">{icon}</span>}
      {formatted}
    </span>
  )
}