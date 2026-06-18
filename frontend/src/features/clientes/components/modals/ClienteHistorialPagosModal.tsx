import { useEffect, useState } from 'react'
import { clientesApi } from '../../services/clientesApi'

interface Pago {
  id: string
  monto: number
  fecha_pago: string
  observaciones: string
  deudas: { descripcion: string; monto_total: number }
}

interface ClienteHistorialPagosProps {
  clienteId: string
  clienteNombre: string
  onClose: () => void
}

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

export function ClienteHistorialPagos({ clienteId, clienteNombre, onClose }: ClienteHistorialPagosProps) {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const { data } = await clientesApi.getPagosByCliente(clienteId)
        setPagos(data)
      } catch (error) {
        console.error('Error cargando pagos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPagos()
  }, [clienteId])

  const totalRecaudado = pagos.reduce((sum, p) => sum + Number(p.monto), 0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Historial de Pagos - {clienteNombre}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ✕
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando...</div>
        ) : pagos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay pagos registrados para este cliente
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Deuda</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Monto</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Fecha</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((pago) => (
                    <tr key={pago.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-sm text-gray-700">
                        {pago.deudas?.descripcion || '-'}
                      </td>
                      <td className="p-3 text-sm font-medium text-green-600">
                        ${Number(pago.monto).toLocaleString()}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {formatDate(pago.fecha_pago)}
                      </td>
                      <td className="p-3 text-sm text-gray-500">
                        {pago.observaciones || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 pt-3 border-t text-right">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Total pagos:</span> {pagos.length} | 
                <span className="font-semibold ml-2">Total recaudado:</span> ${totalRecaudado.toLocaleString()}
              </p>
            </div>
          </>
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