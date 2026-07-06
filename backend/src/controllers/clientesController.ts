import { AuthRequest } from '../middleware/authMiddleware'
import { Response } from 'express'
import { supabase } from '../config/supabase'
import { buscarClientePropio, dniYaExiste, construirFiltroBusqueda } from '../utils/clienteHelpers'
import type { ClienteInsert, ClienteUpdate } from '../types/cliente.types'

// ============================================
// OBTENER TODOS LOS CLIENTES (solo activos)
// ============================================
export const getClientes = async (req: AuthRequest, res: Response) => {
  try {
    const { buscar, page = '1', limit = '10' } = req.query
    const usuario_id = req.usuario?.id

    if (!usuario_id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    const pageNum = Math.max(1, parseInt(page as string) || 1)
    const limitNum = Math.min(500, Math.max(1, parseInt(limit as string) || 10))
    const offset = (pageNum - 1) * limitNum

    let query = supabase
      .from('clientes')
      .select('*', { count: 'exact' })
      .eq('usuario_id', usuario_id)
      .eq('activo', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1)

    if (buscar) query = query.or(construirFiltroBusqueda(buscar as string))

    const { data, error, count } = await query

    if (error) {
      console.error('Error en getClientes:', error)
      return res.status(500).json({ error: error.message })
    }

    res.setHeader('X-Total-Count', count || 0)
    res.json(data)
  } catch (error) {
    console.error('Error inesperado en getClientes:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// ============================================
// OBTENER CLIENTES ARCHIVADOS
// ============================================
export const getClientesArchivados = async (req: AuthRequest, res: Response) => {
  try {
    const { buscar, page = '1', limit = '10' } = req.query
    const usuario_id = req.usuario?.id

    if (!usuario_id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    const pageNum = Math.max(1, parseInt(page as string) || 1)
    const limitNum = Math.min(500, Math.max(1, parseInt(limit as string) || 10))
    const offset = (pageNum - 1) * limitNum

    let query = supabase
      .from('clientes')
      .select('*', { count: 'exact' })
      .eq('usuario_id', usuario_id)
      .eq('activo', false)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limitNum - 1)

    if (buscar) query = query.or(construirFiltroBusqueda(buscar as string))

    const { data, error, count } = await query

    if (error) {
      console.error('Error en getClientesArchivados:', error)
      return res.status(500).json({ error: error.message })
    }

    res.setHeader('X-Total-Count', count || 0)
    res.json(data)
  } catch (error) {
    console.error('Error inesperado en getClientesArchivados:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// ============================================
// OBTENER CLIENTE POR ID
// ============================================
export const getClienteById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const usuario_id = req.usuario?.id

    if (!usuario_id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .eq('usuario_id', usuario_id)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    res.json(data)
  } catch (error) {
    console.error('Error inesperado en getClienteById:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// ============================================
// CREAR CLIENTE
// ============================================
export const createCliente = async (req: AuthRequest, res: Response) => {
  try {
    const {
      nombre, apellido, dni, email, telefono,
      direccion, ciudad, provincia, empresa, observaciones
    } = req.body
    const usuario_id = req.usuario?.id

    if (!usuario_id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    // Validaciones obligatorias
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre es obligatorio' })
    }
    if (!apellido || apellido.trim() === '') {
      return res.status(400).json({ error: 'El apellido es obligatorio' })
    }
    if (!dni || dni.trim() === '') {
      return res.status(400).json({ error: 'El DNI es obligatorio' })
    }
    if (!telefono || telefono.trim() === '') {
      return res.status(400).json({ error: 'El teléfono es obligatorio' })
    }

    if (await dniYaExiste(usuario_id, dni)) {
      return res.status(400).json({ error: 'Ya existe un cliente con ese DNI' })
    }

    const insertData: ClienteInsert = {
      usuario_id,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      dni: dni.trim(),
      email: email?.trim() || null,
      telefono: telefono.trim(),
      direccion: direccion?.trim() || null,
      ciudad: ciudad?.trim() || null,
      provincia: provincia?.trim() || null,
      empresa: empresa?.trim() || null,
      observaciones: observaciones?.trim() || null,
    }

    const { data, error } = await supabase
      .from('clientes')
      .insert([insertData])
      .select()

    if (error) {
      console.error('Error en createCliente:', error)
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json(data[0])
  } catch (error) {
    console.error('Error inesperado en createCliente:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// ============================================
// ACTUALIZAR CLIENTE
// ============================================
export const updateCliente = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const {
      nombre, apellido, dni, email, telefono,
      direccion, ciudad, provincia, empresa, observaciones
    } = req.body
    const usuario_id = req.usuario?.id

    if (!usuario_id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    const clienteExistente = await buscarClientePropio(id, usuario_id, 'id, nombre, apellido, dni')
    if (!clienteExistente) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    if (dni && dni !== clienteExistente.dni && (await dniYaExiste(usuario_id, dni, id))) {
      return res.status(400).json({ error: 'Ya existe otro cliente con ese DNI' })
    }

    const updateData: ClienteUpdate = {
      updated_at: new Date(),
      nombre: nombre?.trim(),
      apellido: apellido?.trim(),
      dni: dni?.trim(),
      email: email?.trim() || null,
      telefono: telefono?.trim() || null,
      direccion: direccion?.trim() || null,
      ciudad: ciudad?.trim() || null,
      provincia: provincia?.trim() || null,
      empresa: empresa?.trim() || null,
      observaciones: observaciones?.trim() || null,
    }

    const { data, error } = await supabase
      .from('clientes')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error en updateCliente:', error)
      return res.status(400).json({ error: error.message })
    }

    res.json(data[0])
  } catch (error) {
    console.error('Error inesperado en updateCliente:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// ============================================
// ARCHIVAR CLIENTE
// ============================================
export const archivarCliente = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const usuario_id = req.usuario?.id

    if (!usuario_id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    const clienteExistente = await buscarClientePropio(id, usuario_id)
    if (!clienteExistente) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    if (!clienteExistente.activo) {
      return res.status(400).json({ error: 'El cliente ya está archivado' })
    }

    const { error } = await supabase
      .from('clientes')
      .update({ activo: false, updated_at: new Date() })
      .eq('id', id)

    if (error) {
      console.error('Error archivando cliente:', error)
      return res.status(400).json({ error: error.message })
    }

    res.json({
      mensaje: `Cliente "${clienteExistente.nombre} ${clienteExistente.apellido}" archivado correctamente`,
      cliente: clienteExistente
    })
  } catch (error) {
    console.error('Error inesperado en archivarCliente:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// ============================================
// RESTAURAR CLIENTE ARCHIVADO
// ============================================
export const restaurarCliente = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const usuario_id = req.usuario?.id

    if (!usuario_id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    const clienteExistente = await buscarClientePropio(id, usuario_id)
    if (!clienteExistente) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    if (clienteExistente.activo) {
      return res.status(400).json({ error: 'El cliente ya está activo' })
    }

    const { error } = await supabase
      .from('clientes')
      .update({ activo: true, updated_at: new Date() })
      .eq('id', id)

    if (error) {
      console.error('Error restaurando cliente:', error)
      return res.status(400).json({ error: error.message })
    }

    res.json({
      mensaje: `Cliente "${clienteExistente.nombre} ${clienteExistente.apellido}" restaurado correctamente`,
      cliente: clienteExistente
    })
  } catch (error) {
    console.error('Error inesperado en restaurarCliente:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// ============================================
// EXPORTAR CLIENTES A EXCEL (CSV)
// ============================================
export const exportClientesToExcel = async (req: AuthRequest, res: Response) => {
  try {
    const { buscar } = req.query
    const usuario_id = req.usuario?.id

    if (!usuario_id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    let query = supabase
      .from('clientes')
      .select('nombre, apellido, dni, email, telefono, direccion, ciudad, provincia, empresa, observaciones, created_at')
      .eq('usuario_id', usuario_id)
      .eq('activo', true)
      .order('apellido', { ascending: true })

    if (buscar) query = query.or(construirFiltroBusqueda(buscar as string))

    const { data: clientes, error } = await query

    if (error) {
      console.error('Error exportando clientes:', error)
      return res.status(500).json({ error: 'Error al exportar clientes' })
    }

    const headers = [
      'Nombre', 'Apellido', 'DNI', 'Email', 'Teléfono',
      'Dirección', 'Ciudad', 'Provincia', 'Empresa', 'Observaciones', 'Fecha de registro'
    ]

    const rows = clientes.map(c => [
      c.nombre,
      c.apellido,
      c.dni,
      c.email || '',
      c.telefono || '',
      c.direccion || '',
      c.ciudad || '',
      c.provincia || '',
      c.empresa || '',
      c.observaciones || '',
      new Date(c.created_at).toLocaleDateString('es-AR')
    ])

    let csvContent = headers.join(';') + '\n'

    rows.forEach(row => {
      const processedRow = row.map(cell => {
        if (cell.includes(';') || cell.includes('"')) {
          return `"${cell.replace(/"/g, '""')}"`
        }
        return cell
      })
      csvContent += processedRow.join(';') + '\n'
    })

    const bom = '\uFEFF'

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename=clientes_${new Date().toISOString().split('T')[0]}.csv`)
    res.send(bom + csvContent)

  } catch (error) {
    console.error('Error inesperado exportando clientes:', error)
    res.status(500).json({ error: 'Error al exportar clientes' })
  }
}

// ============================================
// OBTENER RESUMEN FINANCIERO POR CLIENTE
// ============================================
export const getResumenFinanciero = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const usuario_id = req.usuario?.id

    if (!usuario_id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    const cliente = await buscarClientePropio(id, usuario_id, 'nombre, apellido, dni')
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    // Obtener todas las deudas del cliente
    const { data: deudas, error: deudasError } = await supabase
      .from('deudas')
      .select('monto_total, monto_pagado, saldo_pendiente, estado, fecha_vencimiento')
      .eq('cliente_id', id)

    if (deudasError) {
      console.error('Error obteniendo deudas:', deudasError)
      return res.status(500).json({ error: 'Error al obtener deudas' })
    }

    // Calcular métricas
    const totalDeudas = deudas.length
    const totalMonto = deudas.reduce((sum, d) => sum + Number(d.monto_total), 0)
    const totalPagado = deudas.reduce((sum, d) => sum + Number(d.monto_pagado), 0)
    const totalPendiente = deudas.reduce((sum, d) => sum + Number(d.saldo_pendiente), 0)

    const deudasPorEstado = {
      pendiente: deudas.filter(d => d.estado === 'pendiente').length,
      parcial: deudas.filter(d => d.estado === 'parcial').length,
      pagada: deudas.filter(d => d.estado === 'pagada').length,
      vencida: deudas.filter(d => d.estado === 'vencida').length,
    }

    const tasaRecuperacion = totalMonto > 0
      ? ((totalPagado / totalMonto) * 100).toFixed(1)
      : '0.0'

    // Obtener última deuda
    const { data: ultimaDeuda } = await supabase
      .from('deudas')
      .select('descripcion, monto_total, fecha_vencimiento, estado')
      .eq('cliente_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    res.json({
      cliente: `${cliente.nombre} ${cliente.apellido}`,
      dni: cliente.dni,
      totalDeudas,
      totalMonto,
      totalPagado,
      totalPendiente,
      deudasPorEstado,
      tasaRecuperacion,
      ultimaDeuda: ultimaDeuda || null
    })
  } catch (error) {
    console.error('Error inesperado en getResumenFinanciero:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// ============================================
// IMPORTAR CLIENTES DESDE CSV
// ============================================
export const importClientesFromCSV = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' })
    }

    const usuario_id = req.usuario?.id
    if (!usuario_id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    const csvContent = req.file.buffer.toString('utf-8')
    const lines = csvContent.split('\n').filter(line => line.trim())

    if (lines.length < 2) {
      return res.status(400).json({ error: 'El archivo no contiene datos' })
    }

    // Leer cabeceras (primera línea) - espera separador punto y coma
    const headers = lines[0].split(';').map(h => h.replace(/["']/g, '').trim().toLowerCase())

    // Mapear índices de columnas
    const nombreIndex = headers.findIndex(h => h === 'nombre')
    const apellidoIndex = headers.findIndex(h => h === 'apellido')
    const dniIndex = headers.findIndex(h => h === 'dni')
    const telefonoIndex = headers.findIndex(h => h === 'teléfono' || h === 'telefono')
    const emailIndex = headers.findIndex(h => h === 'email')
    const direccionIndex = headers.findIndex(h => h === 'dirección' || h === 'direccion')
    const ciudadIndex = headers.findIndex(h => h === 'ciudad')
    const provinciaIndex = headers.findIndex(h => h === 'provincia')
    const empresaIndex = headers.findIndex(h => h === 'empresa')
    const observacionesIndex = headers.findIndex(h => h === 'observaciones')

    // Validar columnas obligatorias
    const missingColumns = []
    if (nombreIndex === -1) missingColumns.push('Nombre')
    if (apellidoIndex === -1) missingColumns.push('Apellido')
    if (dniIndex === -1) missingColumns.push('DNI')
    if (telefonoIndex === -1) missingColumns.push('Teléfono')

    if (missingColumns.length > 0) {
      return res.status(400).json({
        error: `El archivo debe tener las siguientes columnas: ${missingColumns.join(', ')}`
      })
    }

    const clientesCreados = []
    const errores = []

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(';').map(v => v.replace(/["']/g, '').trim())

        const nombre = values[nombreIndex]
        const apellido = values[apellidoIndex]
        const dni = values[dniIndex]
        const telefono = values[telefonoIndex]

        // Validar campos obligatorios
        if (!nombre) {
          errores.push(`Fila ${i + 1}: Nombre requerido`)
          continue
        }
        if (!apellido) {
          errores.push(`Fila ${i + 1}: Apellido requerido`)
          continue
        }
        if (!dni) {
          errores.push(`Fila ${i + 1}: DNI requerido`)
          continue
        }
        if (!telefono) {
          errores.push(`Fila ${i + 1}: Teléfono requerido`)
          continue
        }

        if (await dniYaExiste(usuario_id, dni)) {
          errores.push(`Fila ${i + 1}: Ya existe un cliente con DNI ${dni}`)
          continue
        }

        // Validar email si está presente
        const email = emailIndex !== -1 ? values[emailIndex] : null
        if (email && !email.includes('@')) {
          errores.push(`Fila ${i + 1}: Email inválido (${email})`)
          continue
        }

        const nuevoCliente: ClienteInsert = {
          usuario_id,
          nombre,
          apellido,
          dni,
          telefono,
          email: email || null,
          direccion: direccionIndex !== -1 ? values[direccionIndex] || null : null,
          ciudad: ciudadIndex !== -1 ? values[ciudadIndex] || null : null,
          provincia: provinciaIndex !== -1 ? values[provinciaIndex] || null : null,
          empresa: empresaIndex !== -1 ? values[empresaIndex] || null : null,
          observaciones: observacionesIndex !== -1 ? values[observacionesIndex] || null : null,
        }

        const { data, error } = await supabase
          .from('clientes')
          .insert([nuevoCliente])
          .select()

        if (error) {
          errores.push(`Fila ${i + 1}: ${error.message}`)
        } else if (data) {
          clientesCreados.push(data[0])
        }
      } catch (err) {
        errores.push(`Fila ${i + 1}: Error al procesar`)
      }
    }

    res.json({
      mensaje: `Importación completada. ${clientesCreados.length} clientes creados.`,
      clientesCreados: clientesCreados.length,
      errores: errores.length > 0 ? errores : undefined
    })
  } catch (error) {
    console.error('Error en importClientesFromCSV:', error)
    res.status(500).json({ error: 'Error al importar clientes' })
  }
}