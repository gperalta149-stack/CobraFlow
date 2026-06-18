import { Router } from 'express'
import { getPagos, getPagosByCliente, createPago } from '../controllers/pagosController'
import { verificarToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', verificarToken, getPagos)
router.get('/cliente/:cliente_id', verificarToken, getPagosByCliente)
router.post('/', verificarToken, createPago)

export default router