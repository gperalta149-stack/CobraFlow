import { Request, Response } from 'express'
import { supabase } from '../config/supabase'
import { AuthRequest } from '../middleware/authMiddleware'

export const getDeudas = async (req: AuthRequest, res: Response) => {
  const { estado, cliente_id } = req.query

  let query = supabase
    .from('deudas')
    .select(`*, clientes(nombre, email)`)
    .order('created_at', { ascending: false })

  if (estado) query = query.eq('estado', estado)
  if (cliente_id) query = query.eq('cliente_id', cliente_id)

  const { data, error } = await query

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

export const getDeudaById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('deudas')
    .select(`*, clientes(nombre, email), pagos(*)`)
    .eq('id', id)
    .single()

  if (error || !data) return res.status(404).json({ error: 'Deuda no encontrada' })
  res.json(data)
}

export const createDeuda = async (req: AuthRequest, res: Response) => {
  const { cliente_id, descripcion, monto_total, fecha_vencimiento } = req.body

  if (!cliente_id || !descripcion || !monto_total || !fecha_vencimiento) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  const { data, error } = await supabase
    .from('deudas')
    .insert([{
      cliente_id,
      descripcion,
      monto_total,
      saldo_pendiente: monto_total,
      fecha_vencimiento,
      estado: 'pendiente'
    }])
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json(data[0])
}

export const updateDeuda = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const { descripcion, monto_total, fecha_vencimiento, estado } = req.body

  const { data, error } = await supabase
    .from('deudas')
    .update({ descripcion, monto_total, fecha_vencimiento, estado, updated_at: new Date() })
    .eq('id', id)
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.json(data[0])
}

export const deleteDeuda = async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  const { data: pagos } = await supabase
    .from('pagos')
    .select('id')
    .eq('deuda_id', id)

  if (pagos && pagos.length > 0) {
    return res.status(400).json({ error: 'No se puede eliminar una deuda con pagos registrados' })
  }

  const { error } = await supabase
    .from('deudas')
    .delete()
    .eq('id', id)

  if (error) return res.status(400).json({ error: error.message })
  res.json({ mensaje: 'Deuda eliminada correctamente' })
}