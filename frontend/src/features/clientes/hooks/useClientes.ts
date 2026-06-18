// frontend/src/features/clientes/hooks/useClientes.ts
import { useState, useEffect, useCallback } from 'react'
import { clientesApi } from '../services/clientesApi'
import { deudasApi } from '../../deudas/services/deudasApi'
import { handleApiError } from '../../../utils/handleApiError'
import type { Cliente } from '../types'

// Tipo extendido para Cliente con estadoDeuda
export interface ClienteConEstado extends Cliente {
  estadoDeuda: 'pendiente' | 'parcial' | 'vencida' | 'pagada' | null
}

export type TipoClientes = 'activos' | 'archivados'

interface UseClientesProps {
  tipo?: TipoClientes
  buscar?: string
}

export function useClientes({ tipo = 'activos', buscar: buscarExterno = '' }: UseClientesProps = {}) {
  const [clientes, setClientes] = useState<ClienteConEstado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [buscar, setBuscar] = useState(buscarExterno)
  const [totalClientes, setTotalClientes] = useState(0)
  const [clientesConDeuda, setClientesConDeuda] = useState(0)
  const [clientesAlDia, setClientesAlDia] = useState(0)

  const fetchClientes = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      // Obtener clientes según el tipo (activos o archivados)
      const response = tipo === 'activos'
        ? await clientesApi.getAll(buscar)
        : await clientesApi.getArchivados(buscar)
      
      const clientesData = response.data
      setTotalClientes(clientesData.length)

      // Solo calcular estados si es 'activos' (para archivados no es necesario)
      if (tipo === 'activos') {
        // Obtener todas las deudas
        const deudasRes = await deudasApi.getAll()
        const deudas = deudasRes.data || []
        
        // Mapear el estado de deuda por cliente
        const estadoPorCliente = new Map<string, 'pendiente' | 'parcial' | 'vencida' | 'pagada' | null>()
        const clientesConDeudaSet = new Set<string>()
        
        // Agrupar deudas por cliente
        const deudasPorCliente = new Map<string, Array<{ estado: string; saldo_pendiente: number }>>()
        
        deudas.forEach(deuda => {
          if (!deudasPorCliente.has(deuda.cliente_id)) {
            deudasPorCliente.set(deuda.cliente_id, [])
          }
          deudasPorCliente.get(deuda.cliente_id)!.push({
            estado: deuda.estado,
            saldo_pendiente: deuda.saldo_pendiente
          })
        })
        
        // Determinar estado para cada cliente
        deudasPorCliente.forEach((deudasCliente, clienteId) => {
          let tieneVencida = false
          let tienePendiente = false
          let tieneParcial = false
          let tienePagada = false
          
          deudasCliente.forEach(deuda => {
            if (deuda.estado === 'vencida') tieneVencida = true
            if (deuda.estado === 'pendiente') tienePendiente = true
            if (deuda.estado === 'parcial') tieneParcial = true
            if (deuda.estado === 'pagada') tienePagada = true
          })
          
          // Determinar el estado principal
          let estado: 'pendiente' | 'parcial' | 'vencida' | 'pagada' | null = null
          
          if (tieneVencida) {
            estado = 'vencida'
            clientesConDeudaSet.add(clienteId)
          } else if (tienePendiente) {
            estado = 'pendiente'
            clientesConDeudaSet.add(clienteId)
          } else if (tieneParcial) {
            estado = 'parcial'
            clientesConDeudaSet.add(clienteId)
          } else if (tienePagada) {
            estado = 'pagada'
          } else {
            estado = null
          }
          
          estadoPorCliente.set(clienteId, estado)
        })
        
        // Agregar estadoDeuda a cada cliente
        const clientesConEstado: ClienteConEstado[] = clientesData.map(cliente => ({
          ...cliente,
          estadoDeuda: estadoPorCliente.get(cliente.id) || null
        }))
        
        setClientes(clientesConEstado)
        setClientesConDeuda(clientesConDeudaSet.size)
        setClientesAlDia(clientesConEstado.filter(c => 
          c.estadoDeuda === 'pagada' || c.estadoDeuda === null
        ).length)
      } else {
        // Para archivados, solo mapeamos sin calcular estado
        const clientesMapeados: ClienteConEstado[] = clientesData.map(cliente => ({
          ...cliente,
          estadoDeuda: null
        }))
        setClientes(clientesMapeados)
        setClientesConDeuda(0)
        setClientesAlDia(0)
      }
      
    } catch (err) {
      setError(handleApiError(err, `Error al cargar clientes ${tipo === 'activos' ? 'activos' : 'archivados'}`))
    } finally {
      setLoading(false)
    }
  }, [buscar, tipo])

  useEffect(() => {
    fetchClientes()
  }, [fetchClientes])

  const refetchClientes = useCallback(() => {
    fetchClientes()
  }, [fetchClientes])

  const loadData = useCallback(() => {
    fetchClientes()
  }, [fetchClientes])

  return {
    clientes,
    loading,
    error,
    buscar,
    setBuscar,
    refetchClientes,
    loadData,
    totalClientes,
    clientesConDeuda,
    clientesAlDia,
  }
}