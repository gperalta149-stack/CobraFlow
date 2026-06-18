import { Search, X, User } from 'lucide-react'

interface Cliente {
  id: string
  nombre: string
  apellido: string
  dni?: string
  empresa?: string
  telefono?: string
}

interface ClienteSearchProps {
  value: string
  sugerencias: Cliente[]
  mostrarSugerencias: boolean
  clienteSeleccionado: string
  onChange: (value: string) => void
  onFocus: () => void
  onSeleccionar: (id: string, nombre: string) => void
  onLimpiar: () => void
}

export function ClienteSearch({
  value, sugerencias, mostrarSugerencias, clienteSeleccionado,
  onChange, onFocus, onSeleccionar, onLimpiar
}: ClienteSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Buscar cliente por nombre, DNI, email o empresa..."
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
      {clienteSeleccionado && (
        <button onClick={onLimpiar}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      )}

      {mostrarSugerencias && value && sugerencias.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {sugerencias.map(cliente => (
            <button key={cliente.id}
              onClick={() => onSeleccionar(cliente.id, `${cliente.nombre} ${cliente.apellido}`)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors flex items-start gap-3">
              <User className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {cliente.apellido}, {cliente.nombre}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-0.5">
                  {cliente.dni && <span>📄 {cliente.dni}</span>}
                  {cliente.empresa && <span>🏢 {cliente.empresa}</span>}
                  {cliente.telefono && <span>📞 {cliente.telefono}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
