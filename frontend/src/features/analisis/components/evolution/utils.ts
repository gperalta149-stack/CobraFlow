// frontend/src/features/dashboard/components/evolution/utils.ts
import type { DatosEvolucionPagos } from '../../../dashboard/types'
import { MESES_MAP } from './constants'

export const prepareChartData = (data: DatosEvolucionPagos[], cotizacion: number) => {
  return data.map(item => {
    const montoARS = item.recaudado || 0
    const montoUSD = item.recaudadoUSD || (montoARS / cotizacion)
    
    let mesLabel = item.mes
    const parts = item.mes.split(' ')
    if (parts.length >= 1) {
      const mesAbr = parts[0]
      const mesEsp = MESES_MAP[mesAbr] || mesAbr
      mesLabel = parts.length > 1 ? `${mesEsp} ${parts[1]}` : mesEsp
    }
    
    return {
      mes: mesLabel,
      mesOriginal: item.mes,
      ARS: Math.round(montoARS),
      USD: Math.round(montoUSD * 100) / 100,
    }
  })
}

export const formatYAxisARS = (value: number) => {
  if (value === 0) return '$0'
  return value >= 1000000 ? `$${(value/1000000).toFixed(1)}M` : 
         value >= 1000 ? `$${(value/1000).toFixed(0)}k` : `$${value}`
}

export const formatYAxisUSD = (value: number) => {
  if (value === 0) return 'USD 0'
  return value >= 1000 ? `USD ${(value/1000).toFixed(0)}k` : `USD ${value}`
}

export const getMaxValue = (data: any[], key: string) => {
  return Math.max(...data.map(d => d[key])) || 1
}
