// frontend/src/features/deudas/hooks/useDeudas.ts
import { useState, useEffect, useCallback, useMemo } from 'react'
import { deudasApi } from '../services/deudasApi'
import { handleApiError } from '../../../utils/handleApiError'
import { calcularMora } from '../../../lib/calcularMora'
import { useMoraConfig } from '../../../hooks/useMoraConfig'
import type { Deuda, Cliente } from '../types'

export function useDeudas() {
  const [deudas, setDeudas] = useState<Deuda[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cotizacionActual, setCotizacionActual] = useState<number>(1455)

  const { config: moraConfig } = useMoraConfig()

  const [filtroEstados, setFiltroEstados]         = useState<string[]>([])
  const [filtroDesde, setFiltroDesde]             = useState('')
  const [filtroHasta, setFiltroHasta]             = useState('')
  const [filtroMontoMin, setFiltroMontoMin]       = useState('')
  const [filtroMontoMax, setFiltroMontoMax]       = useState('')
  const [filtroMonedaMonto, setFiltroMonedaMonto] = useState<'ARS' | 'USD'>('ARS')

  useEffect(() => {
    fetch('/api/exchange-rate')
      .then(r => r.json())
      .then(d => { if (Number(d.venta) > 0) setCotizacionActual(Number(d.venta)) })
      .catch(() => {})
  }, [])

  const fetchDeudas = useCallback(async () => {
    const { data } = await deudasApi.getAll()
    setDeudas(data)
  }, [])

  const fetchClientes = useCallback(async () => {
    const { data } = await deudasApi.getClientes()
    setClientes(data)
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try { await Promise.all([fetchDeudas(), fetchClientes()]) }
    catch (err) { setError(handleApiError(err, 'Error al cargar los datos')) }
    finally { setLoading(false) }
  }, [fetchDeudas, fetchClientes])

  useEffect(() => { loadData() }, [loadData])

  const refetchDeudas = useCallback(async () => {
    setLoading(true)
    try { await fetchDeudas() }
    catch (err) { setError(handleApiError(err, 'Error al recargar las deudas')) }
    finally { setLoading(false) }
  }, [fetchDeudas])

  // ── Filtrado ──────────────────────────────────────────────────────────────
  const deudasFiltradas = useMemo(() => deudas.filter(d => {
    if (filtroEstados.length > 0 && !filtroEstados.includes(d.estado)) return false
    if (filtroDesde && d.fecha_vencimiento.slice(0, 10) < filtroDesde) return false
    if (filtroHasta && d.fecha_vencimiento.slice(0, 10) > filtroHasta) return false
    if (filtroMontoMin !== '' || filtroMontoMax !== '') {
      const saldo = Number(d.saldo_pendiente)
      const valor = filtroMonedaMonto === 'USD'
        ? (d.moneda === 'USD' ? saldo : saldo / (Number(d.cotizacion) || cotizacionActual))
        : (d.moneda === 'USD' ? saldo * (Number(d.cotizacion) || cotizacionActual) : saldo)
      if (filtroMontoMin !== '' && valor < Number(filtroMontoMin)) return false
      if (filtroMontoMax !== '' && valor > Number(filtroMontoMax)) return false
    }
    return true
  }), [deudas, filtroEstados, filtroDesde, filtroHasta, filtroMontoMin, filtroMontoMax, filtroMonedaMonto, cotizacionActual])

  // ── Métricas separadas por moneda (sobre lo filtrado, eso sí está bien) ──
  const metricas = useMemo(() => {
    let pendienteARS = 0
    let pendienteUSD = 0
    let vencidasARS  = 0
    let vencidasUSD  = 0
    let moraARS      = 0
    let moraUSD      = 0

    for (const d of deudasFiltradas) {
      const saldo = Number(d.saldo_pendiente)

      if (d.moneda === 'ARS') {
        pendienteARS += saldo
        if (d.estado === 'vencida') vencidasARS += saldo
      } else {
        const cotiz = Number(d.cotizacion) || cotizacionActual
        const saldoUSD = saldo / cotiz
        pendienteUSD += saldoUSD
        if (d.estado === 'vencida') vencidasUSD += saldoUSD
      }

      // ✅ ACTUALIZADO: Ahora pasa monto_mora_acumulada
      if (moraConfig && d.estado === 'vencida') {
        const mora = calcularMora(
          saldo, 
          d.fecha_vencimiento, 
          d.estado, 
          d.monto_mora_acumulada,  // ← agregado
          moraConfig
        )
        if (mora.tieneMora) {
          if (d.moneda === 'ARS') {
            moraARS += mora.montoMora
          } else {
            const cotiz = Number(d.cotizacion) || cotizacionActual
            moraUSD += mora.montoMora / cotiz
          }
        }
      }
    }

    return { pendienteARS, pendienteUSD, vencidasARS, vencidasUSD, moraARS, moraUSD }
  }, [deudasFiltradas, cotizacionActual, moraConfig])

  // ── Próximo vencimiento ───────────────────────────────────────────────────
  const proximoVencimiento = useMemo(() => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    return [...deudasFiltradas]
      .filter(d =>
        d.estado !== 'pagada' &&
        d.estado !== 'vencida' &&
        new Date(d.fecha_vencimiento) >= hoy
      )
      .sort((a, b) => new Date(a.fecha_vencimiento).getTime() - new Date(b.fecha_vencimiento).getTime())[0]
  }, [deudasFiltradas])

  // ── Contadores de chips: SOBRE deudas (sin filtrar), no deudasFiltradas ──
  // Esto es lo que corregí: antes usaba deudasFiltradas, lo cual hacía que
  // los counts cambiaran con filtros de fecha/monto activos. Los chips deben
  // reflejar siempre los totales reales disponibles.
  const counts = useMemo(() => ({
    todos:     deudas.length,
    activas:   deudas.filter(d => d.estado === 'pendiente' || d.estado === 'parcial').length,
    vencidas:  deudas.filter(d => d.estado === 'vencida').length,
    parciales: deudas.filter(d => d.estado === 'parcial').length,
    pagadas:   deudas.filter(d => d.estado === 'pagada').length,
  }), [deudas])

  const hayFiltrosActivos =
    filtroEstados.length > 0 || filtroDesde !== '' || filtroHasta !== '' ||
    filtroMontoMin !== '' || filtroMontoMax !== ''

  const limpiarFiltros = useCallback(() => {
    setFiltroEstados([])
    setFiltroDesde('')
    setFiltroHasta('')
    setFiltroMontoMin('')
    setFiltroMontoMax('')
    setFiltroMonedaMonto('ARS')
  }, [])

  return {
    deudas: deudasFiltradas,
    clientes, loading, error,
    filtroEstados,     setFiltroEstados,
    filtroDesde,       setFiltroDesde,
    filtroHasta,       setFiltroHasta,
    filtroMontoMin,    setFiltroMontoMin,
    filtroMontoMax,    setFiltroMontoMax,
    filtroMonedaMonto, setFiltroMonedaMonto,
    hayFiltrosActivos, limpiarFiltros,
    refetchDeudas, loadData,
    pendienteARS:  metricas.pendienteARS,
    pendienteUSD:  metricas.pendienteUSD,
    vencidasARS:   metricas.vencidasARS,
    vencidasUSD:   metricas.vencidasUSD,
    moraARS:       metricas.moraARS,
    moraUSD:       metricas.moraUSD,
    deudasVencidasCount: counts.vencidas,
    proximoVencimiento,
    cotizacionActual,
    counts,
  }
}