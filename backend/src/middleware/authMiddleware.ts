import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Interfaz que define la estructura del payload del JWT
export interface JwtPayload {
  id: string
  email: string
  rol: 'admin' | 'usuario'
  iat?: number
  exp?: number
}

// Extiende Request usando el payload tipado
export interface AuthRequest extends Request {
  usuario?: JwtPayload
}

export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    req.usuario = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

export const soloAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol administrador' })
  }
  next()
}