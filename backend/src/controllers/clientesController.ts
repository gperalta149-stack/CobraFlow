import { Request, Response } from 'express'
import { supabase } from '../config/supabase'
import { AuthRequest } from '../middleware/authMiddleware'

export const getClientes = async (req: AuthRequest, res: Response) => {
  const { buscar } = req.query

  let query = supabase
    .from('clientes')
    .select('*')
    .eq('activo', true)
    .order('created_at', { ascending: false })

  if (buscar) {
    query = query.or(`nombre.ilike.%${buscar}%,email.ilike.%${buscar}%`)
  }

  const { data, error } = await query

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

export const getClienteById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return res.status(404).json({ error: 'Cliente no encontrado' })
  res.json(data)
}

export const createCliente = async (req: AuthRequest, res: Response) => {
  const { nombre, email, telefono, direccion } = req.body

  if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' })

  const { data, error } = await supabase
    .from('clientes')
    .insert([{ nombre, email, telefono, direccion }])
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json(data[0])
}

export const updateCliente = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const { nombre, email, telefono, direccion } = req.body

  const { data, error } = await supabase
    .from('clientes')
    .update({ nombre, email, telefono, direccion, updated_at: new Date() })
    .eq('id', id)
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.json(data[0])
}

export const deleteCliente = async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  const { error } = await supabase
    .from('clientes')
    .update({ activo: false })
    .eq('id', id)

  if (error) return res.status(400).json({ error: error.message })
  res.json({ mensaje: 'Cliente desactivado correctamente' })
}