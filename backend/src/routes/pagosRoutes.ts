import { Router } from 'express'
import { getPagos, getPagosByCliente, createPago, anularPago } from '../controllers/pagosController'
import { verificarToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', verificarToken, getPagos)
router.get('/cliente/:cliente_id', verificarToken, getPagosByCliente)
router.post('/', verificarToken, createPago)
router.put('/:id/anular', verificarToken, anularPago)

export default router