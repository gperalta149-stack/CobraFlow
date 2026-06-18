// frontend/src/features/pagos/hooks/usePagosMetrics.ts
import { useMemo } from 'react'
import { useExchangeRate } from '../../../hooks/useExchangeRate'
import type { Pago } from '../types'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export function usePagosMetrics(pagos: Pago[], pagosFiltrados: Pago[]) {
  const { rate } = useExchangeRate()
  const cotizacion = rate?.venta ?? 1

  const ahora = new Date()
  const ini    = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
  const iniAnt = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1)

  const pagosMes    = useMemo(() => pagos.filter(p => new Date(p.fecha_pago) >= ini), [pagos])
  const pagosMesAnt = useMemo(() => pagos.filter(p => { const f = new Date(p.fecha_pago); return f >= iniAnt && f < ini }), [pagos])
  const ultimoPago  = useMemo(() => [...pagos].sort((a, b) => new Date(b.fecha_pago).getTime() - new Date(a.fecha_pago).getTime())[0], [pagos])

  // Totales (filtrados): separados por moneda nativa, sin mezclar
  const totalARS = useMemo(() => pagosFiltrados.filter(p => p.moneda === 'ARS').reduce((s, p) => s + Number(p.monto), 0), [pagosFiltrados])
  const totalUSD = useMemo(() => pagosFiltrados.filter(p => p.moneda === 'USD').reduce((s, p) => s + Number(p.monto_original ?? 0), 0), [pagosFiltrados])

  // Este mes: separados por moneda nativa
  const mesARS = useMemo(() => pagosMes.filter(p => p.moneda === 'ARS').reduce((s, p) => s + Number(p.monto), 0), [pagosMes])
  const mesUSD = useMemo(() => pagosMes.filter(p => p.moneda === 'USD').reduce((s, p) => s + Number(p.monto_original ?? 0), 0), [pagosMes])

  // Mes anterior: separados igual, para variación coherente por moneda
  const mesAntARS = useMemo(() => pagosMesAnt.filter(p => p.moneda === 'ARS').reduce((s, p) => s + Number(p.monto), 0), [pagosMesAnt])
  const mesAntUSD = useMemo(() => pagosMesAnt.filter(p => p.moneda === 'USD').reduce((s, p) => s + Number(p.monto_original ?? 0), 0), [pagosMesAnt])

  const variacionARS = useMemo(() => mesAntARS > 0 ? ((mesARS - mesAntARS) / mesAntARS) * 100 : null, [mesARS, mesAntARS])
  const variacionUSD = useMemo(() => mesAntUSD > 0 ? ((mesUSD - mesAntUSD) / mesAntUSD) * 100 : null, [mesUSD, mesAntUSD])

  const ultimoPagoARS = ultimoPago ? Number(ultimoPago.monto) : 0
  const ultimoPagoUSD = ultimoPago
    ? ultimoPago.moneda === 'USD' ? Number(ultimoPago.monto_original) : Number(ultimoPago.monto) / cotizacion
    : 0

  const mesAnteriorNombre = MESES[ahora.getMonth() === 0 ? 11 : ahora.getMonth() - 1]

  return {
    pagosMes, ultimoPago,
    totalARS, totalUSD,
    mesARS, mesUSD,
    variacionARS, variacionUSD,
    mesAnteriorNombre,
    ultimoPagoARS, ultimoPagoUSD,
  }
}