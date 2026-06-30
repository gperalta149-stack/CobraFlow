// frontend/src/features/dashboard/types.ts
export interface Cotizacion {
  venta: number
}

export interface KPIs {
  totalClientes: number
  totalDeudas: number
  deudasPendientes: number
  deudasVencidas: number
  deudasPagadas: number
  deudasParciales: number

  totalMontoPendienteARS: number
  totalMontoPendienteUSD: number

  montoVencidoARS: number
  montoVencidoUSD: number

  totalRecaudadoMesARS: number
  totalRecaudadoMesUSD: number
  totalRecaudadoHoyARS: number
  totalRecaudadoHoyUSD: number
  cantidadPagosHoy: number

  cantidadProximosVencimientos: number
  proximoVencimiento: string | null

  recuperacionPorcentaje: number
  deudasCobradas: number
  deudasTotalesParaRecuperacion: number
  totalRecaudadoMesConsolidadoARS: number
  totalRecaudadoMesPasadoConsolidadoARS: number
  variacionMensual: string | null
  
  totalRecaudadoMesPasadoARS?: number
  totalRecaudadoMesPasadoUSD?: number
}

export interface TopCliente {
  cliente_id: string
  saldo_pendiente: number
  saldo_pendiente_usd: number
  moneda: string
  cotizacion: number
  clientes: { nombre: string }
  max_dias_vencido: number
  proximo_vencimiento: string | null
}

export interface Alerta {
  id: string
  deuda_id?: string
  cliente_id?: string
  descripcion: string
  fecha_vencimiento: string
  saldo_pendiente: number
  moneda: string
  cotizacion: number
  clientes: { nombre: string }
}

export interface UltimoPago {
  id: string
  monto: number
  monto_original: number
  moneda: string
  metodo_pago: string
  created_at: string
  clientes: { nombre: string }
  deudas?: { descripcion: string }
}

export interface ClienteMayorRiesgo {
  cliente_id: string | null
  nombre: string
  descripcion: string
  moneda: 'ARS' | 'USD'
  pendiente: number
  mora: number
  total: number
  dias_vencido: number
  deuda_id: string
}

export interface DashboardData {
  cotizacion: Cotizacion
  kpis: KPIs
  alertas: Alerta[]
  deudasVencidas: Alerta[]
  ultimosPagos: UltimoPago[]
  clienteMayorRiesgo: ClienteMayorRiesgo | null
  topClientes: TopCliente[]
}

export interface DatosEvolucionPagos {
  mes: string
  recaudado: number      // ARS
  recaudadoUSD?: number  // USD (nuevo campo opcional)
}

export interface DatosComparativa {
  nombre: string
  valor: number
  color: string
}

export type UrgencyLevel = 'urgent' | 'warning' | 'normal'