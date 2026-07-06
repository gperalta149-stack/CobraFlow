export interface PagoInsert {
  deuda_id: string
  cliente_id: string
  usuario_id: string
  monto: number
  monto_original: number
  moneda: 'ARS' | 'USD'
  cotizacion: number
  metodo_pago: string
  observaciones?: string
}