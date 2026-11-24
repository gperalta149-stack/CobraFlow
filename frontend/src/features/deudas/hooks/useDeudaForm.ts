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

// Acepta "1468,50" y "1468.50"
const aNumero = (valor: string): number => parseFloat(valor.replace(',', '.')) || 0

export function useDeudaForm({ onSuccess }: UseDeudaFormProps) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<DeudaFormData>(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const descripcionInputRef = useRef<HTMLTextAreaElement>(null)

  // true cuando el usuario escribió la cotización a mano: no se la pisa con la automática
  const cotizacionManual = useRef(false)

  // Cotización del sistema. Si no es de hoy, el backend la actualiza al momento de pedirla.
  const { rate, loading: cargandoCotizacion } = useExchangeRate()
  // Sin cotización disponible no se inventa un valor: queda en 0 y el usuario la completa
  const cotizacionActual = rate?.venta ?? 0
  const cotizacionFecha = rate?.fecha ?? null
  const cotizacionEsDeHoy = rate?.es_hoy ?? false

  const cotizacionComoTexto = () => (cotizacionActual > 0 ? cotizacionActual.toString() : '')

  // Prefill con la cotización actual cuando llega, salvo que el usuario ya la haya escrito
  useEffect(() => {
    if (form.moneda !== 'USD' || cotizacionManual.current) return
    setForm(prev => ({ ...prev, cotizacion: cotizacionActual > 0 ? cotizacionActual.toString() : '' }))
  }, [form.moneda, cotizacionActual])

  // Actualizar monto_total automáticamente
  useEffect(() => {
    if (form.moneda === 'USD') {
      const nuevoTotal = (aNumero(form.monto_original) * aNumero(form.cotizacion)).toFixed(2)
      setForm(prev => ({ ...prev, monto_total: nuevoTotal }))
    } else {
      setForm(prev => ({ ...prev, monto_total: form.monto_original || '0' }))
    }
  }, [form.monto_original, form.cotizacion, form.moneda])

  // Cambio de moneda: en USD arranca con la cotización actual
  const handleMonedaChange = (moneda: 'ARS' | 'USD') => {
    cotizacionManual.current = false
    setForm(prev => ({
      ...prev,
      moneda,
      cotizacion: moneda === 'USD' ? cotizacionComoTexto() : '1',
      monto_original: '',
      monto_total: ''
    }))
  }

  // Botón "Usar cotización actual": descarta el valor escrito a mano
  const usarCotizacionActual = () => {
    cotizacionManual.current = false
    setForm(prev => ({ ...prev, cotizacion: cotizacionComoTexto() }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'cotizacion') cotizacionManual.current = true
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

      const montoOriginal = aNumero(form.monto_original)
      if (montoOriginal <= 0) {
        setError('El monto debe ser mayor a cero')
        setIsSubmitting(false)
        return
      }

      const cotizacion = aNumero(form.cotizacion)
      if (form.moneda === 'USD' && cotizacion <= 0) {
        setError('Ingresá la cotización del dólar')
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
        monto_original: montoOriginal.toString(),
        cotizacion: form.moneda === 'USD' ? cotizacion.toString() : '1',
        observaciones: form.observaciones || ''
      }

      await deudasApi.create(dataToSend)

      cotizacionManual.current = false
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
    cotizacionManual.current = false
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
    cotizacionFecha,
    cotizacionEsDeHoy,
    cargandoCotizacion,
    descripcionInputRef,
    handleChange,
    handleMonedaChange,
    usarCotizacionActual,
    handleSubmit,
    handleCancel,
    openForm
  }
}
