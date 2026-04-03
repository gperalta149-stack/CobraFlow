import { Router } from 'express'
import { getPagos, createPago } from '../controllers/pagosController'
import { verificarToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', verificarToken, getPagos)
router.post('/', verificarToken, createPago)

export default router