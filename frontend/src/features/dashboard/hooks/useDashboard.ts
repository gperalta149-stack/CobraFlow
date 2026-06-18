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
  const [alertas, setAlertas] = useState<Alerta[]>([])        // próximas a vencer (backend ya filtró)
  const [deudasVencidas, setDeudasVencidas] = useState<Alerta[]>([]) // todas las vencidas (backend ya filtró)
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
        
        // El backend ya envía separado: alertas (próximas) y deudasVencidas (todas las vencidas)
        setKpis(dashboardRes.data.kpis)
        setCotizacion(dashboardRes.data.cotizacion)
        setAlertas(dashboardRes.data.alertas ?? [])              // próximas a vencer (hoy + 7 días)
        setDeudasVencidas(dashboardRes.data.deudasVencidas ?? []) // todas las vencidas
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
    alertas,           // próximas a vencer
    deudasVencidas,    // todas las vencidas
    ultimosPagos,
    evolucionPagos,
    clienteMayorRiesgo,
    topClientes,
    loading,
    error,
  }
}