// frontend/src/features/clientes/hooks/useClienteArchive.ts
import { useState } from 'react'
import { clientesApi } from '../services/clientesApi'
import { handleApiError } from '../../../utils/handleApiError'

interface ConfirmState {
  id: string
  clienteNombre: string   // ← Cambiar 'nombre' por 'clienteNombre'
  accion: 'archivar' | 'restaurar'
}

interface UseClienteArchiveProps {
  onSuccess: () => void
}

export function useClienteArchive({ onSuccess }: UseClienteArchiveProps) {
  const [archivingId, setArchivingId] = useState<string | null>(null)
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null)

  const handleArchivar = (id: string, clienteNombre: string) => {
    setConfirmState({ id, clienteNombre, accion: 'archivar' })
  }

  const handleRestaurar = (id: string, clienteNombre: string) => {
    setConfirmState({ id, clienteNombre, accion: 'restaurar' })
  }

  const confirmAccion = async () => {
    if (!confirmState) return

    setArchivingId(confirmState.id)

    try {
      if (confirmState.accion === 'archivar') {
        await clientesApi.archivar(confirmState.id)
      } else {
        await clientesApi.restaurar(confirmState.id)
      }
      onSuccess()
      setConfirmState(null)
    } catch (error) {
      const message = handleApiError(error, `Error al ${confirmState.accion === 'archivar' ? 'archivar' : 'restaurar'} el cliente`)
      alert(message)
    } finally {
      setArchivingId(null)
    }
  }

  const cancelAccion = () => {
    setConfirmState(null)
  }

  return {
    archivingId,
    confirmState,
    handleArchivar,
    handleRestaurar,
    confirmAccion,
    cancelAccion,
  }
}