import { useState } from 'react'
import { perfilApi } from '../services/perfilApi'
import { handleApiError } from '../../../utils/handleApiError'
import type { PasswordFormData } from '../types'

export function usePassword() {
  const [formPassword, setFormPassword] = useState<PasswordFormData>({
    passwordActual: '',
    passwordNuevo: '',
    confirmar: ''
  })
  const [exito, setExito] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormPassword({ ...formPassword, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setExito('')
    setIsSubmitting(true)

    if (formPassword.passwordNuevo !== formPassword.confirmar) {
      setError('Las contraseñas no coinciden')
      setIsSubmitting(false)
      return
    }

    if (formPassword.passwordNuevo.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setIsSubmitting(false)
      return
    }

    try {
      await perfilApi.changePassword({
        passwordActual: formPassword.passwordActual,
        passwordNuevo: formPassword.passwordNuevo
      })
      setFormPassword({ passwordActual: '', passwordNuevo: '', confirmar: '' })
      setExito('Contraseña cambiada correctamente')
    } catch (err) {
      setError(handleApiError(err, 'Error al cambiar contraseña'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormPassword({ passwordActual: '', passwordNuevo: '', confirmar: '' })
    setError('')
    setExito('')
  }

  return {
    formPassword,
    exito,
    error,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm
  }
}