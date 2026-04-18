import { useEffect, useState } from 'react'
import api from '../../../services/api'
import { handleApiError } from '../../../utils/handleApiError'
import Navbar from '../components/Navbar'

interface Pago {
  id: string
  monto: number
  fecha_pago: string
  observaciones: string
  deudas: { descripcion: string; monto_total: number }
  clientes: { nombre: string }
}

interface Deuda {
  id: string
  descripcion: string
  saldo_pendiente: number
  estado: string
  clientes: { nombre: string }
}

export default function Pagos() {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [deudas, setDeudas] = useState<Deuda[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ deuda_id: '', monto: '', observaciones: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fetchError, setFetchError] = useState('') // 👈 Mejora 2: error para el fetch

  // 🔹 Mejora 1: fetchPagos ya NO maneja loading
  const fetchPagos = async () => {
    try {
      const { data } = await api.get<Pago[]>('/pagos')
      setPagos(data)
    } catch (err) {
      const errorMsg = handleApiError(err, 'Error al cargar pagos')
      console.error('Error al cargar pagos:', errorMsg)
      throw err // 👈 Re-lanzar para que Promise.all lo capture
    }
  }

  // 🔹 Mejora 1: fetchDeudas ya NO maneja loading
  const fetchDeudas = async () => {
    try {
      const { data } = await api.get<Deuda[]>('/deudas')
      const deudasPendientes = data.filter((d: Deuda) => d.estado !== 'pagada')
      setDeudas(deudasPendientes)
    } catch (err) {
      const errorMsg = handleApiError(err, 'Error al cargar deudas')
      console.error('Error al cargar deudas:', errorMsg)
      throw err // 👈 Re-lanzar para que Promise.all lo capture
    }
  }

  // 🔹 Mejora 1: loading manejado AQUÍ, no dentro de los fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setFetchError('') // Limpiar error anterior
      try {
        await Promise.all([fetchPagos(), fetchDeudas()])
      } catch (err) {
        // 🔹 Mejora 2: mostrar error en UI
        setFetchError(handleApiError(err, 'Error al cargar los datos'))
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    
    try {
      const deudaSeleccionada = deudas.find(d => d.id === form.deuda_id)
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
      
      await api.post('/pagos', { 
        ...form, 
        monto: montoNumber 
      })
      
      setForm({ deuda_id: '', monto: '', observaciones: '' })
      setShowForm(false)
      
      // Recargar datos después de crear el pago
      setLoading(true)
      try {
        await Promise.all([fetchPagos(), fetchDeudas()])
      } catch (err) {
        setError(handleApiError(err, 'Error al recargar los datos'))
      } finally {
        setLoading(false)
      }
      
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

  const deudaSeleccionada = deudas.find(d => d.id === form.deuda_id)

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Pagos</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + Registrar Pago
          </button>
        </div>

        {/* 🔹 Mejora 2: Mostrar error de fetch si existe */}
        {fetchError && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
            {fetchError}
          </div>
        )}

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-xl p-4 shadow mb-4">
            <h2 className="font-bold text-gray-700 mb-3">Registrar Pago</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-3">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                value={form.deuda_id}
                onChange={(e) => setForm({ ...form, deuda_id: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              >
                <option value="">Seleccionar deuda *</option>
                {deudas.length === 0 ? (
                  <option value="" disabled>No hay deudas pendientes</option>
                ) : (
                  deudas.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.clientes?.nombre} - {d.descripcion} (Pendiente: ${Number(d.saldo_pendiente).toLocaleString()})
                    </option>
                  ))
                )}
              </select>
              
              <input
                type="number"
                step="0.01"
                placeholder="Monto *"
                value={form.monto}
                onChange={(e) => setForm({ ...form, monto: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
              
              {deudaSeleccionada && (
                <div className="md:col-span-2 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Saldo pendiente:</span> ${Number(deudaSeleccionada.saldo_pendiente).toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Ingrese un monto menor o igual al saldo pendiente
                  </p>
                </div>
              )}
              
              <input
                placeholder="Observaciones (opcional)"
                value={form.observaciones}
                onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                disabled={isSubmitting}
              />
              
              <div className="flex gap-2 md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !form.deuda_id || !form.monto}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isSubmitting ? 'Registrando...' : 'Registrar pago'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla de pagos */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Cargando pagos...</div>
          </div>
        ) : fetchError ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="text-red-600">
              <p className="font-semibold">Error al cargar los datos</p>
              <p className="text-sm mt-2">{fetchError}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : pagos.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="text-gray-400">
              No hay pagos registrados
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-600 text-sm">
                  <tr>
                    <th className="p-3 text-left">Cliente</th>
                    <th className="p-3 text-left">Deuda</th>
                    <th className="p-3 text-left">Monto pagado</th>
                    <th className="p-3 text-left">Fecha</th>
                    <th className="p-3 text-left">Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium text-gray-900">
                        {p.clientes?.nombre || 'Cliente no disponible'}
                      </td>
                      <td className="p-3 text-gray-600">
                        {p.deudas?.descripcion || 'Deuda no disponible'}
                      </td>
                      <td className="p-3 text-green-600 font-semibold">
                        ${Number(p.monto).toLocaleString()}
                      </td>
                      <td className="p-3 text-gray-600">
                        {new Date(p.fecha_pago).toLocaleDateString('es-AR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-3 text-gray-600 max-w-xs truncate">
                        {p.observaciones || '-'}
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