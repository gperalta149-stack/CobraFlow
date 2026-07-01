import { useState, useEffect } from 'react'
import { pagosApi } from '../services/pagosApi'
import { handleApiError } from '../../../utils/handleApiError'
import { useExchangeRate } from '../../../hooks/useExchangeRate'
import type { PagoFormData, Deuda } from '../types'

interface UsePagoFormProps {
  deudas: Deuda[]
  onSuccess: () => void
}

const initialForm: PagoFormData = {
  deuda_id: '',
  monto: '',
  moneda_pago: 'ARS',
  cotizacion_pago: '1',
  metodo_pago: 'efectivo',
  observaciones: ''
}

export function usePagoForm({ deudas, onSuccess }: UsePagoFormProps) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<PagoFormData>(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cotización única del sistema (guardada en BD, actualizada por el cron del backend)
  const { rate, loading: cargandoCotizacion } = useExchangeRate()
  const cotizacionActual = rate?.venta || 0

  // Cuando cambia la deuda seleccionada
  useEffect(() => {
    if (!form.deuda_id) return
    const deuda = deudas.find(d => d.id === form.deuda_id)
    if (!deuda) return
    setForm(prev => ({
      ...prev,
      moneda_pago: deuda.moneda,
      cotizacion_pago: deuda.moneda === 'USD'
        ? (deuda.cotizacion || cotizacionActual).toString()
        : '1'
    }))
  }, [form.deuda_id, deudas, cotizacionActual])

  // Cuando cambia la moneda de pago
  useEffect(() => {
    if (!cotizacionActual) return
    setForm(prev => ({
      ...prev,
      cotizacion_pago: cotizacionActual.toString()
    }))
  }, [form.moneda_pago, cotizacionActual])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleMonedaPagoChange = (moneda: 'ARS' | 'USD') => {
    setForm(prev => ({
      ...prev,
      moneda_pago: moneda,
      cotizacion_pago: moneda === 'USD' ? cotizacionActual.toString() : '1',
      monto: ''
    }))
  }

  const deudaSeleccionada = deudas.find(d => d.id === form.deuda_id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const montoNum = parseFloat(form.monto.replace(',', '.'))
      const cotizacionNum = parseFloat(form.cotizacion_pago) || 1

      if (isNaN(montoNum) || montoNum <= 0) {
        setError('El monto debe ser mayor a cero')
        setIsSubmitting(false)
        return
      }

      if (deudaSeleccionada) {
        const montoEnARS = form.moneda_pago === 'USD'
          ? montoNum * cotizacionNum
          : montoNum

        if (montoEnARS > deudaSeleccionada.saldo_pendiente + 0.01) {
          const saldoEnMonedaPago = form.moneda_pago === 'USD'
            ? `USD ${(deudaSeleccionada.saldo_pendiente / cotizacionNum).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
            : `$${deudaSeleccionada.saldo_pendiente.toLocaleString('es-AR', { minimumFractionDigits: 2 })} ARS`
          setError(`El monto supera el saldo pendiente (${saldoEnMonedaPago})`)
          setIsSubmitting(false)
          return
        }
      }

      await pagosApi.create(form)
      setForm(initialForm)
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
    setForm(initialForm)
    setError('')
  }

  const openForm = () => {
    setShowForm(true)
    setError('')
  }

  return {
    showForm, form, error, isSubmitting,
    deudaSeleccionada, cotizacionActual, cargandoCotizacion,
    handleChange, handleMonedaPagoChange,
    handleSubmit, handleCancel, openForm
  }
}