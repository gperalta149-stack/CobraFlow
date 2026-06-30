// frontend/src/features/dashboard/hooks/useDashboard.ts
import { useState, useEffect } from 'react'
import { dashboardApi } from '../services/dashboardApi'
import { handleApiError } from '../../../utils/handleApiError'
import type {
  KPIs,
  Alerta,
  UltimoPago,
  Cotizacion,
  DatosEvolucionPagos,
  ClienteMayorRiesgo,
  TopCliente,
} from '../types'

export function useDashboard() {
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null)
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [deudasVencidas, setDeudasVencidas] = useState<Alerta[]>([])
  const [ultimosPagos, setUltimosPagos] = useState<UltimoPago[]>([])
  const [evolucionPagos, setEvolucionPagos] = useState<DatosEvolucionPagos[]>([])
  const [clienteMayorRiesgo, setClienteMayorRiesgo] = useState<ClienteMayorRiesgo | null>(null)
  const [topClientes, setTopClientes] = useState<TopCliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true)
      setError('')
      try {
        const [dashboardRes, evolucionRes] = await Promise.all([
          dashboardApi.getDashboard(),
          dashboardApi.getPagosPorMes().then(r => r.data).catch(() => [] as DatosEvolucionPagos[]),
        ])
        
        setKpis(dashboardRes.data.kpis)
        setCotizacion(dashboardRes.data.cotizacion)
        setAlertas(dashboardRes.data.alertas ?? [])
        setDeudasVencidas(dashboardRes.data.deudasVencidas ?? [])
        setUltimosPagos(dashboardRes.data.ultimosPagos ?? [])
        setClienteMayorRiesgo(dashboardRes.data.clienteMayorRiesgo ?? null)
        setTopClientes(dashboardRes.data.topClientes ?? [])
        setEvolucionPagos(evolucionRes)
      } catch (err) {
        setError(handleApiError(err, 'Error al cargar el dashboard'))
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  return {
    kpis,
    cotizacion,
    alertas,
    deudasVencidas,
    ultimosPagos,
    evolucionPagos,
    clienteMayorRiesgo,
    topClientes,
    loading,
    error,
  }
}