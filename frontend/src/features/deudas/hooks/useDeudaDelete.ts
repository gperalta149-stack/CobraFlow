import { useState } from 'react'
import { deudasApi } from '../services/deudasApi'
import { handleApiError } from '../../../utils/handleApiError'

interface UseDeudaDeleteProps {
  onSuccess: () => void
}

export function useDeudaDelete({ onSuccess }: UseDeudaDeleteProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Eliminar esta deuda? Esta acción no se puede deshacer.')) return

    setDeletingId(id)

    try {
      await deudasApi.delete(id)
      onSuccess()
    } catch (err) {
      alert(handleApiError(err, 'Error al eliminar la deuda'))
    } finally {
      setDeletingId(null)
    }
  }

  return { deletingId, handleEliminar }
}