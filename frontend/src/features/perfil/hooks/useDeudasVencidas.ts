// frontend/src/features/perfil/hooks/useDeudasVencidas.ts

import { useState, useEffect } from 'react'
import { deudasApi } from '../../deudas/services/deudasApi'
import { calcularMora } from '../../../lib/calcularMora'

export interface DeudaVencidaReal {
  id: string
  cliente_nombre: string
  saldo_pendiente: number
  fecha_vencimiento: string
  monto_mora: number
  total_con_mora: number
}

interface MoraConfig {
  mora_activa: boolean
  mora_porcentaje: number
  mora_tipo: 'mensual' | 'unica'
}

export function useDeudasVencidas(config: MoraConfig) {
  const [deudasVencidas, setDeudasVencidas] = useState<DeudaVencidaReal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDeudasVencidas = async () => {
      setLoading(true)
      try {
        // Usar getAll con estado 'vencida' para obtener solo deudas vencidas
        const response = await deudasApi.getAll('vencida')
        const data = response.data || []
        
        const conMora = data.map((deuda: any) => {
          // ✅ CORRECCIÓN: pasar 5 argumentos
          const resultado = calcularMora(
            deuda.saldo_pendiente,    // 1: saldoPendiente
            deuda.fecha_vencimiento,  // 2: fechaVencimiento
            deuda.estado,             // 3: estado
            deuda.monto_mora,         // 4: montoMoraAcumulada
            config                    // 5: config
          )
          
          return {
            id: deuda.id,
            cliente_nombre: deuda.cliente_nombre || deuda.clientes?.nombre || 'Cliente',
            saldo_pendiente: deuda.saldo_pendiente,
            fecha_vencimiento: deuda.fecha_vencimiento,
            monto_mora: resultado.montoMora,
            total_con_mora: resultado.totalConMora
          }
        })
        
        setDeudasVencidas(conMora)
      } catch (error) {
        console.error('Error cargando deudas vencidas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDeudasVencidas()
  }, [config.mora_activa, config.mora_porcentaje, config.mora_tipo])

  const totalMoraAcumulada = deudasVencidas.reduce((sum, d) => sum + d.monto_mora, 0)
  const totalRecuperable = deudasVencidas.reduce((sum, d) => sum + d.total_con_mora, 0)
  const cantidadDeudas = deudasVencidas.length

  return {
    deudasVencidas,
    totalMoraAcumulada,
    totalRecuperable,
    cantidadDeudas,
    loading
  }
}