import { useState } from 'react'
import { useAuth } from '../../auth/context/AuthContext'
import { perfilApi } from '../services/perfilApi'
import { handleApiError } from '../../../utils/handleApiError'
import type { PerfilFormData } from '../types'

export function usePerfil() {
  const { usuario, login, token } = useAuth()
  const [formPerfil, setFormPerfil] = useState<PerfilFormData>({
    nombre: usuario?.nombre || '',
    email: usuario?.email || ''
  })
  const [exito, setExito] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormPerfil({ ...formPerfil, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setExito('')
    setIsSubmitting(true)

    try {
      await perfilApi.updatePerfil(formPerfil)

      if (token && usuario) {
        login(token, { ...usuario, ...formPerfil })
      }
      setExito('Perfil actualizado correctamente')
    } catch (err) {
      setError(handleApiError(err, 'Error al actualizar perfil'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formPerfil,
    exito,
    error,
    isSubmitting,
    handleChange,
    handleSubmit
  }
}