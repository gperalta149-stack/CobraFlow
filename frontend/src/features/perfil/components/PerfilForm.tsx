import type { PerfilFormData } from '../types'

interface PerfilFormProps {
  form: PerfilFormData
  error: string
  exito: string
  isSubmitting: boolean
  rol: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

export function PerfilForm({
  form,
  error,
  exito,
  isSubmitting,
  rol,
  onChange,
  onSubmit
}: PerfilFormProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="font-bold text-gray-700 mb-4">Datos personales</h2>
      
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {exito && (
        <div className="bg-green-100 text-green-600 p-3 rounded mb-4">
          {exito}
        </div>
      )}
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-500">
          Rol: <span className="font-medium text-gray-700">{rol}</span>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}