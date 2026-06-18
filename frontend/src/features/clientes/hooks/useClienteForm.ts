import { useState, useRef } from 'react'
import { clientesApi } from '../services/clientesApi'
import { handleApiError } from '../../../utils/handleApiError'
import type { Cliente, ClienteFormData } from '../types'

interface UseClienteFormProps {
  onSuccess: () => void
}

const initialForm: ClienteFormData = {
  nombre: '',
  apellido: '',
  dni: '',
  email: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  provincia: '',
  empresa: '',
  observaciones: ''
}

const sanitizeForm = (f: ClienteFormData) => ({
  ...f,
  nombre: f.nombre.trim(),
  apellido: f.apellido.trim(),
  dni: f.dni.trim(),
  email: f.email?.trim() || null,
  telefono: f.telefono?.trim() || null,
  direccion: f.direccion?.trim() || null,
  ciudad: f.ciudad?.trim() || null,
  provincia: f.provincia?.trim() || null,
  empresa: f.empresa?.trim() || null,
  observaciones: f.observaciones?.trim() || null,
})

export function useClienteForm({ onSuccess }: UseClienteFormProps) {
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState<Cliente | null>(null)
  const [form, setForm] = useState<ClienteFormData>(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const nombreInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validaciones frontend
    if (!form.nombre.trim()) return setError('El nombre es requerido')
    if (!form.apellido.trim()) return setError('El apellido es requerido')
    if (!form.dni.trim()) return setError('El DNI es requerido')
    if (form.email && !form.email.includes('@')) return setError('Ingrese un email válido')

    setIsSubmitting(true)
    try {
      const data = sanitizeForm(form)
      if (editando) {
        await clientesApi.update(editando.id, data)
      } else {
        await clientesApi.create(data)
      }
      setForm(initialForm)
      setShowForm(false)
      setEditando(null)
      onSuccess()
    } catch (err: any) {
      setError(
        err.response?.data?.error ??
        handleApiError(err, editando ? 'Error al actualizar cliente' : 'Error al crear cliente')
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditar = (cliente: Cliente) => {
    setEditando(cliente)
    setForm({
      nombre: cliente.nombre ?? '',
      apellido: cliente.apellido ?? '',
      dni: cliente.dni ?? '',
      email: cliente.email ?? '',
      telefono: cliente.telefono ?? '',
      direccion: cliente.direccion ?? '',
      ciudad: cliente.ciudad ?? '',
      provincia: cliente.provincia ?? '',
      empresa: cliente.empresa ?? '',
      observaciones: cliente.observaciones ?? ''
    })
    setShowForm(true)
    setError('')
    setTimeout(() => nombreInputRef.current?.focus(), 100)
  }

  const handleNuevoCliente = () => {
    setShowForm(true)
    setEditando(null)
    setForm(initialForm)
    setError('')
    setTimeout(() => nombreInputRef.current?.focus(), 100)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditando(null)
    setForm(initialForm)
    setError('')
  }

  return {
    showForm,
    editando,
    form,
    error,
    isSubmitting,
    nombreInputRef,
    handleChange,
    handleSubmit,
    handleEditar,
    handleNuevoCliente,
    handleCancel
  }
}