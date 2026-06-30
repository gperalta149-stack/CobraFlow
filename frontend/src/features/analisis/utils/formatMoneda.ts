// frontend/src/features/analisis/utils/formatMoneda.ts
export function fmtMoneda(monto: number, moneda: 'ARS' | 'USD'): string {
  if (moneda === 'USD') {
    return `USD ${monto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return `$${Math.round(monto).toLocaleString('es-AR')}`
}

export function fmtMonedaConSigno(monto: number, moneda: 'ARS' | 'USD'): string {
  const abs = Math.abs(monto)
  const sign = monto < 0 ? '-' : ''
  return `${sign}${fmtMoneda(abs, moneda)}`
}