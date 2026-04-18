import { useState } from 'react'
import { clientesApi } from '../services/clientesApi'
import { handleApiError } from '../../../utils/handleApiError'

interface UseClienteDeleteProps {
  onSuccess: () => void
}

export function useClienteDelete({ onSuccess }: UseClienteDeleteProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Desactivar este cliente? Esta acción no se puede deshacer.')) return

    setDeletingId(id)

    try {
      await clientesApi.delete(id)
      onSuccess()
    } catch (err) {
      alert(handleApiError(err, 'Error al eliminar el cliente'))
    } finally {
      setDeletingId(null)
    }
  }

  return { deletingId, handleEliminar }
}