// frontend/src/features/analisis/hooks/useAnalisis.ts
import { useState, useEffect } from 'react'
import { dashboardApi } from '../../dashboard/services/dashboardApi'
import { deudasApi } from '../../deudas/services/deudasApi'
import { pagosApi } from '../../pagos/services/pagosApi'
import { calcularMora } from '../../../lib/calcularMora'
import { useMora } from '../../perfil/hooks/useMora'
import type { DatosEvolucionPagos, DatosComparativa } from '../../dashboard/types'
import type { Deuda } from '../../pagos/types'

export interface ClienteConMora {
  id: string
  nombre: string
  deuda_original: number
  mora_acumulada: number
  total: number
  moneda: 'ARS' | 'USD'
}

export interface AgingData {
  tramo: string
  montoARS: number
  montoUSD: number
}

interface BalanceData {
  cobradoARS: number
  cobradoUSD: number
  nuevasDeudasARS: number
  nuevasDeudasUSD: number
  recuperacionARS: number
  recuperacionUSD: number
}

interface KPIsAnalisis {
  montoVencidoARS: number
  montoVencidoUSD: number
  porcentajeVencidoARS: number
  porcentajeVencidoUSD: number
}

type Periodo = 'semana' | 'mes' | 'trimestre' | 'semestre' | 'año'

// CORREGIDA: usa primer día del mes para "mes"
const getFechaInicio = (periodo: Periodo): Date => {
  const hoy = new Date()
  switch (periodo) {
    case 'semana': {
      const d = new Date(hoy)
      d.setDate(d.getDate() - 7)
      d.setHours(0, 0, 0, 0)
      return d
    }
    case 'mes': {
      // Primer día del mes actual
      const d = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      d.setHours(0, 0, 0, 0)
      return d
    }
    case 'trimestre': {
      const d = new Date(hoy)
      d.setMonth(d.getMonth() - 3)
      d.setHours(0, 0, 0, 0)
      return d
    }
    case 'semestre': {
      const d = new Date(hoy)
      d.setMonth(d.getMonth() - 6)
      d.setHours(0, 0, 0, 0)
      return d
    }
    case 'año': {
      const d = new Date(hoy)
      d.setFullYear(d.getFullYear() - 1)
      d.setHours(0, 0, 0, 0)
      return d
    }
  }
}

