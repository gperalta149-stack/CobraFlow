import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

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

const estadoColor: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  pagada: 'bg-green-100 text-green-700',
  vencida: 'bg-red-100 text-red-700',
  parcial: 'bg-blue-100 text-blue-700'
}

export default function Deudas() {
  const [deudas, setDeudas] = useState<Deuda[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ cliente_id: '', descripcion: '', monto_total: '', fecha_vencimiento: '' })
  const [error, setError] = useState('')

  const fetchDeudas = async () => {
    try {
      const { data } = await api.get(`/deudas${filtroEstado ? `?estado=${filtroEstado}` : ''}`)
      setDeudas(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchClientes = async () => {
    try {
      const { data } = await api.get('/clientes')
      setClientes(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { fetchDeudas(); fetchClientes() }, [filtroEstado])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/deudas', { ...form, monto_total: Number(form.monto_total) })
      setForm({ cliente_id: '', descripcion: '', monto_total: '', fecha_vencimiento: '' })
      setShowForm(false)
      fetchDeudas()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar')
    }
  }

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Eliminar esta deuda?')) return
    try {
      await api.delete(`/deudas/${id}`)
      fetchDeudas()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al eliminar')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Deudas</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Nueva Deuda
          </button>
        </div>

        {/* Filtro */}
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="parcial">Parcial</option>
          <option value="pagada">Pagada</option>
          <option value="vencida">Vencida</option>
        </select>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-xl p-4 shadow mb-4">
            <h2 className="font-bold text-gray-700 mb-3">Nueva Deuda</h2>
            {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-3">{error}</div>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                value={form.cliente_id}
                onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Seleccionar cliente *</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              <input
                placeholder="Descripción *"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Monto total *"
                value={form.monto_total}
                onChange={(e) => setForm({ ...form, monto_total: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
                required
              />
              <input
                type="date"
                value={form.fecha_vencimiento}
                onChange={(e) => setForm({ ...form, fecha_vencimiento: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
                required
              />
              <div className="flex gap-2 md:col-span-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Crear deuda
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
                  <th className="p-3 text-left">Descripción</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Pagado</th>
                  <th className="p-3 text-left">Pendiente</th>
                  <th className="p-3 text-left">Vencimiento</th>
                  <th className="p-3 text-left">Estado</th>
                  <th className="p-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {deudas.length === 0 ? (
                  <tr><td colSpan={8} className="p-4 text-center text-gray-400">No hay deudas</td></tr>
                ) : (
                  deudas.map((d) => (
                    <tr key={d.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{d.clientes?.nombre}</td>
                      <td className="p-3 text-gray-600">{d.descripcion}</td>
                      <td className="p-3">${Number(d.monto_total).toLocaleString()}</td>
                      <td className="p-3 text-green-600">${Number(d.monto_pagado).toLocaleString()}</td>
                      <td className="p-3 text-red-500 font-medium">${Number(d.saldo_pendiente).toLocaleString()}</td>
                      <td className="p-3 text-gray-600">{d.fecha_vencimiento}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColor[d.estado]}`}>
                          {d.estado}
                        </span>
                      </td>
                      <td className="p-3">
                        <button onClick={() => handleEliminar(d.id)} className="text-red-500 hover:underline text-sm">
                          Eliminar
                        </button>
                      </td>
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