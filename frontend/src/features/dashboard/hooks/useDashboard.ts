import { useState, useEffect, useMemo } from 'react'
import { dashboardApi } from '../services/dashboardApi'
import { handleApiError } from '../../../utils/handleApiError'
import type { KPIs, TopCliente, Alerta } from '../types'

const getMaxSaldo = (clientes: TopCliente[]): number => {
  if (clientes.length === 0) return 0
  return Math.max(...clientes.map(c => c.saldo_pendiente))
}

const getCollectionRate = (recaudado: number, totalDeudas: number): number => {
  if (totalDeudas === 0) return 0
  return (recaudado / totalDeudas) * 100
}

const getSafePercentage = (value: number, total: number): number => {
  if (total === 0) return 0
  return (value / total) * 100
}

export function useDashboard() {
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [topClientes, setTopClientes] = useState<TopCliente[]>([])
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await dashboardApi.getDashboard()
        setKpis(data.kpis)
        setTopClientes(data.topClientes)
        setAlertas(data.alertas)
      } catch (err) {
        setError(handleApiError(err, 'Error al cargar el dashboard'))
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const maxSaldo = useMemo(() => getMaxSaldo(topClientes), [topClientes])
  const collectionRate = useMemo(() => 
    kpis ? getCollectionRate(kpis.totalRecaudadoMes, kpis.totalMontoDeudas) : 0,
    [kpis]
  )
  const pendingPercentage = useMemo(() => 
    kpis ? getSafePercentage(kpis.totalMontoPendiente, kpis.totalMontoDeudas) : 0,
    [kpis]
  )

  return { kpis, topClientes, alertas, loading, error, maxSaldo, collectionRate, pendingPercentage }
}