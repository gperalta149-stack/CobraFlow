import api from '../../../services/api'
import type { DashboardData, DatosEvolucionPagos } from '../types'

export const dashboardApi = {
  getDashboard: () => api.get<DashboardData>('/dashboard'),
  
  getPagosPorMes: () => api.get<DatosEvolucionPagos[]>('/dashboard/evolucion-pagos'),
}