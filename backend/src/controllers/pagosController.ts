import { Request, Response } from 'express'
import { supabase } from '../config/supabase'
import { AuthRequest } from '../middleware/authMiddleware'

export const getPagos = async (req: AuthRequest, res: Response) => {
  const usuario_id = req.usuario?.id // ✅ FIX

  if (!usuario_id) {
    return res.status(401).json({ error: 'Usuario no autenticado' })
  }

  const { deuda_id, cliente_id } = req.query

  // ✅ FIX: siempre filtrar por usuario_id
  let query = supabase
    .from('pagos')
    .select(`*, deudas(descripcion, monto_total), clientes(nombre)`)
    .eq('usuario_id', usuario_id) // ✅
    .order('created_at', { ascending: false })

  if (deuda_id) query = query.eq('deuda_id', deuda_id)
  if (cliente_id) query = query.eq('cliente_id', cliente_id)

  const { data, error } = await query

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// ============================================
// OBTENER PAGOS POR CLIENTE
// ============================================
export const getPagosByCliente = async (req: AuthRequest, res: Response) => {
  try {
    const { cliente_id } = req.params
    const usuario_id = req.usuario?.id

    if (!usuario_id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    // Verificar que el cliente pertenece al usuario
    const { data: cliente, error: clienteError } = await supabase
      .from('clientes')
      .select('id')
      .eq('id', cliente_id)
      .eq('usuario_id', usuario_id)
      .single()

    if (clienteError || !cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    const { data, error } = await supabase
      .from('pagos')
      .select(`
        id,
        monto,
        fecha_pago,
        observaciones,
        deudas (
          descripcion,
          monto_total
        )
      `)
      .eq('cliente_id', cliente_id)
      .eq('usuario_id', usuario_id) // ✅ FIX: filtrar por usuario también aquí
      .order('fecha_pago', { ascending: false })

    if (error) {
      console.error('Error en getPagosByCliente:', error)
      return res.status(500).json({ error: error.message })
    }

    res.json(data)
  } catch (error) {
    console.error('Error inesperado en getPagosByCliente:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const createPago = async (req: AuthRequest, res: Response) => {
  const { deuda_id, monto, moneda_pago, cotizacion_pago, metodo_pago, observaciones } = req.body

  if (!deuda_id || !monto || !moneda_pago) {
    return res.status(400).json({ error: 'deuda_id, monto y moneda_pago son obligatorios' })
  }

  const usuario_id = req.usuario?.id
  if (!usuario_id) return res.status(401).json({ error: 'Usuario no autenticado' })

  const { data: deuda, error: deudaError } = await supabase
    .from('deudas')
    .select('*')
    .eq('id', deuda_id)
    .eq('usuario_id', usuario_id)
    .single()

  if (deudaError || !deuda) return res.status(404).json({ error: 'Deuda no encontrada' })
  if (deuda.estado === 'pagada') return res.status(400).json({ error: 'La deuda ya está pagada' })

  const montoIngresado = Number(monto)
  const cotizacion = Number(cotizacion_pago) || 1
  const montoEnARS = moneda_pago === 'USD' ? montoIngresado * cotizacion : montoIngresado

  if (montoEnARS > deuda.saldo_pendiente + 0.01) {
    return res.status(400).json({
      error: `El monto supera el saldo pendiente de $${deuda.saldo_pendiente} ARS`
    })
  }

  const { data: pago, error: pagoError } = await supabase
    .from('pagos')
    .insert([{
      deuda_id,
      cliente_id: deuda.cliente_id,
      usuario_id,
      monto: montoEnARS,
      monto_original: montoIngresado,
      moneda: moneda_pago,
      cotizacion: cotizacion,
      metodo_pago: metodo_pago || 'efectivo',
      observaciones
    }])
    .select()

  if (pagoError) return res.status(400).json({ error: pagoError.message })

  const nuevoMontoPagado = Number(deuda.monto_pagado) + montoEnARS
  const nuevoSaldo = Number(deuda.monto_total) - nuevoMontoPagado
  const nuevoEstado = nuevoSaldo <= 0.01 ? 'pagada' : 'parcial'

  await supabase
    .from('deudas')
    .update({
      monto_pagado: nuevoMontoPagado,
      saldo_pendiente: nuevoSaldo,
      estado: nuevoEstado,
      updated_at: new Date()
    })
    .eq('id', deuda_id)
    .eq('usuario_id', usuario_id)

  res.status(201).json({
    mensaje: 'Pago registrado correctamente',
    pago: pago[0],
    deuda_actualizada: { saldo_pendiente: nuevoSaldo, estado: nuevoEstado }
  })
}