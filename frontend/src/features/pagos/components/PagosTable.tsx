import type { Pago } from '../types'
import { generarComprobantePago } from '../../../utils/pdfGenerator'

interface PagosTableProps {
  pagos: Pago[]
  onGenerarComprobante?: (pago: Pago) => void  // NUEVO
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

export function PagosTable({ pagos }: PagosTableProps) {
  const handleGenerarComprobante = async (pago: Pago) => {
    try {
      await generarComprobantePago(pago, pago.deudas, pago.clientes)
    } catch (error) {
      console.error('Error generando comprobante:', error)
      alert('Error al generar el comprobante')
    }
  }

  if (pagos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <div className="text-gray-400">No hay pagos registrados</div>
      </div>
    )
  }

  return (
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
              <th className="p-3 text-left">Acciones</th>  {/* NUEVO */}
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
                  {formatDate(p.fecha_pago)}
                </td>
                <td className="p-3 text-gray-600 max-w-xs truncate">
                  {p.observaciones || '-'}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleGenerarComprobante(p)}
                    className="text-blue-600 hover:text-blue-800 transition-colors text-sm flex items-center gap-1"
                  >
                    📄 Comprobante
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}