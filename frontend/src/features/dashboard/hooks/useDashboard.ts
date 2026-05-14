import { useState, useEffect, useMemo, useCallback } from 'react'
import { dashboardApi } from '../services/dashboardApi'
import { handleApiError } from '../../../utils/handleApiError'
import type { KPIs, TopCliente, Alerta, DatosEvolucionPagos, DatosComparativa } from '../types'

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

// NUEVA FUNCIÓN: Obtener evolución de pagos de los últimos 6 meses
const getEvolucionPagos = async (): Promise<DatosEvolucionPagos[]> => {
  try {
    const { data } = await dashboardApi.getPagosPorMes()
    return data
  } catch (error) {
    console.error('Error cargando evolución de pagos:', error)
    return []
  }
}

// NUEVA FUNCIÓN: Obtener datos para gráfico de torta (deudas por estado)
const getDeudasPorEstadoData = (kpis: KPIs | null): DatosComparativa[] => {
  if (!kpis) return []
  return [
    { nombre: 'Pendiente', valor: kpis.deudasPendientes, color: '#eab308' },
    { nombre: 'Parcial', valor: kpis.deudasParciales, color: '#3b82f6' },
    { nombre: 'Pagada', valor: kpis.deudasPagadas, color: '#22c55e' },
    { nombre: 'Vencida', valor: kpis.deudasVencidas, color: '#ef4444' },
  ].filter(item => item.valor > 0)
}

// NUEVA FUNCIÓN: Obtener datos comparativos deuda vs cobrado
const getComparativaData = (kpis: KPIs | null): DatosComparativa[] => {
  if (!kpis) return []
  return [
    { nombre: 'Total Adeudado', valor: kpis.totalMontoDeudas, color: '#ef4444' },
    { nombre: 'Total Cobrado', valor: kpis.totalRecaudadoMes, color: '#22c55e' },
  ]
}

export function useDashboard() {
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [topClientes, setTopClientes] = useState<TopCliente[]>([])
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [evolucionPagos, setEvolucionPagos] = useState<DatosEvolucionPagos[]>([])  // NUEVO

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true)
      setError('')
      try {
        const [dashboardRes, evolucionRes] = await Promise.all([
          dashboardApi.getDashboard(),
          getEvolucionPagos()
        ])
        setKpis(dashboardRes.data.kpis)
        setTopClientes(dashboardRes.data.topClientes)
        setAlertas(dashboardRes.data.alertas)
        setEvolucionPagos(evolucionRes)
      } catch (err) {
        setError(handleApiError(err, 'Error al cargar el dashboard'))
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  // Datos derivados para gráficos
  const deudasPorEstadoData = useMemo(() => getDeudasPorEstadoData(kpis), [kpis])
  const comparativaData = useMemo(() => getComparativaData(kpis), [kpis])

  const maxSaldo = useMemo(() => getMaxSaldo(topClientes), [topClientes])
  const collectionRate = useMemo(() => 
    kpis ? getCollectionRate(kpis.totalRecaudadoMes, kpis.totalMontoDeudas) : 0,
    [kpis]
  )
  const pendingPercentage = useMemo(() => 
    kpis ? getSafePercentage(kpis.totalMontoPendiente, kpis.totalMontoDeudas) : 0,
    [kpis]
  )

  return { 
    kpis, 
    topClientes, 
    alertas, 
    loading, 
    error, 
    maxSaldo, 
    collectionRate, 
    pendingPercentage,
    deudasPorEstadoData,      // NUEVO: para gráfico torta (HU-35)
    evolucionPagos,           // NUEVO: para evolución (HU-36)
    comparativaData           // NUEVO: para comparativa deuda vs cobrado (HU-37)
  }
}