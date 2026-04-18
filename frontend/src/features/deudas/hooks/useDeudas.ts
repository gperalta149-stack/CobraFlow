import { useState, useEffect, useCallback } from 'react'
import { deudasApi } from '../services/deudasApi'
import { handleApiError } from '../../../utils/handleApiError'
import type { Deuda, Cliente } from '../types'

export function useDeudas() {
  const [deudas, setDeudas] = useState<Deuda[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')

  const fetchDeudas = useCallback(async () => {
    try {
      const { data } = await deudasApi.getAll(filtroEstado)
      setDeudas(data)
    } catch (err) {
      const errorMsg = handleApiError(err, 'Error al cargar deudas')
      console.error(errorMsg)
      throw err
    }
  }, [filtroEstado])

  const fetchClientes = useCallback(async () => {
    try {
      const { data } = await deudasApi.getClientes()
      setClientes(data)
    } catch (err) {
      const errorMsg = handleApiError(err, 'Error al cargar clientes')
      console.error(errorMsg)
      throw err
    }
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      await Promise.all([fetchDeudas(), fetchClientes()])
    } catch (err) {
      setError(handleApiError(err, 'Error al cargar los datos'))
    } finally {
      setLoading(false)
    }
  }, [fetchDeudas, fetchClientes])

  useEffect(() => {
    loadData()
  }, [loadData])

  const refetchDeudas = useCallback(async () => {
    setLoading(true)
    try {
      await fetchDeudas()
    } catch (err) {
      setError(handleApiError(err, 'Error al recargar las deudas'))
    } finally {
      setLoading(false)
    }
  }, [fetchDeudas])

  return {
    deudas,
    clientes,
    loading,
    error,
    filtroEstado,
    setFiltroEstado,
    refetchDeudas,
    loadData
  }
}