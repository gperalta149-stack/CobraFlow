import { useState, useEffect, useCallback } from 'react'
import { clientesApi } from '../services/clientesApi'
import { handleApiError } from '../../../utils/handleApiError'
import type { Cliente } from '../types'

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [buscar, setBuscar] = useState('')

  const fetchClientes = useCallback(async () => {
    try {
      const { data } = await clientesApi.getAll(buscar)
      setClientes(data)
    } catch (err) {
      const errorMsg = handleApiError(err, 'Error al cargar clientes')
      console.error(errorMsg)
      throw err
    }
  }, [buscar])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      await fetchClientes()
    } catch (err) {
      setError(handleApiError(err, 'Error al cargar los datos'))
    } finally {
      setLoading(false)
    }
  }, [fetchClientes])

  useEffect(() => {
    loadData()
  }, [loadData])

  const refetchClientes = useCallback(async () => {
    setLoading(true)
    try {
      await fetchClientes()
    } catch (err) {
      setError(handleApiError(err, 'Error al recargar los clientes'))
    } finally {
      setLoading(false)
    }
  }, [fetchClientes])

  return {
    clientes,
    loading,
    error,
    buscar,
    setBuscar,
    refetchClientes,
    loadData
  }
}