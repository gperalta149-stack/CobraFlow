import { Response } from 'express'
import { supabase } from '../config/supabase'
import { AuthRequest } from '../middleware/authMiddleware'

interface DeudaInsert {
  cliente_id: string
  descripcion: string
  monto_total: number
  monto_original: number
  cotizacion: number
  moneda: 'ARS' | 'USD'
  fecha_vencimiento: string
  estado: string
  usuario_id: string
  numero_factura?: string
  observaciones?: string
}

interface DeudaUpdate {
  updated_at: Date
  descripcion?: string
  monto_total?: number
  monto_original?: number
  cotizacion?: number
  moneda?: string
  fecha_vencimiento?: string
  estado?: string
  numero_factura?: string
  observaciones?: string
}

const actualizarVencidas = async () => {
  await supabase.rpc('actualizar_deudas_vencidas')
}

// ============================================
// GET /deudas
// Vista principal: pendientes, parciales, vencidas
// Excluye pagadas — esas están en /historial
// ============================================
export const getDeudas = async (req: AuthRequest, res: Response) => {
  const usuario_id = req.usuario?.id

  if (!usuario_id) {
    return res.status(401).json({ error: 'Usuario no autenticado' })
  }

  await actualizarVencidas()

  const { estado, cliente_id } = req.query

  let query = supabase
    .from('deudas')
    .select('*, clientes(nombre, email)')
    .eq('usuario_id', usuario_id)
    .eq('activo', true)
    .order('created_at', { ascending: false })

  if (estado) {
    // Si piden un estado específico, respetarlo
    query = query.eq('estado', estado)
  } else {
    // Sin filtro: mostrar solo las que requieren atención
    query = query.neq('estado', 'pagada')
  }

  if (cliente_id) query = query.eq('cliente_id', cliente_id)

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// ============================================
// GET /deudas/historial
// Solo deudas pagadas — historial contable
// ============================================
export const getHistorialDeudas = async (req: AuthRequest, res: Response) => {
  const usuario_id = req.usuario?.id

  if (!usuario_id) {
    return res.status(401).json({ error: 'Usuario no autenticado' })
  }

  const { cliente_id } = req.query

  let query = supabase
    .from('deudas')
    .select('*, clientes(nombre, email)')
    .eq('usuario_id', usuario_id)
    .eq('estado', 'pagada')
    .order('updated_at', { ascending: false })

  if (cliente_id) query = query.eq('cliente_id', cliente_id)

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// ============================================
// GET /deudas/:id
// ============================================
export const getDeudaById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const usuario_id = req.usuario?.id

  if (!usuario_id) {
    return res.status(401).json({ error: 'Usuario no autenticado' })
  }

  const { data, error } = await supabase
    .from('deudas')
    .select('*, clientes(nombre, email), pagos(*)')
    .eq('id', id)
    .eq('usuario_id', usuario_id)
    .single()

  if (error || !data) return res.status(404).json({ error: 'Deuda no encontrada' })
  res.json(data)
}

// ============================================
// POST /deudas
// ============================================
export const createDeuda = async (req: AuthRequest, res: Response) => {
  const {
    cliente_id,
    descripcion,
    monto_total,
    monto_original,
    cotizacion,
    moneda,
    fecha_vencimiento,
    numero_factura,
    observaciones,
  } = req.body

  if (!cliente_id || !descripcion || !monto_total || !fecha_vencimiento) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  const usuario_id = req.usuario?.id
  if (!usuario_id) {
    return res.status(401).json({ error: 'Usuario no autenticado' })
  }

  // Validar que el cliente pertenezca al usuario
  const { data: clienteExistente, error: clienteError } = await supabase
    .from('clientes')
    .select('id')
    .eq('id', cliente_id)
    .eq('usuario_id', usuario_id)
    .single()

  if (clienteError || !clienteExistente) {
    return res.status(404).json({ error: 'Cliente no encontrado' })
  }

  const fecha = new Date(fecha_vencimiento)
  if (isNaN(fecha.getTime()) || fecha.getFullYear() < 2000) {
    return res.status(400).json({ error: 'Fecha de vencimiento inválida' })
  }

  const monedaFinal: 'ARS' | 'USD' = moneda === 'USD' ? 'USD' : 'ARS'
  const cotizacionFinal = Number(cotizacion) || 1
  const montoOriginalFinal = Number(monto_original) || Number(monto_total)
  const montoTotalFinal = Number(monto_total)

  const insertData: DeudaInsert = {
    cliente_id,
    descripcion: descripcion.trim(),
    monto_total: montoTotalFinal,
    monto_original: montoOriginalFinal,
    cotizacion: cotizacionFinal,
    moneda: monedaFinal,
    fecha_vencimiento,
    estado: 'pendiente',
    usuario_id,
  }

  if (numero_factura?.trim()) insertData.numero_factura = numero_factura.trim()
  if (observaciones?.trim()) insertData.observaciones = observaciones.trim()

  const { data, error } = await supabase
    .from('deudas')
    .insert([insertData])
    .select()

  if (error) {
    console.error('❌ Supabase error:', JSON.stringify(error))
    return res.status(400).json({ error: error.message })
  }

  res.status(201).json(data[0])
}

// ============================================
// PUT /deudas/:id
// Solo editable si NO está pagada
// ============================================
export const updateDeuda = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const {
    descripcion,
    monto_total,
    monto_original,
    cotizacion,
    moneda,
    fecha_vencimiento,
    estado,
    numero_factura,
    observaciones,
  } = req.body

  const usuario_id = req.usuario?.id
  if (!usuario_id) {
    return res.status(401).json({ error: 'Usuario no autenticado' })
  }

  const { data: deudaExistente, error: checkError } = await supabase
    .from('deudas')
    .select('id, estado')
    .eq('id', id)
    .eq('usuario_id', usuario_id)
    .single()

  if (checkError || !deudaExistente) {
    return res.status(404).json({ error: 'Deuda no encontrada' })
  }

  if (deudaExistente.estado === 'pagada') {
    return res.status(403).json({
      error: 'No se puede editar una deuda ya pagada'
    })
  }

  const updateData: DeudaUpdate = { updated_at: new Date() }

  if (descripcion !== undefined) updateData.descripcion = descripcion.trim()
  if (monto_total !== undefined) updateData.monto_total = Number(monto_total)
  if (monto_original !== undefined) updateData.monto_original = Number(monto_original)
  if (cotizacion !== undefined) updateData.cotizacion = Number(cotizacion)
  if (moneda !== undefined) updateData.moneda = moneda
  if (fecha_vencimiento !== undefined) updateData.fecha_vencimiento = fecha_vencimiento
  if (estado !== undefined) updateData.estado = estado
  if (numero_factura !== undefined) updateData.numero_factura = numero_factura?.trim() || null
  if (observaciones !== undefined) updateData.observaciones = observaciones?.trim() || null

  const { data, error } = await supabase
    .from('deudas')
    .update(updateData)
    .eq('id', id)
    .eq('usuario_id', usuario_id)
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.json(data[0])
}

// ============================================
// DELETE /deudas/:id — BLOQUEADO SIEMPRE
// Las deudas son historial contable, nunca se eliminan.
// ============================================
export const deleteDeuda = async (_req: AuthRequest, res: Response) => {
  return res.status(403).json({
    error: 'Las deudas no pueden eliminarse. Son parte del historial contable.'
  })
}