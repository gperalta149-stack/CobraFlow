import { useState, useEffect, useCallback } from 'react'
import { pagosApi } from '../services/pagosApi'
import { handleApiError } from '../../../utils/handleApiError'
import type { Pago, Deuda } from '../types'

export function usePagos() {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [deudas, setDeudas] = useState<Deuda[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPagos = useCallback(async () => {
    const { data } = await pagosApi.getAll()
    return data
  }, [])

  const fetchDeudas = useCallback(async () => {
    return await pagosApi.getDeudasPendientes()
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [pagosData, deudasData] = await Promise.all([
        fetchPagos(),
        fetchDeudas()
      ])
      setPagos(pagosData)
      setDeudas(deudasData)
    } catch (err) {
      setError(handleApiError(err, 'Error al cargar los datos'))
    } finally {
      setLoading(false)
    }
  }, [fetchPagos, fetchDeudas])

  useEffect(() => {
    loadData()
  }, [loadData])

  const refetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [pagosData, deudasData] = await Promise.all([
        fetchPagos(),
        fetchDeudas()
      ])
      setPagos(pagosData)
      setDeudas(deudasData)
    } catch (err) {
      setError(handleApiError(err, 'Error al recargar los datos'))
    } finally {
      setLoading(false)
    }
  }, [fetchPagos, fetchDeudas])

  return {
    pagos,
    deudas,
    loading,
    error,
    refetchData,
    loadData
  }
}