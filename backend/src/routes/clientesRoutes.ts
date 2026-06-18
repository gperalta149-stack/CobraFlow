import { Router } from 'express'
import {
  getClientes,
  getClientesArchivados,   // ← NUEVO
  getClienteById,
  createCliente,
  updateCliente,
  archivarCliente,          // ← NUEVO (reemplaza deleteCliente)
  restaurarCliente,         // ← NUEVO
  exportClientesToExcel,
  importClientesFromCSV,
  getResumenFinanciero
} from '../controllers/clientesController'
import { verificarToken } from '../middleware/authMiddleware'
import multer from 'multer'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

// Rutas de clientes
router.get('/', verificarToken, getClientes)
router.get('/archivados', verificarToken, getClientesArchivados)  // ← NUEVA RUTA
router.get('/export/excel', verificarToken, exportClientesToExcel)
router.get('/:id', verificarToken, getClienteById)
router.get('/:id/resumen-financiero', verificarToken, getResumenFinanciero)

// Crear y actualizar
router.post('/', verificarToken, createCliente)
router.post('/import/csv', verificarToken, upload.single('file'), importClientesFromCSV)
router.put('/:id', verificarToken, updateCliente)

// Archivar y restaurar (en lugar de eliminar)
router.post('/:id/archivar', verificarToken, archivarCliente)     // ← NUEVA RUTA
router.post('/:id/restaurar', verificarToken, restaurarCliente)   // ← NUEVA RUTA


export default router