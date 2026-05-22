import { useState } from 'react'
import { clientesApi } from '../services/clientesApi'
import { handleApiError } from '../../../utils/handleApiError'
import { useToast } from '../../../hooks/useToast'

interface UseClienteDeleteProps {
  onSuccess: () => void
}

export function useClienteDelete({ onSuccess }: UseClienteDeleteProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const { success, error: toastError } = useToast()

  const handleEliminar = async (id: string) => {
    setPendingId(id)
    setShowConfirm(true)
  }

  const confirmDelete = async () => {
    if (!pendingId) return
    
    setShowConfirm(false)
    setDeletingId(pendingId)

    try {
      await clientesApi.delete(pendingId)
      success('Cliente desactivado correctamente')
      onSuccess()
    } catch (err) {
      toastError(handleApiError(err, 'Error al eliminar el cliente'))
    } finally {
      setDeletingId(null)
      setPendingId(null)
    }
  }

  const cancelDelete = () => {
    setShowConfirm(false)
    setPendingId(null)
  }

  return { 
    deletingId, 
    handleEliminar, 
    showConfirm, 
    confirmDelete, 
    cancelDelete 
  }
}