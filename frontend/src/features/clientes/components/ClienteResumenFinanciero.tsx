import { useEffect, useState } from 'react'
import { clientesApi } from '../services/clientesApi'

interface ResumenFinanciero {
  cliente: string
  totalDeudas: number
  totalMonto: number
  totalPagado: number
  totalPendiente: number
  deudasPorEstado: {
    pendiente: number
    parcial: number
    pagada: number
    vencida: number
  }
  tasaRecuperacion: string
}

interface ClienteResumenFinancieroProps {
  clienteId: string
  onClose: () => void
}

export function ClienteResumenFinanciero({ clienteId, onClose }: ClienteResumenFinancieroProps) {
  const [resumen, setResumen] = useState<ResumenFinanciero | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const { data } = await clientesApi.getResumenFinanciero(clienteId)
        setResumen(data)
      } catch (error) {
        console.error('Error cargando resumen:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchResumen()
  }, [clienteId])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Resumen Financiero</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ✕
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando...</div>
        ) : resumen ? (
          <div className="space-y-4">
            {/* Cliente */}
            <div className="text-center border-b pb-3">
              <p className="text-lg font-semibold text-gray-800">{resumen.cliente}</p>
            </div>

            {/* KPIs principales */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-xs text-blue-600 uppercase">Total Deudas</p>
                <p className="text-2xl font-bold text-blue-700">{resumen.totalDeudas}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-xs text-green-600 uppercase">Recuperado</p>
                <p className="text-2xl font-bold text-green-700">{resumen.tasaRecuperacion}%</p>
              </div>
            </div>

            {/* Montos */}
            <div className="border-t pt-3">
              <p className="font-semibold text-gray-700 mb-2">Montos</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total adeudado:</span>
                  <span className="font-bold text-gray-800">${resumen.totalMonto.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Total pagado:</span>
                  <span className="font-medium text-green-700">${resumen.totalPagado.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Pendiente:</span>
                  <span className="font-medium text-red-700">${resumen.totalPendiente.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Estado de deudas */}
            <div className="border-t pt-3">
              <p className="font-semibold text-gray-700 mb-2">Estado de deudas</p>
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div>
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                  Pend: {resumen.deudasPorEstado.pendiente}
                </div>
                <div>
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                  Parc: {resumen.deudasPorEstado.parcial}
                </div>
                <div>
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Pag: {resumen.deudasPorEstado.pagada}
                </div>
                <div>
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                  Ven: {resumen.deudasPorEstado.vencida}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-red-500">Error al cargar resumen</div>
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