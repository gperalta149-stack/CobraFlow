import { Router } from 'express'
import {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente
} from '../controllers/clientesController'
import { verificarToken } from '../middleware/authMiddleware'

const router = Router()

router.get('/', verificarToken, getClientes)
router.get('/:id', verificarToken, getClienteById)
router.post('/', verificarToken, createCliente)
router.put('/:id', verificarToken, updateCliente)
router.delete('/:id', verificarToken, deleteCliente)

export default router