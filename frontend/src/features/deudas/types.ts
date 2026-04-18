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
}

export interface Cliente {
  id: string
  nombre: string
}

export interface DeudaFormData {
  cliente_id: string
  descripcion: string
  monto_total: string
  fecha_vencimiento: string
}

export type EstadoDeuda = 'pendiente' | 'parcial' | 'pagada' | 'vencida'