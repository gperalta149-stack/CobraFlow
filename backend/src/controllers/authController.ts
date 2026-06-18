import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase'
import { AuthRequest } from '../middleware/authMiddleware'

  export const register = async (req: Request, res: Response) => {
  console.log('🔍 register llamado')
  console.log('📦 Body recibido:', req.body)
  
  const { nombre, apellido, email, password } = req.body

  console.log('📝 Campos:', { nombre, apellido, email, password: '***' })

  if (!nombre || !apellido || !email || !password) {
    console.log('❌ Faltan campos:', { 
      nombre: !nombre, 
      apellido: !apellido, 
      email: !email, 
      password: !password 
    })
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ 
      nombre, 
      apellido,
      email, 
      password: hashedPassword, 
      rol: 'usuario' 
    }])
    .select()

  if (error) {
    console.error('❌ Supabase error:', error)
    return res.status(400).json({ error: error.message })
  }

  console.log('✅ Usuario creado:', data[0])
  res.status(201).json({
    mensaje: 'Usuario registrado correctamente',
    usuario: data[0]
  })
}

  export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' })
    }

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !data) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    if (!data.activo) {
      return res.status(401).json({ error: 'Cuenta desactivada' })
    }

    const passwordValido = await bcrypt.compare(password, data.password)

    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    const token = jwt.sign(
      { id: data.id, email: data.email, rol: data.rol },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    )

    res.json({
      token,
      usuario: {
        id: data.id,
        nombre: data.nombre,
        apellido: data.apellido,  // ← AGREGAR
        email: data.email,
        rol: data.rol
      }
    })
  }

  export const actualizarPerfil = async (req: AuthRequest, res: Response) => {
    const { nombre, apellido, email } = req.body
    const id = req.usuario.id

    if (!nombre || !apellido || !email) {
      return res.status(400).json({ error: 'Nombre, apellido y email son obligatorios' })
    }

    const { data, error } = await supabase
      .from('usuarios')
      .update({
        nombre,
        apellido,  // ← AGREGAR
        email,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()

    if (error) return res.status(400).json({ error: error.message })

    res.json({
      mensaje: 'Perfil actualizado',
      usuario: data[0]
    })
  }


export const cambiarPassword = async (req: AuthRequest, res: Response) => {
  const { passwordActual, passwordNuevo } = req.body
  const id = req.usuario.id

  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }

  const passwordValido = await bcrypt.compare(passwordActual, data.password)

  if (!passwordValido) {
    return res.status(401).json({ error: 'Contraseña actual incorrecta' })
  }

  const hashedPassword = await bcrypt.hash(passwordNuevo, 10)

  await supabase
    .from('usuarios')
    .update({
      password: hashedPassword,
      updated_at: new Date()
    })
    .eq('id', id)

  res.json({ mensaje: 'Contraseña cambiada correctamente' })
}

export const obtenerMora = async (req: AuthRequest, res: Response) => {
  const id = req.usuario.id

  const { data, error } = await supabase
    .from('usuarios')
    .select('mora_activa, mora_porcentaje, mora_tipo')
    .eq('id', id)
    .single()

  if (error || !data) return res.status(404).json({ error: 'Usuario no encontrado' })

  res.json(data)
}

export const actualizarMora = async (req: AuthRequest, res: Response) => {
  const { mora_activa, mora_porcentaje, mora_tipo } = req.body
  const id = req.usuario.id

  if (mora_porcentaje < 0 || mora_porcentaje > 100) {
    return res.status(400).json({ error: 'El porcentaje debe estar entre 0 y 100' })
  }

  const { data, error } = await supabase
    .from('usuarios')
    .update({ mora_activa, mora_porcentaje, mora_tipo, updated_at: new Date() })
    .eq('id', id)
    .select('mora_activa, mora_porcentaje, mora_tipo')

  if (error) return res.status(400).json({ error: error.message })

  res.json({ mensaje: 'Configuración de mora actualizada', config: data[0] })
}