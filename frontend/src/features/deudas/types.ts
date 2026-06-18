export interface Deuda {
  id: string
  descripcion: string
  monto_total: number
  monto_pagado: number
  saldo_pendiente: number
  fecha_vencimiento: string
  estado: string
  cliente_id: string
  clientes: { nombre: string; email: string }
  moneda: 'ARS' | 'USD'
  cotizacion: number
  monto_original: number
  numero_factura?: string      
  observaciones?: string         
}

export interface DeudaFormData {
  cliente_id: string
  numero_factura?: string
  descripcion: string
  monto_total: string
  fecha_vencimiento: string
  moneda: 'ARS' | 'USD'
  monto_original: string
  cotizacion: string
  observaciones?: string
}

export interface Cliente {
  id: string
  nombre: string
  apellido?: string
}

export type EstadoDeuda = 'pendiente' | 'parcial' | 'pagada' | 'vencida'