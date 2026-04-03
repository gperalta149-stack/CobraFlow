import { Request, Response } from 'express'
import { supabase } from '../config/supabase'
import { AuthRequest } from '../middleware/authMiddleware'

export const getPagos = async (req: AuthRequest, res: Response) => {
  const { deuda_id, cliente_id } = req.query

  let query = supabase
    .from('pagos')
    .select(`*, deudas(descripcion, monto_total), clientes(nombre)`)
    .order('created_at', { ascending: false })

  if (deuda_id) query = query.eq('deuda_id', deuda_id)
  if (cliente_id) query = query.eq('cliente_id', cliente_id)

  const { data, error } = await query

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

export const createPago = async (req: AuthRequest, res: Response) => {
  const { deuda_id, monto, observaciones } = req.body

  if (!deuda_id || !monto) {
    return res.status(400).json({ error: 'deuda_id y monto son obligatorios' })
  }

  // Buscar la deuda
  const { data: deuda, error: deudaError } = await supabase
    .from('deudas')
    .select('*')
    .eq('id', deuda_id)
    .single()

  if (deudaError || !deuda) {
    return res.status(404).json({ error: 'Deuda no encontrada' })
  }

  if (deuda.estado === 'pagada') {
    return res.status(400).json({ error: 'La deuda ya está pagada' })
  }

  if (monto > deuda.saldo_pendiente) {
    return res.status(400).json({ error: `El monto no puede superar el saldo pendiente de $${deuda.saldo_pendiente}` })
  }

  // Registrar el pago
  const { data: pago, error: pagoError } = await supabase
    .from('pagos')
    .insert([{
      deuda_id,
      cliente_id: deuda.cliente_id,
      monto,
      observaciones
    }])
    .select()

  if (pagoError) return res.status(400).json({ error: pagoError.message })

  // Actualizar saldo y estado de la deuda
  const nuevoMontoPagado = Number(deuda.monto_pagado) + Number(monto)
  const nuevoSaldo = Number(deuda.monto_total) - nuevoMontoPagado
  const nuevoEstado = nuevoSaldo <= 0 ? 'pagada' : 'parcial'

  await supabase
    .from('deudas')
    .update({
      monto_pagado: nuevoMontoPagado,
      saldo_pendiente: nuevoSaldo,
      estado: nuevoEstado,
      updated_at: new Date()
    })
    .eq('id', deuda_id)

  res.status(201).json({
    mensaje: 'Pago registrado correctamente',
    pago: pago[0],
    deuda_actualizada: {
      saldo_pendiente: nuevoSaldo,
      estado: nuevoEstado
    }
  })
}