// dashboardController.ts - Versión corregida
import { Response } from 'express'
import { supabase } from '../config/supabase'
import { AuthRequest } from '../middleware/authMiddleware'

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

interface MoraConfig {
  mora_activa: boolean
  mora_porcentaje: number
  mora_tipo: 'unica' | 'mensual'
}

const calcularMoraBackend = (
  saldoPendiente: number,
  fechaVencimiento: string,
  estado: string,
  config: MoraConfig | null
): { tieneMora: boolean; montoMora: number } => {
  if (!config?.mora_activa) return { tieneMora: false, montoMora: 0 }
  if (estado !== 'vencida') return { tieneMora: false, montoMora: 0 }

  const hoy = new Date()
  const vencimiento = new Date(fechaVencimiento)
  const diasVencida = Math.floor((hoy.getTime() - vencimiento.getTime()) / 86400000)

  if (diasVencida <= 0) return { tieneMora: false, montoMora: 0 }

  const mesesVencida = Math.floor(diasVencida / 30) || 1
  const porcentaje = config.mora_porcentaje / 100

  const montoMora = config.mora_tipo === 'unica'
    ? saldoPendiente * porcentaje
    : saldoPendiente * porcentaje * mesesVencida

  return { tieneMora: true, montoMora: Math.round(montoMora * 100) / 100 }
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
      .select('monto, created_at')
      .eq('usuario_id', usuario_id)
      .gte('created_at', seisMesesAtras.toISOString())
      .order('created_at', { ascending: true })

    if (error) throw error

    const pagosPorMes: Record<string, number> = {}
    data?.forEach(pago => {
      const fecha = new Date(pago.created_at)
      const nombreMes = fecha.toLocaleDateString('es-AR', { month: 'short', year: 'numeric' })
      pagosPorMes[nombreMes] = (pagosPorMes[nombreMes] || 0) + Number(pago.monto)
    })

    const resultado = Object.entries(pagosPorMes).map(([mes, recaudado]) => ({ mes, recaudado }))
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
  const usuario_id = req.usuario?.id
  if (!usuario_id) return res.status(401).json({ error: 'Usuario no autenticado' })

  await actualizarVencidas()

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
    { data: pagosMesPasadoConsolidado },  // Solo para variación ARS consolidada
    { data: pagosMesPasado },             // Para moneda nativa ARS/USD
    { data: pagosHoy },
    { data: proximasRaw },
    { data: vencidasRaw },
    { data: ultimosPagos },
    { data: deudaMasCritica },
    { data: deudasParaTop },
    { data: moraConfigData },
  ] = await Promise.all([

    // 0. Cotización vigente
    getCotizacionVigente(),

    // 1. Total clientes activos
    supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true })
      .eq('usuario_id', usuario_id)
      .eq('activo', true),

    // 2. Todas las deudas activas para KPIs
    supabase
      .from('deudas')
      .select('estado, saldo_pendiente, monto_total, moneda, cotizacion, fecha_vencimiento')
      .eq('usuario_id', usuario_id)
      .eq('activo', true),

    // 3. Pagos del mes
    supabase
      .from('pagos')
      .select('monto, moneda, monto_original, cotizacion')
      .eq('usuario_id', usuario_id)
      .gte('created_at', inicioMes.toISOString()),

    // 4. Pagos del mes pasado - SOLO para variación consolidada ARS
    supabase
      .from('pagos')
      .select('monto')
      .eq('usuario_id', usuario_id)
      .gte('created_at', inicioMesPasado.toISOString())
      .lte('created_at', finMesPasado.toISOString()),

    // 5. Pagos del mes pasado - PARA MONEDA NATIVA (ARS/USD) - CORREGIDO
    supabase
      .from('pagos')
      .select('monto, moneda, monto_original, cotizacion')
      .eq('usuario_id', usuario_id)
      .gte('created_at', inicioMesPasado.toISOString())
      .lte('created_at', finMesPasado.toISOString()),

    // 6. Pagos de hoy
    supabase
      .from('pagos')
      .select('monto, moneda, monto_original, cotizacion')
      .eq('usuario_id', usuario_id)
      .gte('created_at', inicioHoy.toISOString())
      .lte('created_at', finHoy.toISOString()),

    // 7. Próximas a vencer (hoy + 7 días)
    supabase
      .from('deudas')
      .select('id, descripcion, fecha_vencimiento, saldo_pendiente, moneda, cotizacion, clientes(nombre), cliente_id')
      .eq('usuario_id', usuario_id)
      .eq('activo', true)
      .gte('fecha_vencimiento', hoyStr)
      .lte('fecha_vencimiento', en7diasStr)
      .neq('estado', 'pagada')
      .order('fecha_vencimiento', { ascending: true }),

    // 8. Todas las vencidas
    supabase
      .from('deudas')
      .select('id, descripcion, fecha_vencimiento, saldo_pendiente, moneda, cotizacion, clientes(nombre), cliente_id')
      .eq('usuario_id', usuario_id)
      .eq('activo', true)
      .eq('estado', 'vencida')
      .order('fecha_vencimiento', { ascending: true }),

    // 9. Últimos 5 pagos
    supabase
      .from('pagos')
      .select('id, monto, monto_original, moneda, cotizacion, metodo_pago, created_at, clientes(nombre), deudas(descripcion)')
      .eq('usuario_id', usuario_id)
      .order('created_at', { ascending: false })
      .limit(5),

    // 10. Top 10 vencidas para mayor riesgo por score
    supabase
      .from('deudas')
      .select('id, descripcion, saldo_pendiente, moneda, cotizacion, fecha_vencimiento, clientes(id, nombre)')
      .eq('usuario_id', usuario_id)
      .eq('activo', true)
      .eq('estado', 'vencida')
      .order('fecha_vencimiento', { ascending: true })
      .limit(10),

    // 11. Todas las deudas no pagadas para top clientes
    supabase
      .from('deudas')
      .select('cliente_id, saldo_pendiente, moneda, cotizacion, estado, fecha_vencimiento, clientes(nombre)')
      .eq('usuario_id', usuario_id)
      .eq('activo', true)
      .neq('estado', 'pagada'),

    // 12. Configuración de mora del usuario
    supabase
      .from('usuarios')
      .select('mora_activa, mora_porcentaje, mora_tipo')
      .eq('id', usuario_id)
      .single(),
  ])

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

  // ── Pagos del mes / hoy ──────────────────────────────────
  let totalRecaudadoMesARS = 0
  let totalRecaudadoMesUSD = 0
  for (const p of pagosMes ?? []) {
    if (p.moneda === 'ARS') {
      totalRecaudadoMesARS += Number(p.monto)
    } else {
      totalRecaudadoMesUSD += Number(p.monto_original ?? 0)
    }
  }

  // ── Pagos del mes pasado (NUEVO - para moneda nativa) ────
  let totalRecaudadoMesPasadoARS = 0
  let totalRecaudadoMesPasadoUSD = 0
  for (const p of pagosMesPasado ?? []) {
    if (p.moneda === 'ARS') {
      totalRecaudadoMesPasadoARS += Number(p.monto)
    } else {
      totalRecaudadoMesPasadoUSD += Number(p.monto_original ?? 0)
    }
  }

  let totalRecaudadoHoyARS = 0
  let totalRecaudadoHoyUSD = 0
  for (const p of pagosHoy ?? []) {
    if (p.moneda === 'ARS') {
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
  const ultimosPagosConMoneda = ultimosPagos?.map(p => ({
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
    deudas: p.deudas,
  })) ?? []

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

    const { tieneMora, montoMora } = calcularMoraBackend(
      top.saldo,
      top.d.fecha_vencimiento,
      'vencida',
      moraConfigData ?? null
    )

    const pendiente = top.d.moneda === 'ARS' ? top.saldo : top.montoUSD
    const mora = top.d.moneda === 'ARS' ? montoMora : montoMora / top.cotiz
    const total = pendiente + mora

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
    const cotiz = Number(d.cotizacion) || cotizacionVigente
    const saldoUSD = d.moneda === 'USD' ? saldo / cotiz : saldo / cotizacionVigente

    const diasVencido = d.estado === 'vencida'
      ? Math.floor((ahora.getTime() - new Date(d.fecha_vencimiento).getTime()) / 86400000)
      : 0

    const existing = porCliente.get(clienteId)
    if (existing) {
      existing.saldo_pendiente += saldo
      existing.saldo_pendiente_usd += saldoUSD
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
        moneda: d.moneda,
        cotizacion: cotiz,
        clientes: { nombre: cliente?.nombre ?? 'Cliente' },
        max_dias_vencido: diasVencido,
        proximo_vencimiento: (d.estado !== 'vencida' && d.estado !== 'pagada') ? d.fecha_vencimiento : null,
      })
    }
  }

  const topClientes = Array.from(porCliente.values())
    .sort((a, b) => b.saldo_pendiente_usd - a.saldo_pendiente_usd)
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
    deudasVencidas: vencidasRaw ?? [],
    ultimosPagos: ultimosPagosConMoneda,
    clienteMayorRiesgo,
    topClientes,
  })
}