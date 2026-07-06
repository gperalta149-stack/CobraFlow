// dashboardController.ts - Versión corregida con agrupación por moneda de deuda
import { Response } from 'express'
import { supabase } from '../config/supabase'
import { AuthRequest } from '../middleware/authMiddleware'
import { actualizarMoraAcumulada } from './deudasController'


const actualizarVencidas = async () => {
  await supabase.rpc('actualizar_deudas_vencidas')
}

const getCotizacionVigente = async (): Promise<number> => {
  const { data } = await supabase
    .from('tipo_cambio')
    .select('venta')
    .order('fecha', { ascending: false })
    .limit(1)
    .single()
  return data ? Number(data.venta) : 1
}

// ============================================
// GET /dashboard/evolucion-pagos
// ============================================
export const getEvolucionPagos = async (req: AuthRequest, res: Response) => {
  try {
    const usuario_id = req.usuario?.id
    if (!usuario_id) return res.status(401).json({ error: 'Usuario no autenticado' })

    const seisMesesAtras = new Date()
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6)
    seisMesesAtras.setDate(1)
    seisMesesAtras.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('pagos')
      .select(`
        monto, 
        monto_original, 
        moneda, 
        created_at,
        deudas!inner(moneda, cotizacion)
      `)
      .eq('usuario_id', usuario_id)
      .gte('created_at', seisMesesAtras.toISOString())
      .order('created_at', { ascending: true })

    if (error) throw error

    const pagosPorMes: Record<string, { ars: number; usd: number }> = {}
    
    data?.forEach(pago => {
      const fecha = new Date(pago.created_at)
      const nombreMes = fecha.toLocaleDateString('es-AR', { month: 'short', year: 'numeric' })
      
      if (!pagosPorMes[nombreMes]) {
        pagosPorMes[nombreMes] = { ars: 0, usd: 0 }
      }
      
      // ✅ FIX: Usar moneda de la DEUDA (accediendo al primer elemento del array)
      const deuda = Array.isArray(pago.deudas) ? pago.deudas[0] : pago.deudas
      const monedaDeuda = deuda?.moneda || 'ARS'
      
      if (monedaDeuda === 'USD') {
        pagosPorMes[nombreMes].usd += Number(pago.monto_original ?? 0)
      } else {
        pagosPorMes[nombreMes].ars += Number(pago.monto)
      }
    })

    const resultado = Object.entries(pagosPorMes).map(([mes, { ars, usd }]) => ({
      mes,
      recaudado: ars,
      recaudadoUSD: usd,
    }))

    res.json(resultado)
  } catch (error) {
    console.error('Error cargando evolución de pagos:', error)
    res.status(500).json({ error: 'Error al cargar evolución de pagos' })
  }
}

