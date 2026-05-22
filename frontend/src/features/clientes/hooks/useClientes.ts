import { useState, useEffect, useCallback } from 'react'
import { clientesApi } from '../services/clientesApi'
import { handleApiError } from '../../../utils/handleApiError'
import type { Cliente } from '../types'

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [buscar, setBuscar] = useState('')
  
  // Estados para paginación (HU-42)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  const fetchClientes = useCallback(async () => {
    try {
      const { data, headers } = await clientesApi.getAll(buscar, currentPage, itemsPerPage)
      setClientes(data)
      const total = parseInt(headers['x-total-count'] || '0')
      setTotalItems(total)
      setTotalPages(Math.ceil(total / itemsPerPage))
    } catch (err) {
      const errorMsg = handleApiError(err, 'Error al cargar clientes')
      console.error(errorMsg)
      throw err
    }
  }, [buscar, currentPage])

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

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  return {
    clientes,
    loading,
    error,
    buscar,
    setBuscar,
    refetchClientes,
    loadData,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      goToPage
    }
  }
}