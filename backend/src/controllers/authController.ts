import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase'
import { AuthRequest } from '../middleware/authMiddleware'

export const register = async (req: Request, res: Response) => {
  const { nombre, email, password } = req.body

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ nombre, email, password: hashedPassword, rol: 'usuario' }])
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json({ mensaje: 'Usuario registrado correctamente', usuario: data[0] })
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

  if (error || !data) return res.status(401).json({ error: 'Credenciales incorrectas' })

  const passwordValido = await bcrypt.compare(password, data.password)
  if (!passwordValido) return res.status(401).json({ error: 'Credenciales incorrectas' })

  const token = jwt.sign(
    { id: data.id, email: data.email, rol: data.rol },
    process.env.JWT_SECRET!,
    { expiresIn: '8h' }
  )

  res.json({ token, usuario: { id: data.id, nombre: data.nombre, email: data.email, rol: data.rol } })
}

export const actualizarPerfil = async (req: AuthRequest, res: Response) => {
  const { nombre, email } = req.body
  const id = req.usuario.id

  const { data, error } = await supabase
    .from('usuarios')
    .update({ nombre, email, updated_at: new Date() })
    .eq('id', id)
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.json({ mensaje: 'Perfil actualizado', usuario: data[0] })
}

export const cambiarPassword = async (req: AuthRequest, res: Response) => {
  const { passwordActual, passwordNuevo } = req.body
  const id = req.usuario.id

  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return res.status(404).json({ error: 'Usuario no encontrado' })

  const passwordValido = await bcrypt.compare(passwordActual, data.password)
  if (!passwordValido) return res.status(401).json({ error: 'Contraseña actual incorrecta' })

  const hashedPassword = await bcrypt.hash(passwordNuevo, 10)

  await supabase
    .from('usuarios')
    .update({ password: hashedPassword, updated_at: new Date() })
    .eq('id', id)

  res.json({ mensaje: 'Contraseña cambiada correctamente' })
}