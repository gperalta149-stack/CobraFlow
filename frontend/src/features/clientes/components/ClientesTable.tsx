import type { Cliente } from '../types'

interface ClientesTableProps {
  clientes: Cliente[]
  onVer: (cliente: Cliente) => void           // NUEVO
  onEditar: (cliente: Cliente) => void
  onVerPagos: (cliente: Cliente) => void      // NUEVO
  onVerResumen: (cliente: Cliente) => void    // NUEVO
  onEliminar: (id: string) => void
  deletingId: string | null
}

const formatPhone = (phone: string): string => {
  if (!phone) return '-'
  if (phone.length === 10) {
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`
  }
  return phone
}

export function ClientesTable({ 
  clientes, 
  onVer, 
  onEditar, 
  onVerPagos, 
  onVerResumen, 
  onEliminar, 
  deletingId 
}: ClientesTableProps) {
  return (
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
                  <div className="flex flex-wrap gap-2">
                    {/* Botón Ver */}
                    <button
                      onClick={() => onVer(c)}
                      className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                    >
                      Ver
                    </button>
                    {/* Botón Editar */}
                    <button
                      onClick={() => onEditar(c)}
                      disabled={deletingId === c.id}
                      className="text-blue-600 hover:text-blue-800 transition-colors text-sm disabled:opacity-50"
                    >
                      Editar
                    </button>
                    {/* Botón Pagos */}
                    <button
                      onClick={() => onVerPagos(c)}
                      className="text-green-600 hover:text-green-800 transition-colors text-sm"
                    >
                      Pagos
                    </button>
                    {/* Botón Resumen */}
                    <button
                      onClick={() => onVerResumen(c)}
                      className="text-purple-600 hover:text-purple-800 transition-colors text-sm"
                    >
                      Resumen
                    </button>
                    {/* Botón Eliminar */}
                    <button
                      onClick={() => onEliminar(c.id)}
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
  )
}