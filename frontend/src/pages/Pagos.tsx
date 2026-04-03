import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

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

  const fetchPagos = async () => {
    try {
      const { data } = await api.get('/pagos')
      setPagos(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDeudas = async () => {
    try {
      const { data } = await api.get('/deudas')
      setDeudas(data.filter((d: Deuda) => d.estado !== 'pagada'))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { fetchPagos(); fetchDeudas() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/pagos', { ...form, monto: Number(form.monto) })
      setForm({ deuda_id: '', monto: '', observaciones: '' })
      setShowForm(false)
      fetchPagos()
      fetchDeudas()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrar pago')
    }
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
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Registrar Pago
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-xl p-4 shadow mb-4">
            <h2 className="font-bold text-gray-700 mb-3">Registrar Pago</h2>
            {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-3">{error}</div>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                value={form.deuda_id}
                onChange={(e) => setForm({ ...form, deuda_id: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Seleccionar deuda *</option>
                {deudas.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.clientes?.nombre} - {d.descripcion} (Pendiente: ${Number(d.saldo_pendiente).toLocaleString()})
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Monto *"
                value={form.monto}
                onChange={(e) => setForm({ ...form, monto: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
                required
              />
              {deudaSeleccionada && (
                <div className="md:col-span-2 bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                  Saldo pendiente: <strong>${Number(deudaSeleccionada.saldo_pendiente).toLocaleString()}</strong>
                </div>
              )}
              <input
                placeholder="Observaciones"
                value={form.observaciones}
                onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 md:col-span-2"
              />
              <div className="flex gap-2 md:col-span-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Registrar pago
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla */}
        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
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
                {pagos.length === 0 ? (
                  <tr><td colSpan={5} className="p-4 text-center text-gray-400">No hay pagos registrados</td></tr>
                ) : (
                  pagos.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{p.clientes?.nombre}</td>
                      <td className="p-3 text-gray-600">{p.deudas?.descripcion}</td>
                      <td className="p-3 text-green-600 font-medium">${Number(p.monto).toLocaleString()}</td>
                      <td className="p-3 text-gray-600">{new Date(p.fecha_pago).toLocaleDateString('es-AR')}</td>
                      <td className="p-3 text-gray-600">{p.observaciones || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}