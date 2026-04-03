import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

interface Cliente {
  id: string
  nombre: string
  email: string
  telefono: string
  direccion: string
  activo: boolean
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [buscar, setBuscar] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState<Cliente | null>(null)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', direccion: '' })
  const [error, setError] = useState('')

  const fetchClientes = async () => {
    try {
      const { data } = await api.get(`/clientes${buscar ? `?buscar=${buscar}` : ''}`)
      setClientes(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchClientes() }, [buscar])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (editando) {
        await api.put(`/clientes/${editando.id}`, form)
      } else {
        await api.post('/clientes', form)
      }
      setForm({ nombre: '', email: '', telefono: '', direccion: '' })
      setShowForm(false)
      setEditando(null)
      fetchClientes()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar')
    }
  }

  const handleEditar = (cliente: Cliente) => {
    setEditando(cliente)
    setForm({ nombre: cliente.nombre, email: cliente.email, telefono: cliente.telefono, direccion: cliente.direccion })
    setShowForm(true)
  }

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Desactivar este cliente?')) return
    await api.delete(`/clientes/${id}`)
    fetchClientes()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
          <button
            onClick={() => { setShowForm(true); setEditando(null); setForm({ nombre: '', email: '', telefono: '', direccion: '' }) }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Nuevo Cliente
          </button>
        </div>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-xl p-4 shadow mb-4">
            <h2 className="font-bold text-gray-700 mb-3">{editando ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
            {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-3">{error}</div>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                placeholder="Nombre *"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
                required
              />
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                placeholder="Teléfono"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                placeholder="Dirección"
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <div className="flex gap-2 md:col-span-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  {editando ? 'Guardar cambios' : 'Crear cliente'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditando(null) }} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
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
                  <th className="p-3 text-left">Nombre</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Teléfono</th>
                  <th className="p-3 text-left">Dirección</th>
                  <th className="p-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.length === 0 ? (
                  <tr><td colSpan={5} className="p-4 text-center text-gray-400">No hay clientes</td></tr>
                ) : (
                  clientes.map((c) => (
                    <tr key={c.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{c.nombre}</td>
                      <td className="p-3 text-gray-600">{c.email}</td>
                      <td className="p-3 text-gray-600">{c.telefono}</td>
                      <td className="p-3 text-gray-600">{c.direccion}</td>
                      <td className="p-3 flex gap-2">
                        <button onClick={() => handleEditar(c)} className="text-blue-600 hover:underline text-sm">Editar</button>
                        <button onClick={() => handleEliminar(c.id)} className="text-red-500 hover:underline text-sm">Eliminar</button>
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