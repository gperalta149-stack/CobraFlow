// frontend/src/features/analisis/types.ts

export type Periodo = 'semana' | 'mes' | 'trimestre' | 'semestre' | 'año'

export interface ClienteConMora {
  id: string
  nombre: string
  deuda_original: number
  mora_acumulada: number
  total: number
  moneda: 'ARS' | 'USD'
}

export interface AgingData {
  tramo: string
  montoARS: number
  montoUSD: number
}

export interface BalanceData {
  cobradoARS: number
  cobradoUSD: number
  nuevasDeudasARS: number
  nuevasDeudasUSD: number
  recuperacionARS: number
  recuperacionUSD: number
}

export interface KPIsAnalisis {
  montoVencidoARS: number
  montoVencidoUSD: number
  porcentajeVencidoARS: number
  porcentajeVencidoUSD: number
}

export interface PeriodoConfig {
  fechaInicio: Date
  evolucionMeses: number
  evolucionLabel: string
}