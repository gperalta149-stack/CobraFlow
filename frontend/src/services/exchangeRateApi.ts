import api from './api'

export const exchangeRateApi = {
  // Obtener cotización actual desde el backend
  getCurrentRate: () => api.get('/exchange-rate/current'),
  
  // Obtener cotización guardada en BD
  getStoredRate: () => api.get('/exchange-rate/stored'),
  
  // Forzar actualización (solo admin)
  forceUpdate: () => api.post('/exchange-rate/force-update'),
}