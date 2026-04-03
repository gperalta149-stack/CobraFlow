import { Request, Response } from 'express'
import { supabase } from '../config/supabase'
import { AuthRequest } from '../middleware/authMiddleware'

export const getDashboard = async (req: AuthRequest, res: Response) => {
  // Total clientes activos
  const { count: totalClientes } = await supabase
    .from('clientes')
    .select('*', { count: 'exact', head: true })
    .eq('activo', true)

  // Total deudas por estado
  const { data: deudas } = await supabase
    .from('deudas')
    .select('estado, saldo_pendiente, monto_total')

  const totalDeudas = deudas?.length || 0
  const deudasPendientes = deudas?.filter(d => d.estado === 'pendiente').length || 0
  const deudasVencidas = deudas?.filter(d => d.estado === 'vencida').length || 0
  const deudasPagadas = deudas?.filter(d => d.estado === 'pagada').length || 0
  const deudasParciales = deudas?.filter(d => d.estado === 'parcial').length || 0
  const totalMontoPendiente = deudas?.reduce((acc, d) => acc + Number(d.saldo_pendiente), 0) || 0
  const totalMontoDeudas = deudas?.reduce((acc, d) => acc + Number(d.monto_total), 0) || 0

  // Total pagos del mes actual
  const inicioMes = new Date()
  inicioMes.setDate(1)
  inicioMes.setHours(0, 0, 0, 0)

  const { data: pagosMes } = await supabase
    .from('pagos')
    .select('monto')
    .gte('created_at', inicioMes.toISOString())

  const totalRecaudadoMes = pagosMes?.reduce((acc, p) => acc + Number(p.monto), 0) || 0

  // Top 5 clientes con mayor deuda
  const { data: topClientes } = await supabase
    .from('deudas')
    .select('cliente_id, saldo_pendiente, clientes(nombre)')
    .neq('estado', 'pagada')
    .order('saldo_pendiente', { ascending: false })
    .limit(5)

  // Alertas de vencimiento proximos 7 dias
  const hoy = new Date()
  const en7dias = new Date()
  en7dias.setDate(hoy.getDate() + 7)

  const { data: alertas } = await supabase
    .from('deudas')
    .select('id, descripcion, fecha_vencimiento, saldo_pendiente, clientes(nombre)')
    .gte('fecha_vencimiento', hoy.toISOString().split('T')[0])
    .lte('fecha_vencimiento', en7dias.toISOString().split('T')[0])
    .neq('estado', 'pagada')

  res.json({
    kpis: {
      totalClientes,
      totalDeudas,
      deudasPendientes,
      deudasVencidas,
      deudasPagadas,
      deudasParciales,
      totalMontoPendiente,
      totalMontoDeudas,
      totalRecaudadoMes
    },
    topClientes,
    alertas
  })
}