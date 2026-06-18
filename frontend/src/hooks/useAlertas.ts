// frontend/src/hooks/useAlertas.ts
import { useState, useEffect } from 'react'
import { dashboardApi } from '../features/dashboard/services/dashboardApi'
import type { Alerta, UltimoPago } from '../features/dashboard/types'

interface UseAlertasResult {
  alertas: Alerta[]
  deudasVencidas: Alerta[]
  ultimosPagos: UltimoPago[]
  loading: boolean
}

export function useAlertas(): UseAlertasResult {
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [deudasVencidas, setDeudasVencidas] = useState<Alerta[]>([])
  const [ultimosPagos, setUltimosPagos] = useState<UltimoPago[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        const res = await dashboardApi.getDashboard()
        setAlertas(res.data.alertas || [])
        setDeudasVencidas(res.data.deudasVencidas || [])
        setUltimosPagos(res.data.ultimosPagos || [])
      } catch (error) {
        console.error('Error cargando alertas:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAlertas()
  }, [])

  return { alertas, deudasVencidas, ultimosPagos, loading }
}