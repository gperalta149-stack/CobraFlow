import { useState } from 'react'
import { pagosApi } from '../services/pagosApi'
import { handleApiError } from '../../../utils/handleApiError'
import type { PagoFormData, Deuda } from '../types'

interface UsePagoFormProps {
  deudas: Deuda[]
  onSuccess: () => void
}

export function usePagoForm({ deudas, onSuccess }: UsePagoFormProps) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<PagoFormData>({
    deuda_id: '',
    monto: '',
    observaciones: ''
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const deudaSeleccionada = deudas.find(d => d.id === form.deuda_id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const montoNumber = Number(form.monto)

      if (deudaSeleccionada && montoNumber > deudaSeleccionada.saldo_pendiente) {
        setError(`El monto no puede ser mayor al saldo pendiente ($${deudaSeleccionada.saldo_pendiente.toLocaleString()})`)
        setIsSubmitting(false)
        return
      }

      if (montoNumber <= 0) {
        setError('El monto debe ser mayor a cero')
        setIsSubmitting(false)
        return
      }

      await pagosApi.create(form)

      setForm({ deuda_id: '', monto: '', observaciones: '' })
      setShowForm(false)
      onSuccess()
    } catch (err) {
      setError(handleApiError(err, 'Error al registrar pago'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setForm({ deuda_id: '', monto: '', observaciones: '' })
    setError('')
  }

  const openForm = () => {
    setShowForm(true)
    setError('')
  }

  return {
    showForm,
    form,
    error,
    isSubmitting,
    deudaSeleccionada,
    handleChange,
    handleSubmit,
    handleCancel,
    openForm
  }
}