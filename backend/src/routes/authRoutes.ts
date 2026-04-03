import { Router } from 'express'
import { register, login, actualizarPerfil, cambiarPassword } from '../controllers/authController'
import { verificarToken } from '../middleware/authMiddleware'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.put('/perfil', verificarToken, actualizarPerfil)
router.put('/cambiar-password', verificarToken, cambiarPassword)

export default router