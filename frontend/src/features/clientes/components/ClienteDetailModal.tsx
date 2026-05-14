import { useEffect, useState } from 'react'
import { clientesApi } from '../services/clientesApi'
import type { Cliente } from '../types'

interface ClienteDetailModalProps {
  clienteId: string
  onClose: () => void
}

export function ClienteDetailModal({ clienteId, onClose }: ClienteDetailModalProps) {
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const data = await clientesApi.getById(clienteId)
        setCliente(data.data)
      } catch (error) {
        console.error('Error cargando cliente:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCliente()
  }, [clienteId])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Detalle del Cliente</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ✕
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando...</div>
        ) : cliente ? (
          <div className="space-y-4">
            <div className="border-b pb-2">
              <p className="text-xs text-gray-500 uppercase">Nombre</p>
              <p className="font-medium text-gray-800">{cliente.nombre}</p>
            </div>
            <div className="border-b pb-2">
              <p className="text-xs text-gray-500 uppercase">Email</p>
              <p className="text-gray-700">{cliente.email || '-'}</p>
            </div>
            <div className="border-b pb-2">
              <p className="text-xs text-gray-500 uppercase">Teléfono</p>
              <p className="text-gray-700">{cliente.telefono || '-'}</p>
            </div>
            <div className="border-b pb-2">
              <p className="text-xs text-gray-500 uppercase">Dirección</p>
              <p className="text-gray-700">{cliente.direccion || '-'}</p>
            </div>
            <div className="border-b pb-2">
              <p className="text-xs text-gray-500 uppercase">Estado</p>
              <p className={cliente.activo ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {cliente.activo ? 'Activo' : 'Inactivo'}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-red-500">Cliente no encontrado</div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}