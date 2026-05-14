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

  // Verifica RN-09: no desactivar cliente con deudas pendientes o parciales
  const { data: deudasActivas } = await supabase
    .from('deudas')
    .select('id')
    .eq('cliente_id', id)
    .in('estado', ['pendiente', 'parcial'])

  if (deudasActivas && deudasActivas.length > 0) {
    return res.status(400).json({
      error: `No se puede desactivar el cliente porque tiene ${deudasActivas.length} deuda/s pendiente/s o parcial/es`
    })
  }

  // Soft delete: marca como inactivo sin eliminar el registro
  const { error } = await supabase
    .from('clientes')
    .update({ activo: false, updated_at: new Date() })
    .eq('id', id)

  if (error) return res.status(400).json({ error: error.message })
  res.json({ mensaje: 'Cliente desactivado correctamente' })
}

export const exportClientesToExcel = async (req: AuthRequest, res: Response) => {
  try {
    const { buscar } = req.query

    let query = supabase
      .from('clientes')
      .select('nombre, email, telefono, direccion, activo, created_at')
      .eq('activo', true)
      .order('nombre', { ascending: true })

    if (buscar) {
      query = query.or(`nombre.ilike.%${buscar}%,email.ilike.%${buscar}%`)
    }

    const { data: clientes, error } = await query

    if (error) throw error

    // Crear cabeceras del Excel
    const headers = ['Nombre', 'Email', 'Teléfono', 'Dirección', 'Fecha de registro']
    
    // Formatear datos
    const rows = clientes.map(c => [
      c.nombre,
      c.email || '',
      c.telefono || '',
      c.direccion || '',
      new Date(c.created_at).toLocaleDateString('es-AR')
    ])

    // Generar CSV (compatible con Excel)
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    // Agregar BOM para caracteres especiales (ñ, é, etc.)
    const bom = '\uFEFF'
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename=clientes_${new Date().toISOString().split('T')[0]}.csv`)
    res.send(bom + csvContent)

  } catch (error) {
    console.error('Error exportando clientes:', error)
    res.status(500).json({ error: 'Error al exportar clientes' })
  }
}