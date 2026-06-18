import { useExchangeRate } from '../../../hooks/useExchangeRate'

export function ExchangeRateBadge() {
  const { rate, loading, error } = useExchangeRate()

  if (loading) {
    return <div className="text-xs text-gray-400">Cargando cotización...</div>
  }

  if (error || !rate) {
    return <div className="text-xs text-red-400">Error al cargar cotización</div>
  }

  return (
    <div className="flex items-center gap-2 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
      <span className="font-medium">USD Oficial:</span>
      <span>Compra: ${rate.compra.toLocaleString()}</span>
      <span>Venta: ${rate.venta.toLocaleString()}</span>
      <span className="text-gray-400">{new Date(rate.fecha).toLocaleDateString()}</span>
    </div>
  )
}