import { Router } from 'express'
import {
  getDeudas,
  getDeudaById,
  createDeuda,
  updateDeuda,
  deleteDeuda
} from '../controllers/deudasController'
import { verificarToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', verificarToken, getDeudas)
router.get('/:id', verificarToken, getDeudaById)
router.post('/', verificarToken, createDeuda)
router.put('/:id', verificarToken, updateDeuda)
router.delete('/:id', verificarToken, deleteDeuda)

export default router