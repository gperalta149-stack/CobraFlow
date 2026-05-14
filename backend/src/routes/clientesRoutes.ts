import { Router } from 'express'
import {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente
} from '../controllers/clientesController'
import { verificarToken } from '../middleware/authMiddleware'
import { exportClientesToExcel } from '../controllers/clientesController'


const router = Router()

router.get('/', verificarToken, getClientes)
router.get('/:id', verificarToken, getClienteById)
router.get('/export/excel', verificarToken, exportClientesToExcel)
router.post('/', verificarToken, createCliente)
router.put('/:id', verificarToken, updateCliente)
router.delete('/:id', verificarToken, deleteCliente)

export default router