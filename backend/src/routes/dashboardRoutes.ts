import { Router } from 'express'
import { getDashboard, getEvolucionPagos } from '../controllers/dashboardController'
import { verificarToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', verificarToken, getDashboard)
router.get('/evolucion-pagos', verificarToken, getEvolucionPagos)  // ← NUEVA RUTA

export default router