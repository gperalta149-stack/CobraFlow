import { Router } from 'express'
import { 
  getCurrentRate, 
  getStoredRate, 
  manualSaveRate, 
  forceUpdateRate 
} from '../controllers/exchangeRateController'
import { verificarToken, soloAdmin } from '../middleware/authMiddleware'

const router = Router()

// Obtener cotización actual desde API externa (público)
router.get('/current', getCurrentRate)

// Obtener cotización guardada en BD (requiere autenticación)
router.get('/stored', verificarToken, getStoredRate)

// Guardar cotización manualmente (solo admin)
router.post('/save', verificarToken, soloAdmin, manualSaveRate)

// Forzar actualización (solo admin)
router.post('/force-update', verificarToken, soloAdmin, forceUpdateRate)

export default router