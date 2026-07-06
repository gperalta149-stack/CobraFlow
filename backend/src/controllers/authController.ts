import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase'
import { AuthRequest } from '../middleware/authMiddleware'

export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, email, password } = req.body

    if (!nombre || !apellido || !email || !password) {
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

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: data[0]
    })
  } catch (error) {
    console.error('Error inesperado en register:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
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
        apellido: data.apellido,
        email: data.email,
        rol: data.rol
      }
    })
  } catch (error) {
    console.error('Error inesperado en login:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const actualizarPerfil = async (req: AuthRequest, res: Response) => {
  try {
    const { nombre, apellido, email } = req.body
    const id = req.usuario?.id

    if (!id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    if (!nombre || !apellido || !email) {
      return res.status(400).json({ error: 'Nombre, apellido y email son obligatorios' })
    }

    const { data, error } = await supabase
      .from('usuarios')
      .update({
        nombre,
        apellido,
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
  } catch (error) {
    console.error('Error inesperado en actualizarPerfil:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const cambiarPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { passwordActual, passwordNuevo } = req.body
    const id = req.usuario?.id

    if (!id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    if (!passwordActual || !passwordNuevo) {
      return res.status(400).json({ error: 'Contraseña actual y nueva son obligatorias' })
    }

    if (typeof passwordNuevo !== 'string' || passwordNuevo.length < 6) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' })
    }

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

    const { error: updateError } = await supabase
      .from('usuarios')
      .update({
        password: hashedPassword,
        updated_at: new Date()
      })
      .eq('id', id)

    if (updateError) {
      console.error('Error actualizando contraseña:', updateError)
      return res.status(400).json({ error: updateError.message })
    }

    res.json({ mensaje: 'Contraseña cambiada correctamente' })
  } catch (error) {
    console.error('Error inesperado en cambiarPassword:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const obtenerMora = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.usuario?.id
    if (!id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    const { data, error } = await supabase
      .from('usuarios')
      .select('mora_activa, mora_porcentaje, mora_tipo')
      .eq('id', id)
      .single()

    if (error || !data) return res.status(404).json({ error: 'Usuario no encontrado' })

    res.json(data)
  } catch (error) {
    console.error('Error inesperado en obtenerMora:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const actualizarMora = async (req: AuthRequest, res: Response) => {
  try {
    const { mora_activa, mora_porcentaje, mora_tipo } = req.body
    const id = req.usuario?.id

    if (!id) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    if (typeof mora_activa !== 'boolean') {
      return res.status(400).json({ error: 'mora_activa debe ser booleano' })
    }

    const porcentajeNum = Number(mora_porcentaje)
    if (Number.isNaN(porcentajeNum) || porcentajeNum < 0 || porcentajeNum > 100) {
      return res.status(400).json({ error: 'El porcentaje debe estar entre 0 y 100' })
    }

    if (mora_tipo !== 'unica' && mora_tipo !== 'mensual') {
      return res.status(400).json({ error: "mora_tipo debe ser 'unica' o 'mensual'" })
    }

    const { data, error } = await supabase
      .from('usuarios')
      .update({ mora_activa, mora_porcentaje: porcentajeNum, mora_tipo, updated_at: new Date() })
      .eq('id', id)
      .select('mora_activa, mora_porcentaje, mora_tipo')

    if (error) return res.status(400).json({ error: error.message })

    res.json({ mensaje: 'Configuración de mora actualizada', config: data[0] })
  } catch (error) {
    console.error('Error inesperado en actualizarMora:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}