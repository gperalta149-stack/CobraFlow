import { useState, useRef } from 'react'
import { deudasApi } from '../services/deudasApi'
import { handleApiError } from '../../../utils/handleApiError'
import type { DeudaFormData } from '../types'

interface UseDeudaFormProps {
  onSuccess: () => void
}

export function useDeudaForm({ onSuccess }: UseDeudaFormProps) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<DeudaFormData>({
    cliente_id: '',
    descripcion: '',
    monto_total: '',
    fecha_vencimiento: ''
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const descripcionInputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const montoTotal = Number(form.monto_total)

      if (montoTotal <= 0) {
        setError('El monto total debe ser mayor a cero')
        setIsSubmitting(false)
        return
      }

      if (!form.cliente_id) {
        setError('Debe seleccionar un cliente')
        setIsSubmitting(false)
        return
      }

      if (!form.descripcion.trim()) {
        setError('La descripción es requerida')
        setIsSubmitting(false)
        return
      }

      await deudasApi.create(form)

      setForm({
        cliente_id: '',
        descripcion: '',
        monto_total: '',
        fecha_vencimiento: ''
      })
      setShowForm(false)
      onSuccess()
    } catch (err) {
      setError(handleApiError(err, 'Error al guardar la deuda'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setForm({
      cliente_id: '',
      descripcion: '',
      monto_total: '',
      fecha_vencimiento: ''
    })
    setError('')
  }

  const openForm = () => {
    setShowForm(true)
    setTimeout(() => {
      descripcionInputRef.current?.focus()
    }, 100)
  }

  return {
    showForm,
    form,
    error,
    isSubmitting,
    descripcionInputRef,
    handleChange,
    handleSubmit,
    handleCancel,
    openForm
  }
}