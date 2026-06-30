// backend/src/routes/authRoutes.ts
import { Router } from 'express'
import { 
  register, 
  login, 
  actualizarPerfil, 
  cambiarPassword, 
  obtenerMora, 
  actualizarMora 
} from '../controllers/authController'
import { 
  getConfiguracionMoneda, 
  updateConfiguracionMoneda 
} from '../controllers/monedaController'  // ← NUEVO
import { verificarToken } from '../middleware/authMiddleware'
import { authLimiter } from '../middleware/rateLimiter'

const router = Router()

router.post('/register',authLimiter, register)
router.post('/login',authLimiter, login)
router.put('/perfil', verificarToken, actualizarPerfil)
router.put('/cambiar-password', verificarToken, cambiarPassword)
router.get('/mora', verificarToken, obtenerMora)
router.put('/mora', verificarToken, actualizarMora)

// NUEVAS RUTAS para configuración de moneda
router.get('/moneda', verificarToken, getConfiguracionMoneda)
router.put('/moneda', verificarToken, updateConfiguracionMoneda)

export default router