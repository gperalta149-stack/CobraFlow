export interface KPIs {
  totalClientes: number
  totalDeudas: number
  deudasPendientes: number
  deudasVencidas: number
  deudasPagadas: number
  deudasParciales: number
  totalMontoPendiente: number
  totalMontoDeudas: number
  totalRecaudadoMes: number
}

export interface TopCliente {
  cliente_id: string
  saldo_pendiente: number
  clientes: { nombre: string }
}

export interface Alerta {
  id: string
  deuda_id?: string
  cliente_id?: string
  descripcion: string
  fecha_vencimiento: string
  saldo_pendiente: number
  clientes: { nombre: string }
}

export interface DashboardData {
  kpis: KPIs
  topClientes: TopCliente[]
  alertas: Alerta[]
}

export type UrgencyLevel = 'urgent' | 'warning' | 'normal'