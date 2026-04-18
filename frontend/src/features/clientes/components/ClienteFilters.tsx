interface ClienteFiltersProps {
  buscar: string
  setBuscar: (value: string) => void
  disabled?: boolean
}

export function ClienteFilters({ buscar, setBuscar, disabled }: ClienteFiltersProps) {
  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Buscar por nombre o email..."
        value={buscar}
        onChange={(e) => setBuscar(e.target.value)}
        className="w-full pl-10 pr-4 border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={disabled}
      />
    </div>
  )
}