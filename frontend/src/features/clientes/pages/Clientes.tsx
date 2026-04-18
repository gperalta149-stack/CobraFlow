import { useCallback, useEffect, useRef, useState } from 'react'
import api from '../../../services/api'
import { handleApiError } from '../../../utils/handleApiError'

interface Cliente {
  id: string
  nombre: string
  email: string
  telefono: string
  direccion: string
  activo: boolean
}

const Navbar = () => (
  <header className="bg-white shadow-sm p-4 rounded-xl mb-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <span className="text-lg font-semibold text-gray-800">CobraFlow</span>
    </div>
  </header>
)

// 🔹 Mejora: Helper para formatear teléfono (opcional)
const formatPhone = (phone: string): string => {
  if (!phone) return '-'
  // Si tiene código de área, formatearlo
  if (phone.length === 10) {
    return `(${phone.slice(0,3)}) ${phone.slice(3,6)}-${phone.slice(6)}`
  }
  return phone
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [buscar, setBuscar] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState<Cliente | null>(null)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', direccion: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // 🔹 Mejora: Auto-focus en el primer campo del formulario
  const nombreInputRef = useRef<HTMLInputElement>(null)

  const fetchClientes = useCallback(async () => {
    try {
      const { data } = await api.get<Cliente[]>(`/clientes${buscar ? `?buscar=${buscar}` : ''}`)
      setClientes(data)
    } catch (err) {
      const errorMsg = handleApiError(err, 'Error al cargar clientes')
      console.error('Error al cargar clientes:', errorMsg)
      throw err
    }
  }, [buscar])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setFetchError('')
      try {
        await fetchClientes()
      } catch (err) {
        setFetchError(handleApiError(err, 'Error al cargar los datos'))
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [fetchClientes])

  // 🔹 Mejora: Auto-focus cuando se abre el formulario
  useEffect(() => {
    if (showForm && nombreInputRef.current) {
      nombreInputRef.current.focus()
    }
  }, [showForm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setError('')
    setIsSubmitting(true)
    
    try {
      // 🔹 Mejora: Validaciones básicas
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
        await api.put(`/clientes/${editando.id}`, {
          ...form,
          nombre: form.nombre.trim(),
          email: form.email.trim() || null,
          telefono: form.telefono.trim() || null,
          direccion: form.direccion.trim() || null
        })
      } else {
        await api.post('/clientes', {
          ...form,
          nombre: form.nombre.trim(),
          email: form.email.trim() || null,
          telefono: form.telefono.trim() || null,
          direccion: form.direccion.trim() || null
        })
      }
      
      setForm({ nombre: '', email: '', telefono: '', direccion: '' })
      setShowForm(false)
      setEditando(null)
      
      setLoading(true)
      try {
        await fetchClientes()
      } catch (err) {
        setError(handleApiError(err, 'Error al recargar los clientes'))
      } finally {
        setLoading(false)
      }
      
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
  }

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Desactivar este cliente? Esta acción no se puede deshacer.')) return
    
    setDeletingId(id)
    
    try {
      await api.delete(`/clientes/${id}`)
      setLoading(true)
      try {
        await fetchClientes()
      } catch (err) {
        setError(handleApiError(err, 'Error al recargar los clientes'))
      } finally {
        setLoading(false)
      }
    } catch (err) {
      alert(handleApiError(err, 'Error al eliminar el cliente'))
    } finally {
      setDeletingId(null)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditando(null)
    setForm({ nombre: '', email: '', telefono: '', direccion: '' })
    setError('')
  }

  const handleNuevoCliente = () => {
    setShowForm(true)
    setEditando(null)
    setForm({ nombre: '', email: '', telefono: '', direccion: '' })
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
          <button
            onClick={handleNuevoCliente}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nuevo Cliente
          </button>
        </div>

        {/* 🔹 Mejora: Mostrar error de fetch si existe */}
        {fetchError && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
            {fetchError}
            <button
              onClick={() => window.location.reload()}
              className="ml-4 text-sm underline hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* 🔹 Mejora: Input de búsqueda con ícono */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            className="w-full pl-10 pr-4 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-xl p-4 shadow mb-4">
            <h2 className="font-bold text-gray-700 mb-3">
              {editando ? '✏️ Editar Cliente' : '➕ Nuevo Cliente'}
            </h2>
            {error && (
              <div className="bg-red-100 text-red-600 p-2 rounded mb-3">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                ref={nombreInputRef}
                placeholder="Nombre *"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isSubmitting}
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <input
                placeholder="Teléfono"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <input
                placeholder="Dirección"
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <div className="flex gap-2 md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Guardando...' : (editando ? 'Guardar cambios' : 'Crear cliente')}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla de clientes */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Cargando clientes...</div>
          </div>
        ) : fetchError ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="text-red-600">
              <p className="font-semibold">Error al cargar los datos</p>
              <p className="text-sm mt-2">{fetchError}</p>
            </div>
          </div>
        ) : clientes.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-lg font-medium">No hay clientes</p>
              <p className="text-sm mt-2">Creá tu primer cliente para comenzar</p>
              <button
                onClick={handleNuevoCliente}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Crear primer cliente
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-600 text-sm">
                  <tr>
                    <th className="p-3 text-left">Nombre</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Teléfono</th>
                    <th className="p-3 text-left">Dirección</th>
                    <th className="p-3 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((c) => (
                    <tr key={c.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium">{c.nombre}</td>
                      <td className="p-3 text-gray-600">{c.email || '-'}</td>
                      <td className="p-3 text-gray-600">{formatPhone(c.telefono)}</td>
                      <td className="p-3 text-gray-600">{c.direccion || '-'}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditar(c)}
                            disabled={deletingId === c.id}
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminar(c.id)}
                            disabled={deletingId === c.id}
                            className="text-red-500 hover:text-red-700 transition-colors text-sm disabled:opacity-50"
                          >
                            {deletingId === c.id ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}