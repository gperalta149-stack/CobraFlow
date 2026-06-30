// frontend/src/features/analisis/hooks/useAnalisis.ts
import { useState, useEffect } from 'react'
import { dashboardApi } from '../../dashboard/services/dashboardApi'
import { deudasApi } from '../../deudas/services/deudasApi'
import { pagosApi } from '../../pagos/services/pagosApi'
import { calcularMora } from '../../../lib/calcularMora'
import { useMora } from '../../perfil/hooks/useMora'
import type { DatosEvolucionPagos, DatosComparativa } from '../../dashboard/types'
import type { Deuda } from '../../pagos/types'
import type { 
  Periodo, 
  ClienteConMora, 
  AgingData, 
  BalanceData, 
  KPIsAnalisis,
  PeriodoConfig 
} from '../types'

// ── Configuración según período ──────────────────────────────────────
const PERIODO_CONFIG: Record<Periodo, PeriodoConfig> = {
  semana: {
    fechaInicio: (() => { const d = new Date(); d.setDate(d.getDate() - 7); d.setHours(0,0,0,0); return d })(),
    evolucionMeses: 1,
    evolucionLabel: 'Últimos 7 días',
  },
  mes: {
    fechaInicio: (() => { const d = new Date(); d.setMonth(d.getMonth() - 1); d.setHours(0,0,0,0); return d })(),
    evolucionMeses: 1,
    evolucionLabel: 'Último mes',
  },
  trimestre: {
    fechaInicio: (() => { const d = new Date(); d.setMonth(d.getMonth() - 3); d.setHours(0,0,0,0); return d })(),
    evolucionMeses: 3,
    evolucionLabel: 'Último trimestre',
  },
  semestre: {
    fechaInicio: (() => { const d = new Date(); d.setMonth(d.getMonth() - 6); d.setHours(0,0,0,0); return d })(),
    evolucionMeses: 6,
    evolucionLabel: 'Último semestre',
  },
  año: {
    fechaInicio: (() => { const d = new Date(); d.setFullYear(d.getFullYear() - 1); d.setHours(0,0,0,0); return d })(),
    evolucionMeses: 12,
    evolucionLabel: 'Último año',
  },
}

const getFechaInicio = (periodo: Periodo): Date => {
  const hoy = new Date()
  switch (periodo) {
    case 'semana': {
      const d = new Date(hoy); d.setDate(d.getDate() - 7); d.setHours(0, 0, 0, 0); return d
    }
    case 'mes': {
      const d = new Date(hoy.getFullYear(), hoy.getMonth(), 1); d.setHours(0, 0, 0, 0); return d
    }
    case 'trimestre': {
      const d = new Date(hoy); d.setMonth(d.getMonth() - 3); d.setHours(0, 0, 0, 0); return d
    }
    case 'semestre': {
      const d = new Date(hoy); d.setMonth(d.getMonth() - 6); d.setHours(0, 0, 0, 0); return d
    }
    case 'año': {
      const d = new Date(hoy); d.setFullYear(d.getFullYear() - 1); d.setHours(0, 0, 0, 0); return d
    }
  }
}

const getEvolucionConfig = (periodo: Periodo) => {
  const config = PERIODO_CONFIG[periodo]
  return {
    meses: config.evolucionMeses,
    label: config.evolucionLabel,
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
        const evolConfig = getEvolucionConfig(periodo)

        const [evolucionRes, dashboardRes, deudasRes, pagosRes] = await Promise.all([
          dashboardApi.getPagosPorMes().then(r => r.data).catch(() => [] as DatosEvolucionPagos[]),
          dashboardApi.getDashboard(),
          deudasApi.getAll(),
          pagosApi.getAll({ desde: fechaInicio.toISOString() }),
        ])

        const backendKpis = dashboardRes.data.kpis
        const alertas = dashboardRes.data.alertas ?? []
        const cotizacionVigente = dashboardRes.data.cotizacion?.venta || 1

        // ── Evolución filtrada por período ──────────────────────
        const evolucionFiltrada = evolucionRes.slice(-evolConfig.meses)
        setEvolucionPagos(evolucionFiltrada)

        // ── KPIs ──────────────────────────────────────────────────
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

        // ── Proyecciones ──────────────────────────────────────────
        const hoy = new Date()
        const hoy30 = new Date(); hoy30.setDate(hoy30.getDate() + 30)
        let projARS = 0, projUSD = 0

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

        // ── Distribución por estado (FILTRADA) ──────────────────
        const deudasTodas = deudasRes.data || []
        const deudasPeriodo = deudasTodas.filter((d: any) => {
          const fechaCreacion = new Date(d.fecha_creacion || d.created_at || d.fecha_vencimiento)
          return fechaCreacion >= fechaInicio
        })
        const deudasParaDistribucion = deudasPeriodo.length > 0 ? deudasPeriodo : deudasTodas

        const distribucionMap = new Map<string, number>()
        deudasParaDistribucion.forEach((d: any) => {
          const estado = d.estado || 'pendiente'
          distribucionMap.set(estado, (distribucionMap.get(estado) || 0) + 1)
        })

        const estadoColors: Record<string, string> = {
          pendiente: '#EF9F27', parcial: '#378ADD',
          pagada: '#1D9E75', vencida: '#E24B4A',
        }

        const distribucion: DatosComparativa[] = Array.from(distribucionMap.entries()).map(([estado, valor]) => ({
          nombre: estado === 'pendiente' ? 'Pendiente' :
                  estado === 'parcial' ? 'Parcial' :
                  estado === 'pagada' ? 'Pagada' :
                  estado === 'vencida' ? 'Vencida' : estado,
          valor,
          color: estadoColors[estado] || '#6b7280',
        })).filter(item => item.valor > 0)

        setDeudasPorEstadoData(distribucion)

        // ── Balance del período ──────────────────────────────────
        const pagosPeriodo = pagosRes.data || []
        let cobradoARS = 0, cobradoUSD = 0

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

        let nuevasDeudasARS = 0, nuevasDeudasUSD = 0
        let saldoPendienteHistoricoARS = 0, saldoPendienteHistoricoUSD = 0

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

        // ── Clientes con mayor mora (SIN FILTRAR) ──────────────
        const deudasVencidas = deudasTodas.filter((d: Deuda) => d.estado === 'vencida')
        const moraPorCliente = new Map<string, ClienteConMora>()

        for (const deuda of deudasVencidas) {
          const resultado = calcularMora(
            deuda.saldo_pendiente,
            deuda.fecha_vencimiento,
            deuda.estado,
            deuda.monto_mora_acumulada,
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

        // ── Aging Report (SIN FILTRAR) ──────────────────────────
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
    error,
    periodo,
  }
}