// ============================================
// GET /dashboard
// ============================================
export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const usuario_id = req.usuario?.id
    if (!usuario_id) return res.status(401).json({ error: 'Usuario no autenticado' })

    await actualizarVencidas()
    await actualizarMoraAcumulada(usuario_id)

    const ahora = new Date()
    const inicioHoy = new Date(); inicioHoy.setHours(0, 0, 0, 0)
    const finHoy = new Date(); finHoy.setHours(23, 59, 59, 999)
    const inicioMes = new Date(); inicioMes.setDate(1); inicioMes.setHours(0, 0, 0, 0)

    const inicioMesPasado = new Date(); inicioMesPasado.setMonth(inicioMesPasado.getMonth() - 1); inicioMesPasado.setDate(1); inicioMesPasado.setHours(0, 0, 0, 0)
    const finMesPasado = new Date(inicioMes); finMesPasado.setMilliseconds(-1)

    const hoyStr = ahora.toISOString().split('T')[0]
    const en7diasStr = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const [
      cotizacionVigente,
      { count: totalClientes },
      { data: deudas },
      { data: pagosMes },
      { data: pagosMesPasadoConsolidado },
      { data: pagosMesPasado },
      { data: pagosHoy },
      { data: proximasRaw },
      { data: vencidasRaw },
      { data: ultimosPagos },
      { data: deudaMasCritica },
      { data: deudasParaTop },
      { data: moraConfigData },
    ] = await Promise.all([

      getCotizacionVigente(),

      supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true })
        .eq('usuario_id', usuario_id)
        .eq('activo', true),

      supabase
        .from('deudas')
        .select('estado, saldo_pendiente, monto_total, moneda, cotizacion, fecha_vencimiento')
        .eq('usuario_id', usuario_id)
        .eq('activo', true),

      supabase
        .from('pagos')
        .select(`
          monto, 
          moneda, 
          monto_original, 
          cotizacion,
          deudas!inner(moneda, cotizacion)
        `)
        .eq('usuario_id', usuario_id)
        .gte('created_at', inicioMes.toISOString()),

      supabase
        .from('pagos')
        .select('monto')
        .eq('usuario_id', usuario_id)
        .gte('created_at', inicioMesPasado.toISOString())
        .lte('created_at', finMesPasado.toISOString()),

      supabase
        .from('pagos')
        .select(`
          monto, 
          moneda, 
          monto_original, 
          cotizacion,
          deudas!inner(moneda, cotizacion)
        `)
        .eq('usuario_id', usuario_id)
        .gte('created_at', inicioMesPasado.toISOString())
        .lte('created_at', finMesPasado.toISOString()),

      supabase
        .from('pagos')
        .select(`
          monto, 
          moneda, 
          monto_original, 
          cotizacion,
          deudas!inner(moneda, cotizacion)
        `)
        .eq('usuario_id', usuario_id)
        .gte('created_at', inicioHoy.toISOString())
        .lte('created_at', finHoy.toISOString()),

      supabase
        .from('deudas')
        .select('id, descripcion, fecha_vencimiento, saldo_pendiente, moneda, cotizacion, clientes(nombre), cliente_id')
        .eq('usuario_id', usuario_id)
        .eq('activo', true)
        .gte('fecha_vencimiento', hoyStr)
        .lte('fecha_vencimiento', en7diasStr)
        .neq('estado', 'pagada')
        .order('fecha_vencimiento', { ascending: true }),

      supabase
        .from('deudas')
        .select('id, descripcion, fecha_vencimiento, saldo_pendiente, monto_mora_acumulada, moneda, cotizacion, clientes(nombre), cliente_id')
        .eq('usuario_id', usuario_id)
        .eq('activo', true)
        .eq('estado', 'vencida')
        .order('fecha_vencimiento', { ascending: true }),

      supabase
        .from('pagos')
        .select(`
          id, 
          monto, 
          monto_original, 
          moneda, 
          cotizacion, 
          metodo_pago, 
          created_at, 
          clientes(nombre), 
          deudas(descripcion, moneda, cotizacion)
        `)
        .eq('usuario_id', usuario_id)
        .order('created_at', { ascending: false })
        .limit(5),

      supabase
        .from('deudas')
        .select('id, descripcion, saldo_pendiente, monto_mora_acumulada, moneda, cotizacion, fecha_vencimiento, clientes(id, nombre)')
        .eq('usuario_id', usuario_id)
        .eq('activo', true)
        .eq('estado', 'vencida')
        .order('fecha_vencimiento', { ascending: true })
        .limit(10),

      supabase
        .from('deudas')
        .select('cliente_id, saldo_pendiente, monto_mora_acumulada, moneda, cotizacion, estado, fecha_vencimiento, clientes(nombre)')
        .eq('usuario_id', usuario_id)
        .eq('activo', true)
        .neq('estado', 'pagada'),

      supabase
        .from('usuarios')
        .select('mora_activa, mora_porcentaje, mora_tipo')
        .eq('id', usuario_id)
        .single(),
    ])

    // ── Mora ──────────────────────────────────────────────────
    // Si la mora está desactivada, no se muestra aunque haya quedado
    // un monto_mora_acumulada viejo persistido de cuando estaba activa.
    const moraActiva = !!moraConfigData?.mora_activa

    const vencidasConMora = (vencidasRaw ?? []).map(d => ({
      ...d,
      monto_mora_acumulada: moraActiva ? Number(d.monto_mora_acumulada ?? 0) : 0,
    }))

    // ── KPIs de conteo ────────────────────────────────────────
    const totalDeudas = deudas?.length || 0
    const deudasPendientes = deudas?.filter(d => d.estado === 'pendiente').length || 0
    const deudasVencidas = deudas?.filter(d => d.estado === 'vencida').length || 0
    const deudasPagadas = deudas?.filter(d => d.estado === 'pagada').length || 0
    const deudasParciales = deudas?.filter(d => d.estado === 'parcial').length || 0

    // ── Montos por moneda nativa (pendiente / vencido) ────────
    let totalMontoPendienteARS = 0
    let totalMontoPendienteUSD = 0
    let montoVencidoARS = 0
    let montoVencidoUSD = 0

    for (const d of deudas ?? []) {
      if (d.estado === 'pagada') continue
      const saldo = Number(d.saldo_pendiente)
      if (d.moneda === 'ARS') {
        totalMontoPendienteARS += saldo
        if (d.estado === 'vencida') montoVencidoARS += saldo
      } else {
        const cotiz = Number(d.cotizacion) || cotizacionVigente
        const saldoUSD = cotiz > 0 ? saldo / cotiz : 0
        totalMontoPendienteUSD += saldoUSD
        if (d.estado === 'vencida') montoVencidoUSD += saldoUSD
      }
    }

    // ── Recuperación por dinero ───────────────────────────────
    let montoGeneradoTotalARS = 0
    let montoCobradoTotalARS = 0
    for (const d of deudas ?? []) {
      const montoTotalARS = Number(d.monto_total)
      const saldoARS = Number(d.saldo_pendiente)
      const cobradoARS = montoTotalARS - saldoARS
      montoGeneradoTotalARS += montoTotalARS
      montoCobradoTotalARS += cobradoARS
    }
    const recuperacionPorcentaje = montoGeneradoTotalARS > 0
      ? (montoCobradoTotalARS / montoGeneradoTotalARS) * 100
      : 0

    // ── Pagos del mes (✅ agrupado por moneda de DEUDA) ──────
    let totalRecaudadoMesARS = 0
    let totalRecaudadoMesUSD = 0
    for (const p of pagosMes ?? []) {
      const deuda = Array.isArray(p.deudas) ? p.deudas[0] : p.deudas
      const monedaDeuda = deuda?.moneda || 'ARS'
      if (monedaDeuda === 'ARS') {
        totalRecaudadoMesARS += Number(p.monto)
      } else {
        totalRecaudadoMesUSD += Number(p.monto_original ?? 0)
      }
    }

    // ── Pagos del mes pasado (✅ agrupado por moneda de DEUDA) ──
    let totalRecaudadoMesPasadoARS = 0
    let totalRecaudadoMesPasadoUSD = 0
    for (const p of pagosMesPasado ?? []) {
      const deuda = Array.isArray(p.deudas) ? p.deudas[0] : p.deudas
      const monedaDeuda = deuda?.moneda || 'ARS'
      if (monedaDeuda === 'ARS') {
        totalRecaudadoMesPasadoARS += Number(p.monto)
      } else {
        totalRecaudadoMesPasadoUSD += Number(p.monto_original ?? 0)
      }
    }

    // ── Pagos de hoy (✅ agrupado por moneda de DEUDA) ──────
    let totalRecaudadoHoyARS = 0
    let totalRecaudadoHoyUSD = 0
    for (const p of pagosHoy ?? []) {
      const deuda = Array.isArray(p.deudas) ? p.deudas[0] : p.deudas
      const monedaDeuda = deuda?.moneda || 'ARS'
      if (monedaDeuda === 'ARS') {
        totalRecaudadoHoyARS += Number(p.monto)
      } else {
        totalRecaudadoHoyUSD += Number(p.monto_original ?? 0)
      }
    }
    const cantidadPagosHoy = pagosHoy?.length || 0

    // ── Variación mensual consolidada en ARS ──────────────────
    const totalRecaudadoMesConsolidadoARS = (pagosMes ?? []).reduce((acc, p) => acc + Number(p.monto), 0)
    const totalRecaudadoMesPasadoConsolidadoARS = (pagosMesPasadoConsolidado ?? []).reduce((acc, p) => acc + Number(p.monto), 0)
    const variacionMensual = totalRecaudadoMesPasadoConsolidadoARS > 0
      ? ((totalRecaudadoMesConsolidadoARS - totalRecaudadoMesPasadoConsolidadoARS) / totalRecaudadoMesPasadoConsolidadoARS * 100).toFixed(1)
      : null

    const cantidadProximosVencimientos = proximasRaw?.length || 0
    const proximoVencimiento = proximasRaw?.[0]?.fecha_vencimiento ?? null

    // ── Últimos pagos ────────────────────────────────────────
    const ultimosPagosConMoneda = ultimosPagos?.map(p => {
      const deuda = Array.isArray(p.deudas) ? p.deudas[0] : p.deudas
      return {
        id: p.id,
        monto: p.monto,
        moneda: p.moneda,
        monto_original: p.monto_original ?? (
          p.moneda === 'USD' && p.cotizacion
            ? Math.round(Number(p.monto) / Number(p.cotizacion))
            : Number(p.monto)
        ),
        metodo_pago: p.metodo_pago,
        created_at: p.created_at,
        clientes: p.clientes,
        deudas: {
          descripcion: deuda?.descripcion || '',
          moneda: deuda?.moneda || 'ARS',
          cotizacion: deuda?.cotizacion || 1
        },
      }
    }) ?? []

    // ── Mayor riesgo por score (días × monto_usd) con mora ─────
    let clienteMayorRiesgo = null
    if (deudaMasCritica && deudaMasCritica.length > 0) {
      const conScore = deudaMasCritica.map(d => {
        const cliente = Array.isArray(d.clientes) ? d.clientes[0] : d.clientes
        const dias = Math.floor((ahora.getTime() - new Date(d.fecha_vencimiento).getTime()) / 86400000)
        const saldo = Number(d.saldo_pendiente)
        const cotiz = Number(d.cotizacion) || cotizacionVigente
        const montoUSD = d.moneda === 'USD' ? saldo / cotiz : saldo / cotizacionVigente
        const score = dias * montoUSD
        return { d, cliente, dias, saldo, montoUSD, cotiz, score }
      })

      conScore.sort((a, b) => b.score - a.score)
      const top = conScore[0]

      // Usa la mora ya persistida (calculada sobre monto_total, no sobre saldo_pendiente)
      // en lugar de recalcularla localmente, para evitar inconsistencias con la vista de Deudas.
      const montoMoraARS = Number(top.d.monto_mora_acumulada ?? 0)
      const tieneMora = !!moraConfigData?.mora_activa && montoMoraARS > 0

      const pendiente = top.d.moneda === 'ARS' ? top.saldo : top.montoUSD
      const mora = top.d.moneda === 'ARS' ? montoMoraARS : montoMoraARS / top.cotiz
      const total = pendiente + (tieneMora ? mora : 0)

      clienteMayorRiesgo = {
        cliente_id: top.cliente?.id ?? null,
        nombre: top.cliente?.nombre ?? 'Cliente',
        descripcion: top.d.descripcion,
        moneda: top.d.moneda,
        pendiente,
        mora: tieneMora ? mora : 0,
        total,
        dias_vencido: top.dias,
        deuda_id: top.d.id,
      }
    }

    // ── Top clientes ─────────────────────────────────────────
    interface TopClienteAcc {
      cliente_id: string
      saldo_pendiente: number
      saldo_pendiente_usd: number
      mora_acumulada: number
      mora_acumulada_usd: number
      moneda: string
      cotizacion: number
      clientes: { nombre: string }
      max_dias_vencido: number
      proximo_vencimiento: string | null
    }

    const porCliente = new Map<string, TopClienteAcc>()

    for (const d of deudasParaTop ?? []) {
      const clienteId = d.cliente_id
      if (!clienteId) continue

      const saldo = Number(d.saldo_pendiente)
      const mora = moraActiva ? Number(d.monto_mora_acumulada ?? 0) : 0
      const cotiz = Number(d.cotizacion) || cotizacionVigente
      const saldoUSD = d.moneda === 'USD' ? saldo / cotiz : saldo / cotizacionVigente
      const moraUSD = d.moneda === 'USD' ? mora / cotiz : mora / cotizacionVigente

      const diasVencido = d.estado === 'vencida'
        ? Math.floor((ahora.getTime() - new Date(d.fecha_vencimiento).getTime()) / 86400000)
        : 0

      const existing = porCliente.get(clienteId)
      if (existing) {
        existing.saldo_pendiente += saldo
        existing.saldo_pendiente_usd += saldoUSD
        existing.mora_acumulada += mora
        existing.mora_acumulada_usd += moraUSD
        if (diasVencido > existing.max_dias_vencido) existing.max_dias_vencido = diasVencido
        if (d.estado !== 'vencida' && d.estado !== 'pagada') {
          if (!existing.proximo_vencimiento || d.fecha_vencimiento < existing.proximo_vencimiento) {
            existing.proximo_vencimiento = d.fecha_vencimiento
          }
        }
      } else {
        const cliente = Array.isArray(d.clientes) ? d.clientes[0] : d.clientes
        porCliente.set(clienteId, {
          cliente_id: clienteId,
          saldo_pendiente: saldo,
          saldo_pendiente_usd: saldoUSD,
          mora_acumulada: mora,
          mora_acumulada_usd: moraUSD,
          moneda: d.moneda,
          cotizacion: cotiz,
          clientes: { nombre: cliente?.nombre ?? 'Cliente' },
          max_dias_vencido: diasVencido,
          proximo_vencimiento: (d.estado !== 'vencida' && d.estado !== 'pagada') ? d.fecha_vencimiento : null,
        })
      }
    }

    const topClientes = Array.from(porCliente.values())
      .sort((a, b) => (b.saldo_pendiente_usd + b.mora_acumulada_usd) - (a.saldo_pendiente_usd + a.mora_acumulada_usd))
      .slice(0, 5)

    // ── Respuesta final ─────────────────────────────────────
    res.json({
      cotizacion: {
        venta: cotizacionVigente,
      },
      kpis: {
        totalClientes,
        totalDeudas,
        deudasPendientes,
        deudasVencidas,
        deudasPagadas,
        deudasParciales,
        totalMontoPendienteARS,
        totalMontoPendienteUSD,
        montoVencidoARS,
        montoVencidoUSD,
        totalRecaudadoMesARS,
        totalRecaudadoMesUSD,
        totalRecaudadoMesPasadoARS,
        totalRecaudadoMesPasadoUSD,
        totalRecaudadoHoyARS,
        totalRecaudadoHoyUSD,
        cantidadPagosHoy,
        cantidadProximosVencimientos,
        proximoVencimiento,
        recuperacionPorcentaje,
        deudasCobradas: deudasPagadas,
        deudasTotalesParaRecuperacion: totalDeudas,
        totalRecaudadoMesConsolidadoARS,
        totalRecaudadoMesPasadoConsolidadoARS,
        variacionMensual,
      },
      alertas: proximasRaw ?? [],
      deudasVencidas: vencidasConMora,
      ultimosPagos: ultimosPagosConMoneda,
      clienteMayorRiesgo,
      topClientes,
    })
  } catch (error) {
    console.error('Error inesperado en getDashboard:', error)
    res.status(500).json({ error: 'Error al cargar el dashboard' })
  }
}