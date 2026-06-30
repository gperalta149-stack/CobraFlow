import rateLimit from 'express-rate-limit'

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,                   // 10 intentos por IP en esa ventana
  message: { error: 'Demasiados intentos. Probá de nuevo en unos minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
})