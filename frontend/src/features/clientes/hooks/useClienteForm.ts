import { useState, useRef } from 'react'
import { clientesApi } from '../services/clientesApi'
import { handleApiError } from '../../../utils/handleApiError'
import type { Cliente, ClienteFormData } from '../types'

interface UseClienteFormProps {
  onSuccess: () => void
}

export function useClienteForm({ onSuccess }: UseClienteFormProps) {
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState<Cliente | null>(null)
  const [form, setForm] = useState<ClienteFormData>({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const nombreInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (!form.nombre.trim()) {
        setError('El nombre es requerido')
        setIsSubmitting(false)
        return
      }

      if (form.email && !form.email.includes('@')) {
        setError('Ingrese un email válido')
        setIsSubmitting(false)
        return
      }

      if (editando) {
        await clientesApi.update(editando.id, form)
      } else {
        await clientesApi.create(form)
      }

      setForm({ nombre: '', email: '', telefono: '', direccion: '' })
      setShowForm(false)
      setEditando(null)
      onSuccess()
    } catch (err) {
      setError(handleApiError(err, editando ? 'Error al actualizar cliente' : 'Error al crear cliente'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditar = (cliente: Cliente) => {
    setEditando(cliente)
    setForm({
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion
    })
    setShowForm(true)
    setError('')
    setTimeout(() => nombreInputRef.current?.focus(), 100)
  }

  const handleNuevoCliente = () => {
    setShowForm(true)
    setEditando(null)
    setForm({ nombre: '', email: '', telefono: '', direccion: '' })
    setError('')
    setTimeout(() => nombreInputRef.current?.focus(), 100)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditando(null)
    setForm({ nombre: '', email: '', telefono: '', direccion: '' })
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