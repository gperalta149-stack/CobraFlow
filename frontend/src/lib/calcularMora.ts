// frontend/src/lib/calcularMora.ts
import type { MoraConfig } from '../features/perfil/services/perfilApi'

export interface MoraResult {
  tieneMora: boolean
  montoMora: number
  totalConMora: number
  diasVencida: number
  mesesVencida: number
  descripcion: string
}

export function calcularMora(
  saldoPendiente: number,
  fechaVencimiento: string,
  estado: string,
  montoMoraAcumulada: number | undefined,
  config: MoraConfig | null
): MoraResult {
  const sinMora: MoraResult = {
    tieneMora: false,
    montoMora: 0,
    totalConMora: saldoPendiente,
    diasVencida: 0,
    mesesVencida: 0,
    descripcion: ''
  }

  if (!config?.mora_activa) return sinMora
  if (estado === 'pagada') return sinMora
  if (estado !== 'vencida') return sinMora

  const mora = Number(montoMoraAcumulada ?? 0)
  if (mora <= 0) return sinMora

  const hoy = new Date()
  const vencimiento = new Date(fechaVencimiento)
  const diasVencida = Math.floor((hoy.getTime() - vencimiento.getTime()) / (1000 * 60 * 60 * 24))
  const mesesVencida = Math.floor(diasVencida / 30) || 1

  const descripcion = config.mora_tipo === 'unica'
    ? `${config.mora_porcentaje}% única vez`
    : `${config.mora_porcentaje}% × ${mesesVencida} mes${mesesVencida > 1 ? 'es' : ''}`

  return {
    tieneMora: true,
    montoMora: mora,
    totalConMora: saldoPendiente + mora,
    diasVencida,
    mesesVencida,
    descripcion
  }
}