export function useAnalisis(periodo: Periodo) {
  const [evolucionPagos, setEvolucionPagos] = useState<DatosEvolucionPagos[]>([])
  const [deudasPorEstadoData, setDeudasPorEstadoData] = useState<DatosComparativa[]>([])
  const [clientesMora, setClientesMora] = useState<ClienteConMora[]>([])
  const [balance, setBalance] = useState<BalanceData>({
    cobradoARS: 0, cobradoUSD: 0,
    nuevasDeudasARS: 0, nuevasDeudasUSD: 0,
    recuperacionARS: 0, recuperacionUSD: 0
  })
  const [kpis, setKpis] = useState<KPIsAnalisis | null>(null)
  const [agingData, setAgingData] = useState<AgingData[]>([])
  const [proyeccionARS, setProyeccionARS] = useState(0)
  const [proyeccionUSD, setProyeccionUSD] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { config: moraConfig } = useMora()

  useEffect(() => {
    const fetchAnalisis = async () => {
      setLoading(true)
      setError('')
      try {
        const fechaInicio = getFechaInicio(periodo)

        const [evolucionRes, dashboardRes, deudasRes, pagosRes] = await Promise.all([
          dashboardApi.getPagosPorMes().then(r => r.data).catch(() => [] as DatosEvolucionPagos[]),
          dashboardApi.getDashboard(),
          deudasApi.getAll(),
          pagosApi.getAll({ desde: fechaInicio.toISOString() }),
        ])

        const backendKpis = dashboardRes.data.kpis
        const alertas = dashboardRes.data.alertas ?? []
        const cotizacionVigente = dashboardRes.data.cotizacion?.venta || 1

        setEvolucionPagos(evolucionRes)

        // 1. KPIs Superiores de Deuda Vencida
        const montoVencidoARS = backendKpis.montoVencidoARS ?? 0
        const montoVencidoUSD = backendKpis.montoVencidoUSD ?? 0

        const totalPendienteARS = backendKpis.totalMontoPendienteARS ?? 0
        const totalPendienteUSD = backendKpis.totalMontoPendienteUSD ?? 0

        setKpis({
          montoVencidoARS,
          montoVencidoUSD,
          porcentajeVencidoARS: totalPendienteARS > 0 ? (montoVencidoARS / totalPendienteARS) * 100 : 0,
          porcentajeVencidoUSD: totalPendienteUSD > 0 ? (montoVencidoUSD / totalPendienteUSD) * 100 : 0
        })

        // 2. Proyecciones a 30 días
        const hoy = new Date()
        const hoy30 = new Date()
        hoy30.setDate(hoy30.getDate() + 30)

        let projARS = 0
        let projUSD = 0

        alertas.forEach((a: any) => {
          if (!a.fecha_vencimiento) return
          const fecha = new Date(a.fecha_vencimiento)
          if (fecha >= hoy && fecha <= hoy30) {
            const saldo = Number(a.saldo_pendiente ?? 0)
            if (a.moneda === 'USD') {
              const cotiz = Number(a.cotizacion) || cotizacionVigente
              projUSD += cotiz > 0 ? saldo / cotiz : 0
            } else {
              projARS += saldo
            }
          }
        })
        setProyeccionARS(projARS)
        setProyeccionUSD(projUSD)

        // 3. Distribución por estado
        const distribucion: DatosComparativa[] = [
          { nombre: 'Pendiente', valor: backendKpis.deudasPendientes ?? 0, color: '#EF9F27' },
          { nombre: 'Parcial', valor: backendKpis.deudasParciales ?? 0, color: '#378ADD' },
          { nombre: 'Pagada', valor: backendKpis.deudasPagadas ?? 0, color: '#1D9E75' },
          { nombre: 'Vencida', valor: backendKpis.deudasVencidas ?? 0, color: '#E24B4A' },
        ].filter(item => item.valor > 0)
        setDeudasPorEstadoData(distribucion)

        // 4. Balance del período
        const pagosPeriodo = pagosRes.data || []
        let cobradoARS = 0
        let cobradoUSD = 0

        pagosPeriodo.forEach((p: any) => {
          const fechaPago = new Date(p.fecha_pago || p.created_at)
          if (fechaPago >= fechaInicio) {
            if (p.moneda === 'USD') {
              cobradoUSD += Number(p.monto_original ?? 0)
            } else {
              cobradoARS += Number(p.monto ?? 0)
            }
          }
        })

        const deudasTodas = deudasRes.data || []
        let nuevasDeudasARS = 0
        let nuevasDeudasUSD = 0

        let saldoPendienteHistoricoARS = 0
        let saldoPendienteHistoricoUSD = 0

        deudasTodas.forEach((d: any) => {
          const fechaCreacion = new Date(d.fecha_creacion || d.created_at || d.fecha_vencimiento)
          const cotiz = d.moneda === 'USD' ? (Number(d.cotizacion) || cotizacionVigente) : 1
          const saldo = Number(d.saldo_pendiente ?? 0)
          const saldoNativo = d.moneda === 'USD' ? (cotiz > 0 ? saldo / cotiz : 0) : saldo

          if (fechaCreacion >= fechaInicio) {
            if (d.moneda === 'USD') nuevasDeudasUSD += Number(d.monto_original ?? 0)
            else nuevasDeudasARS += Number(d.monto_original ?? 0)
          }

          if (d.moneda === 'USD') saldoPendienteHistoricoUSD += saldoNativo
          else saldoPendienteHistoricoARS += saldoNativo
        })

        const totalCarteraARS = saldoPendienteHistoricoARS + cobradoARS
        const totalCarteraUSD = saldoPendienteHistoricoUSD + cobradoUSD

        setBalance({
          cobradoARS,
          cobradoUSD,
          nuevasDeudasARS,
          nuevasDeudasUSD,
          recuperacionARS: totalCarteraARS > 0 ? (cobradoARS / totalCarteraARS) * 100 : 0,
          recuperacionUSD: totalCarteraUSD > 0 ? (cobradoUSD / totalCarteraUSD) * 100 : 0
        })

        // 5. Clientes con mayor mora
        const deudasVencidas = deudasTodas.filter((d: Deuda) => d.estado === 'vencida')
        const moraPorCliente = new Map<string, ClienteConMora>()

        for (const deuda of deudasVencidas) {
          const resultado = calcularMora(
            deuda.saldo_pendiente,
            deuda.fecha_vencimiento,
            deuda.estado,
            moraConfig
          )

          const cotiz = deuda.moneda === 'USD' ? (Number(deuda.cotizacion) || cotizacionVigente) : 1
          const saldo = Number(deuda.saldo_pendiente ?? 0)
          const deudaOriginalNativa = deuda.moneda === 'USD' ? (cotiz > 0 ? saldo / cotiz : 0) : saldo
          const moraNativa = deuda.moneda === 'USD' ? (cotiz > 0 ? resultado.montoMora / cotiz : 0) : resultado.montoMora

          const clienteNombre = deuda.clientes?.nombre || 'Cliente Anónimo'
          const claveMap = `${clienteNombre}-${deuda.moneda}`
          const actual = moraPorCliente.get(claveMap)

          if (actual) {
            actual.deuda_original += deudaOriginalNativa
            actual.mora_acumulada += moraNativa
            actual.total = actual.deuda_original + actual.mora_acumulada
          } else {
            moraPorCliente.set(claveMap, {
              id: `${deuda.cliente_id}-${deuda.moneda}`,
              nombre: clienteNombre,
              deuda_original: deudaOriginalNativa,
              mora_acumulada: moraNativa,
              total: deudaOriginalNativa + moraNativa,
              moneda: deuda.moneda as 'ARS' | 'USD'
            })
          }
        }

        const topMora = Array.from(moraPorCliente.values())
          .sort((a, b) => b.total - a.total)
          .slice(0, 5)
        setClientesMora(topMora)

        // 6. Aging Report
        const agingARS: Record<string, number> = { '0-30': 0, '31-60': 0, '61-90': 0, '+90': 0 }
        const agingUSD: Record<string, number> = { '0-30': 0, '31-60': 0, '61-90': 0, '+90': 0 }
        const ahora = new Date()

        for (const deuda of deudasVencidas) {
          const dias = Math.floor((ahora.getTime() - new Date(deuda.fecha_vencimiento).getTime()) / 86400000)
          const cotiz = deuda.moneda === 'USD' ? (Number(deuda.cotizacion) || cotizacionVigente) : 1
          const saldo = Number(deuda.saldo_pendiente ?? 0)
          const saldoNativo = deuda.moneda === 'USD' ? (cotiz > 0 ? saldo / cotiz : 0) : saldo

          const objetivo = deuda.moneda === 'USD' ? agingUSD : agingARS

          if (dias <= 30)      objetivo['0-30']  += saldoNativo
          else if (dias <= 60) objetivo['31-60'] += saldoNativo
          else if (dias <= 90) objetivo['61-90'] += saldoNativo
          else                 objetivo['+90']   += saldoNativo
        }

        const tramos = ['0–30 días', '31–60 días', '61–90 días', '+90 días']
        const claves = ['0-30', '31-60', '61-90', '+90']

        const generatedAging: AgingData[] = tramos.map((tramo, idx) => ({
          tramo,
          montoARS: agingARS[claves[idx]],
          montoUSD: agingUSD[claves[idx]]
        })).filter(f => f.montoARS > 0 || f.montoUSD > 0)

        setAgingData(generatedAging)

      } catch (err) {
        console.error('Error cargando análisis bimoneda:', err)
        setError('Error al cargar los datos analíticos del sistema')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalisis()
  }, [periodo, moraConfig])

  return {
    evolucionPagos,
    deudasPorEstadoData,
    clientesMora,
    balance,
    kpis,
    agingData,
    proyeccionARS,
    proyeccionUSD,
    loading,
    error
  }
}