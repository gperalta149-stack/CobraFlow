export interface Pago {
  id: string
  monto: number
  monto_original: number
  moneda: 'ARS' | 'USD'
  cotizacion: number
  metodo_pago?: 'efectivo' | 'transferencia' | 'tarjeta_credito' | 'tarjeta_debito' | 'cheque' | 'mercado_pago' | 'paypal' | 'cripto' | 'otro'
  fecha_pago: string
  observaciones: string
  deudas: { descripcion: string; monto_total: number; numero_factura?: string }
  clientes: { nombre: string }
  moneda_pago?: 'ARS' | 'USD'
  cotizacion_pago?: number
}

export interface Deuda {
  id: string
  descripcion: string
  saldo_pendiente: number
  monto_original: number
  monto_total?: number
  cotizacion: number
  moneda: 'ARS' | 'USD'
  estado: string
  cliente_id: string
  fecha_emision?: string
  fecha_vencimiento: string
  clientes: { nombre: string }
}
export interface PagoFormData {
  deuda_id: string
  monto: string
  moneda_pago: 'ARS' | 'USD'
  cotizacion_pago: string
  metodo_pago: 'efectivo' | 'transferencia' | 'tarjeta_credito' | 'tarjeta_debito' | 'cheque' | 'mercado_pago' | 'otro'
  observaciones: string
}

export interface DeudaSeleccionada {
  id: string
  saldo_pendiente: number
  monto_original: number
  cotizacion: number
  moneda: 'ARS' | 'USD'
  clientes: { nombre: string }
  descripcion: string
}