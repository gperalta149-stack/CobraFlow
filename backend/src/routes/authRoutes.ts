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

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.put('/perfil', verificarToken, actualizarPerfil)
router.put('/cambiar-password', verificarToken, cambiarPassword)
router.get('/mora', verificarToken, obtenerMora)
router.put('/mora', verificarToken, actualizarMora)

// NUEVAS RUTAS para configuración de moneda
router.get('/moneda', verificarToken, getConfiguracionMoneda)
router.put('/moneda', verificarToken, updateConfiguracionMoneda)

export default router