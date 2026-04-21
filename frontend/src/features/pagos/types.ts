export interface Pago {
  id: string
  monto: number
  fecha_pago: string
  observaciones: string
  deudas: { descripcion: string; monto_total: number }
  clientes: { nombre: string }
}

export interface Deuda {
  id: string
  descripcion: string
  saldo_pendiente: number
  estado: string
  clientes: { nombre: string }
}

export interface PagoFormData {
  deuda_id: string
  monto: string
  observaciones: string
}

export interface DeudaSeleccionada {
  id: string
  saldo_pendiente: number
  clientes: { nombre: string }
  descripcion: string
}