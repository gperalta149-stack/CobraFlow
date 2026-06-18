import { Request, Response } from 'express'
import { AuthRequest } from '../middleware/authMiddleware'
import { 
  fetchOfficialExchangeRate, 
  fetchBlueExchangeRate, 
  saveExchangeRate,
  getCurrentExchangeRate,
  updateDailyExchangeRate 
} from '../services/exchangeRateService'

// Obtener cotización actual (desde API externa)
export const getCurrentRate = async (req: AuthRequest, res: Response) => {
  try {
    const { tipo = 'oficial' } = req.query
    
    let rate
    if (tipo === 'blue') {
      rate = await fetchBlueExchangeRate()
    } else {
      rate = await fetchOfficialExchangeRate()
    }
    
    res.json(rate)
  } catch (error) {
    console.error('Error en getCurrentRate:', error)
    res.status(500).json({ error: 'Error al obtener la cotización' })
  }
}

// Obtener cotización guardada en la base de datos
export const getStoredRate = async (req: AuthRequest, res: Response) => {
  try {
    const rate = await getCurrentExchangeRate()
    res.json(rate || { message: 'No hay cotización registrada' })
  } catch (error) {
    console.error('Error en getStoredRate:', error)
    res.status(500).json({ error: 'Error al obtener la cotización guardada' })
  }
}

// Guardar cotización manualmente (solo admin)
export const manualSaveRate = async (req: AuthRequest, res: Response) => {
  try {
    const { compra, venta, fuente } = req.body
    
    if (!compra || !venta) {
      return res.status(400).json({ error: 'Compra y venta son requeridos' })
    }
    
    const saved = await saveExchangeRate(compra, venta, fuente || 'manual')
    res.json({ message: 'Cotización guardada', data: saved })
  } catch (error) {
    console.error('Error en manualSaveRate:', error)
    res.status(500).json({ error: 'Error al guardar la cotización' })
  }
}

// Forzar actualización diaria (endpoint para triggers)
export const forceUpdateRate = async (req: AuthRequest, res: Response) => {
  try {
    // Solo admin puede forzar actualización
    if (req.usuario?.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' })
    }
    
    const updated = await updateDailyExchangeRate()
    res.json({ message: 'Cotización actualizada', data: updated })
  } catch (error) {
    console.error('Error en forceUpdateRate:', error)
    res.status(500).json({ error: 'Error al forzar actualización' })
  }
}