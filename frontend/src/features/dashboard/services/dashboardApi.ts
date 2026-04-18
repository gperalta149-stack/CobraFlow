import api from '../../../services/api'
import type { DashboardData } from '../types'

export const dashboardApi = {
  getDashboard: () => api.get<DashboardData>('/dashboard'),
}