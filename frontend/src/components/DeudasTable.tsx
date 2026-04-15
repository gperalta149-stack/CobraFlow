import { useState } from 'react'

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

const estadoColor: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  pagada: 'bg-green-100 text-green-700',
  vencida: 'bg-red-100 text-red-700',
  parcial: 'bg-blue-100 text-blue-700'
}

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch {
    return dateString
  }
}

type SortColumn = 'cliente' | 'total' | 'pendiente' | 'fecha' | 'estado'
type SortDirection = 'asc' | 'desc'
type SortValue = string | number

interface DeudasTableProps {
  deudas: Deuda[]
  onEliminar: (id: string) => void
  deletingId?: string | null
}

export default function DeudasTable({ deudas, onEliminar, deletingId }: DeudasTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('fecha')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // 🔹 Mejora 5: Normalización para sorting case-insensitive
  const getSortValue = (deuda: Deuda, column: SortColumn): SortValue => {
    switch (column) {
      case 'cliente':
        // Normalizar: lowercase para ordenar sin importar mayúsculas
        return (deuda.clientes?.nombre || '').toLowerCase()
      case 'total':
        return deuda.monto_total
      case 'pendiente':
        return deuda.saldo_pendiente
      case 'fecha':
        return new Date(deuda.fecha_vencimiento).getTime()
      case 'estado':
        // Normalizar: lowercase para ordenar consistente
        return deuda.estado.toLowerCase()
      default:
        return ''
    }
  }

  const getSortedDeudas = (): Deuda[] => {
    const sorted = [...deudas]
    
    sorted.sort((a, b) => {
      const aValue = getSortValue(a, sortColumn)
      const bValue = getSortValue(b, sortColumn)
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
    
    return sorted
  }

  const getSortIcon = (column: SortColumn): string => {
    if (sortColumn !== column) return '↕️'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  const sortedDeudas = getSortedDeudas()

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th 
                className="p-3 text-left cursor-pointer hover:bg-gray-100 transition-colors select-none"
                onClick={() => handleSort('cliente')}
              >
                Cliente {getSortIcon('cliente')}
              </th>
              <th className="p-3 text-left">Descripción</th>
              <th 
                className="p-3 text-left cursor-pointer hover:bg-gray-100 transition-colors select-none"
                onClick={() => handleSort('total')}
              >
                Total {getSortIcon('total')}
              </th>
              <th className="p-3 text-left">Pagado</th>
              <th 
                className="p-3 text-left cursor-pointer hover:bg-gray-100 transition-colors select-none"
                onClick={() => handleSort('pendiente')}
              >
                Pendiente {getSortIcon('pendiente')}
              </th>
              <th 
                className="p-3 text-left cursor-pointer hover:bg-gray-100 transition-colors select-none"
                onClick={() => handleSort('fecha')}
              >
                Vencimiento {getSortIcon('fecha')}
              </th>
              <th 
                className="p-3 text-left cursor-pointer hover:bg-gray-100 transition-colors select-none"
                onClick={() => handleSort('estado')}
              >
                Estado {getSortIcon('estado')}
              </th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedDeudas.map((d) => (
              <tr key={d.id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="p-3 font-medium">{d.clientes?.nombre}</td>
                <td className="p-3 text-gray-600">{d.descripcion}</td>
                <td className="p-3">${Number(d.monto_total).toLocaleString()}</td>
                <td className="p-3 text-green-600">${Number(d.monto_pagado).toLocaleString()}</td>
                <td className="p-3 text-red-500 font-medium">${Number(d.saldo_pendiente).toLocaleString()}</td>
                <td className="p-3 text-gray-600">{formatDate(d.fecha_vencimiento)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColor[d.estado]}`}>
                    {d.estado}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => onEliminar(d.id)}
                    disabled={deletingId === d.id}
                    className="text-red-500 hover:text-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === d.id ? 'Eliminando...' : 'Eliminar'}
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