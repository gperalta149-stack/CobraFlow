import type { Cliente } from '../types'

interface ClientesTableProps {
  clientes: Cliente[]
  onEditar: (cliente: Cliente) => void
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

export function ClientesTable({ clientes, onEditar, onEliminar, deletingId }: ClientesTableProps) {
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditar(c)}
                      disabled={deletingId === c.id}
                      className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                    >
                      Editar
                    </button>
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