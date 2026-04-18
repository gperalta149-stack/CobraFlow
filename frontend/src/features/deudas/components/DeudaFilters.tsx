interface DeudaFiltersProps {
  filtroEstado: string
  setFiltroEstado: (value: string) => void
  disabled?: boolean
}

export function DeudaFilters({ filtroEstado, setFiltroEstado, disabled }: DeudaFiltersProps) {
  const estados = [
    { value: '', label: 'Todos los estados' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'parcial', label: 'Parcial' },
    { value: 'pagada', label: 'Pagada' },
    { value: 'vencida', label: 'Vencida' }
  ]

  return (
    <select
      value={filtroEstado}
      onChange={(e) => setFiltroEstado(e.target.value)}
      className="border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      disabled={disabled}
    >
      {estados.map((estado) => (
        <option key={estado.value} value={estado.value}>
          {estado.label}
        </option>
      ))}
    </select>
  )
}