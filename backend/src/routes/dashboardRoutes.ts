import { Router } from 'express'
import { getDashboard } from '../controllers/dashboardController'
import { verificarToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', verificarToken, getDashboard)

export default router