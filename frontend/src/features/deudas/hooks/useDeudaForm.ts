import { useEffect, useRef, useState } from 'react'
import { useExchangeRate } from '../../../hooks/useExchangeRate'
import { handleApiError } from '../../../utils/handleApiError'
import { deudasApi } from '../services/deudasApi'
import type { DeudaFormData } from '../types'

interface UseDeudaFormProps {
  onSuccess: () => void
}

const initialForm: DeudaFormData = {
  cliente_id: '',
  numero_factura: '',
  descripcion: '',
  monto_total: '',
  fecha_vencimiento: '',
  moneda: 'ARS',
  monto_original: '',
  cotizacion: '',
  observaciones: ''
}

export function useDeudaForm({ onSuccess }: UseDeudaFormProps) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<DeudaFormData>(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const descripcionInputRef = useRef<HTMLTextAreaElement>(null)

  // Cotización única del sistema (guardada en BD, actualizada por el cron del backend)
  const { rate, loading: cargandoCotizacion } = useExchangeRate()
  const cotizacionActual = rate?.venta || 1200

  // Prefill de cotización cuando llega el valor, si el usuario no la tocó todavía
  useEffect(() => {
    if (!cargandoCotizacion && form.moneda === 'USD' && !form.cotizacion) {
      setForm(prev => ({ ...prev, cotizacion: cotizacionActual.toString() }))
    }
  }, [cargandoCotizacion, cotizacionActual])

  // Actualizar monto_total automáticamente
  useEffect(() => {
    if (form.moneda === 'USD') {
      const montoOriginal = parseFloat(form.monto_original) || 0
      const cotizacion = parseFloat(form.cotizacion) || cotizacionActual
      const nuevoTotal = (montoOriginal * cotizacion).toFixed(2)
      setForm(prev => ({ ...prev, monto_total: nuevoTotal }))
    } else {
      setForm(prev => ({ ...prev, monto_total: form.monto_original || '0' }))
    }
  }, [form.monto_original, form.cotizacion, form.moneda, cotizacionActual])

  // Actualizar cotización según la moneda
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      cotizacion: form.moneda === 'USD' ? (cotizacionActual || 1200).toString() : '1'
    }))
  }, [form.moneda, cotizacionActual])

  // Función dedicada para cambio de moneda
  const handleMonedaChange = (moneda: 'ARS' | 'USD') => {
    setForm(prev => ({
      ...prev,
      moneda,
      cotizacion: moneda === 'USD' ? (cotizacionActual || 1200).toString() : '1',
      monto_original: '',
      monto_total: ''
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
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

      const montoOriginal = parseFloat(form.monto_original)
      if (isNaN(montoOriginal) || montoOriginal <= 0) {
        setError('El monto debe ser mayor a cero')
        setIsSubmitting(false)
        return
      }

      if (!form.fecha_vencimiento) {
        setError('La fecha de vencimiento es requerida')
        setIsSubmitting(false)
        return
      }

      const dataToSend = {
        cliente_id: form.cliente_id,
        numero_factura: form.numero_factura || '',
        descripcion: form.descripcion.trim(),
        monto_total: form.monto_total,
        fecha_vencimiento: form.fecha_vencimiento,
        moneda: form.moneda,
        monto_original: form.monto_original,
        cotizacion: form.moneda === 'USD' ? (form.cotizacion || cotizacionActual.toString()) : '1',
        observaciones: form.observaciones || ''
      }

      await deudasApi.create(dataToSend)

      setForm(initialForm)
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
    setForm(initialForm)
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
    cotizacionActual,
    cargandoCotizacion,
    descripcionInputRef,
    handleChange,
    handleMonedaChange,
    handleSubmit,
    handleCancel,
    openForm
  }
}