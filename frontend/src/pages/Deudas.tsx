import { useEffect, useState, useCallback, useRef } from 'react'
import Navbar from '../components/Navbar'
import DeudasTable from '../components/DeudasTable'
import api from '../services/api'
import { handleApiError } from '../utils/handleApiError'

// 🔹 Mejora 1: Interface Deuda (debe coincidir con la de DeudasTable)
interface Deuda {
  id: string
  descripcion: string
  monto_total: number
  monto_pagado: number
  saldo_pendiente: number
  fecha_vencimiento: string
  estado: string
  cliente_id: string
  clientes: { nombre: string; email: string }
}

interface Cliente {
  id: string
  nombre: string
}

export default function Deudas() {
  // 🔹 Mejora 1: Tipado correcto del state
  const [deudas, setDeudas] = useState<Deuda[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ 
    cliente_id: '', 
    descripcion: '', 
    monto_total: '', 
    fecha_vencimiento: '' 
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const descripcionInputRef = useRef<HTMLInputElement>(null)

  const fetchDeudas = useCallback(async () => {
    try {
      const { data } = await api.get<Deuda[]>(`/deudas${filtroEstado ? `?estado=${filtroEstado}` : ''}`)
      setDeudas(data)
    } catch (err) {
      const errorMsg = handleApiError(err, 'Error al cargar deudas')
      console.error('Error al cargar deudas:', errorMsg)
      throw err
    }
  }, [filtroEstado])

  const fetchClientes = useCallback(async () => {
    try {
      const { data } = await api.get<Cliente[]>('/clientes')
      setClientes(data)
    } catch (err) {
      const errorMsg = handleApiError(err, 'Error al cargar clientes')
      console.error('Error al cargar clientes:', errorMsg)
      throw err
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setFetchError('')
      try {
        await Promise.all([fetchDeudas(), fetchClientes()])
      } catch (err) {
        setFetchError(handleApiError(err, 'Error al cargar los datos'))
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [fetchDeudas, fetchClientes])

  useEffect(() => {
    if (showForm && descripcionInputRef.current) {
      descripcionInputRef.current.focus()
    }
  }, [showForm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setError('')
    setIsSubmitting(true)
    
    try {
      const montoTotal = Number(form.monto_total)
      
      // 🔹 Mejora 2: Cortar correctamente el loading en cada validación
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
      
      await api.post('/deudas', { 
        ...form, 
        monto_total: montoTotal,
        descripcion: form.descripcion.trim()
      })
      
      setForm({ 
        cliente_id: '', 
        descripcion: '', 
        monto_total: '', 
        fecha_vencimiento: '' 
      })
      setShowForm(false)
      
      // 🔹 Mejora 3: Solo recargar deudas (clientes no cambian) - BIEN OPTIMIZADO ✅
      setLoading(true)
      try {
        await fetchDeudas()
      } catch (err) {
        setError(handleApiError(err, 'Error al recargar las deudas'))
      } finally {
        setLoading(false)
      }
      
    } catch (err) {
      setError(handleApiError(err, 'Error al guardar la deuda'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEliminar = async (id: string) => {
    // 🔹 Mejora 4: confirm nativo (opcional mejorar después)
    if (!confirm('¿Eliminar esta deuda? Esta acción no se puede deshacer.')) return
    
    setDeletingId(id)
    
    try {
      await api.delete(`/deudas/${id}`)
      setLoading(true)
      try {
        await fetchDeudas()
      } catch (err) {
        setError(handleApiError(err, 'Error al recargar las deudas'))
      } finally {
        setLoading(false)
      }
    } catch (err) {
      alert(handleApiError(err, 'Error al eliminar la deuda'))
    } finally {
      setDeletingId(null)
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Deudas</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nueva Deuda
          </button>
        </div>

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

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="parcial">Parcial</option>
          <option value="pagada">Pagada</option>
          <option value="vencida">Vencida</option>
        </select>
        
        {showForm && (
          <div className="bg-white rounded-xl p-4 shadow mb-4">
            <h2 className="font-bold text-gray-700 mb-3">Nueva Deuda</h2>
            {error && (
              <div className="bg-red-100 text-red-600 p-2 rounded mb-3">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                value={form.cliente_id}
                onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isSubmitting}
              >
                <option value="">Seleccionar cliente *</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              
              <input
                ref={descripcionInputRef}
                placeholder="Descripción *"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isSubmitting}
              />
              
              <input
                type="number"
                step="0.01"
                placeholder="Monto total *"
                value={form.monto_total}
                onChange={(e) => setForm({ ...form, monto_total: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isSubmitting}
              />
              
              <input
                type="date"
                value={form.fecha_vencimiento}
                onChange={(e) => setForm({ ...form, fecha_vencimiento: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isSubmitting}
              />
              
              <div className="flex gap-2 md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creando...' : 'Crear deuda'}
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Cargando deudas...</div>
          </div>
        ) : fetchError ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="text-red-600">
              <p className="font-semibold">Error al cargar los datos</p>
              <p className="text-sm mt-2">{fetchError}</p>
            </div>
          </div>
        ) : deudas.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-lg font-medium">No hay deudas</p>
              <p className="text-sm mt-2">Creá tu primera deuda para comenzar</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Crear primera deuda
              </button>
            </div>
          </div>
        ) : (
          <DeudasTable 
            deudas={deudas} 
            onEliminar={handleEliminar}
            deletingId={deletingId}
          />
        )}
      </div>
    </div>
  )
}