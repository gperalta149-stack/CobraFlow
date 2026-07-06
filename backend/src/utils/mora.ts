export interface MoraConfig {
  mora_activa: boolean
  mora_porcentaje: number
  mora_tipo: 'unica' | 'mensual'
}

export interface ResultadoMora {
  diasVencida: number
  moraCalculada: number
}

// Calcula la mora sobre monto_total (fijo), nunca sobre saldo_pendiente.
// diasVencida <= 0 → deuda aún no vencida, mora = 0.
export const calcularMora = (
  montoTotal: number,
  fechaVencimiento: string | Date,
  config: MoraConfig,
  ahora: Date = new Date()
): ResultadoMora => {
  const vencimiento = new Date(fechaVencimiento)
  const diasVencida = Math.floor((ahora.getTime() - vencimiento.getTime()) / 86400000)

  if (!config.mora_activa || diasVencida <= 0) {
    return { diasVencida, moraCalculada: 0 }
  }

  const mesesVencida = Math.floor(diasVencida / 30) || 1
  const porcentaje = config.mora_porcentaje / 100

  const moraCalculada = config.mora_tipo === 'unica'
    ? montoTotal * porcentaje
    : montoTotal * porcentaje * mesesVencida

  return { diasVencida, moraCalculada: Math.round(moraCalculada * 100) / 100 }
}

// Invariante del proyecto: la mora persistida nunca disminuye.
// Devuelve el monto que corresponde guardar (el mayor entre el actual y el calculado).
export const aplicarNoDecremento = (moraActual: number, moraCalculada: number): number => {
  return moraCalculada > moraActual ? moraCalculada : moraActual
}