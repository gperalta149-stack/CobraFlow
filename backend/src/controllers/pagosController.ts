import { Request, Response } from 'express'
import { supabase } from '../config/supabase'
import { AuthRequest } from '../middleware/authMiddleware'
import type { PagoInsert } from '../types/pago.types'

// ============================================
// OBTENER PAGOS (con paginación, excluye anulados por defecto)
// ============================================
export const getPagos = async (req: AuthRequest, res: Response) => {
  try {
    const usuario_id = req.usuario?.id
    if (!usuario_id) return res.status(401).json({ error: 'Usuario no autenticado' })

    const { deuda_id, cliente_id, incluir_anulados, page = '1', limit = '20', desde, hasta } = req.query
    const pageNum = Math.max(1, parseInt(page as string) || 1)
    const limitNum = Math.min(500, Math.max(1, parseInt(limit as string) || 20))
    const offset = (pageNum - 1) * limitNum

    let query = supabase
      .from('pagos')
      .select(`
        *, 
        deudas!inner(
          descripcion, 
          monto_total, 
          moneda, 
          cotizacion
        ), 
        clientes!inner(nombre)
      `, { count: 'exact' })
      .eq('usuario_id', usuario_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1)

    if (incluir_anulados !== 'true') {
      query = query.eq('anulado', false)
    }
    if (deuda_id) query = query.eq('deuda_id', deuda_id)
    if (cliente_id) query = query.eq('cliente_id', cliente_id)
    if (desde) query = query.gte('created_at', desde as string)
    if (hasta) query = query.lte('created_at', hasta as string)

    const { data, error, count } = await query
    if (error) return res.status(500).json({ error: error.message })

    res.setHeader('X-Total-Count', count || 0)
    res.json(data)
  } catch (error) {
    console.error('Error inesperado en getPagos:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// ============================================
// OBTENER PAGOS POR CLIENTE
// ============================================
export const getPagosByCliente = async (req: AuthRequest, res: Response) => {
  try {
    const { cliente_id } = req.params
    const usuario_id = req.usuario?.id
    const { incluir_anulados } = req.query

    if (!usuario_id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    const { data: cliente, error: clienteError } = await supabase
      .from('clientes')
      .select('id')
      .eq('id', cliente_id)
      .eq('usuario_id', usuario_id)
      .single()

    if (clienteError || !cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    let query = supabase
      .from('pagos')
      .select(`
        id,
        monto,
        monto_original,
        moneda,
        cotizacion,
        metodo_pago,
        fecha_pago,
        observaciones,
        anulado,
        deudas!inner(
          descripcion,
          monto_total,
          moneda,
          cotizacion
        )
      `)
      .eq('cliente_id', cliente_id)
      .eq('usuario_id', usuario_id)
      .order('fecha_pago', { ascending: false })

    if (incluir_anulados !== 'true') {
      query = query.eq('anulado', false)
    }

    const { data, error } = await query

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

// ============================================
// CREAR PAGO
// ============================================
export const createPago = async (req: AuthRequest, res: Response) => {
  try {
    const { deuda_id, monto, moneda_pago, cotizacion_pago, metodo_pago, observaciones } = req.body

    if (!deuda_id || !monto || !moneda_pago) {
      return res.status(400).json({ error: 'deuda_id, monto y moneda_pago son obligatorios' })
    }

    const usuario_id = req.usuario?.id
    if (!usuario_id) return res.status(401).json({ error: 'Usuario no autenticado' })

    const montoIngresado = Number(monto)
    if (!montoIngresado || montoIngresado <= 0) {
      return res.status(400).json({ error: 'El monto debe ser mayor a 0' })
    }

    const { data: deuda, error: deudaError } = await supabase
      .from('deudas')
      .select('*')
      .eq('id', deuda_id)
      .eq('usuario_id', usuario_id)
      .single()

    if (deudaError || !deuda) return res.status(404).json({ error: 'Deuda no encontrada' })
    if (deuda.estado === 'pagada') return res.status(400).json({ error: 'La deuda ya está pagada' })

    const cotizacion = Number(cotizacion_pago) || 1
    const montoEnARS = moneda_pago === 'USD' ? montoIngresado * cotizacion : montoIngresado

    if (montoEnARS > Number(deuda.saldo_pendiente) + 0.01) {
      return res.status(400).json({
        error: `El monto supera el saldo pendiente de $${deuda.saldo_pendiente} ARS`
      })
    }

    const insertData: PagoInsert = {
      deuda_id,
      cliente_id: deuda.cliente_id,
      usuario_id,
      monto: montoEnARS,
      monto_original: montoIngresado,
      moneda: moneda_pago,
      cotizacion,
      metodo_pago: metodo_pago || 'efectivo',
      observaciones
    }

    const { data: pago, error: pagoError } = await supabase
      .from('pagos')
      .insert([insertData])
      .select()

    if (pagoError) return res.status(400).json({ error: pagoError.message })

    const { data: deudaActualizada, error: refetchError } = await supabase
      .from('deudas')
      .select('saldo_pendiente, monto_pagado, estado')
      .eq('id', deuda_id)
      .single()

    if (refetchError) {
      console.error('Error releyendo deuda tras el pago:', refetchError)
    }

    res.status(201).json({
      mensaje: 'Pago registrado correctamente',
      pago: pago[0],
      deuda_actualizada: deudaActualizada ?? null
    })
  } catch (error) {
    console.error('Error inesperado en createPago:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// ============================================
// ANULAR PAGO (soft-delete — nunca se borra físico)
// ============================================
export const anularPago = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { motivo } = req.body
    const usuario_id = req.usuario?.id

    if (!usuario_id) return res.status(401).json({ error: 'Usuario no autenticado' })

    const { data: pago, error: pagoError } = await supabase
      .from('pagos')
      .select('id, anulado, deuda_id')
      .eq('id', id)
      .eq('usuario_id', usuario_id)
      .single()

    if (pagoError || !pago) {
      return res.status(404).json({ error: 'Pago no encontrado' })
    }

    if (pago.anulado) {
      return res.status(400).json({ error: 'El pago ya está anulado' })
    }

    const { data, error } = await supabase
      .from('pagos')
      .update({
        anulado: true,
        anulado_at: new Date(),
        anulado_motivo: motivo?.trim() || null
      })
      .eq('id', id)
      .eq('usuario_id', usuario_id)
      .select()

    if (error) {
      console.error('Error anulando pago:', error)
      return res.status(400).json({ error: error.message })
    }

    const { data: deudaActualizada } = await supabase
      .from('deudas')
      .select('id, monto_pagado, saldo_pendiente, estado')
      .eq('id', pago.deuda_id)
      .single()

    res.json({
      mensaje: 'Pago anulado correctamente',
      pago: data[0],
      deuda_actualizada: deudaActualizada ?? null
    })
  } catch (error) {
    console.error('Error inesperado en anularPago:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}