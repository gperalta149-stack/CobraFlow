import type { ClienteFormData, Cliente } from '../types'

interface ClienteFormProps {
  form: ClienteFormData
  editando: Cliente | null
  error: string
  isSubmitting: boolean
  nombreInputRef: React.MutableRefObject<HTMLInputElement | null>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export function ClienteForm({
  form,
  editando,
  error,
  isSubmitting,
  nombreInputRef,
  onChange,
  onSubmit,
  onCancel
}: ClienteFormProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow mb-4">
      <h2 className="font-bold text-gray-700 mb-3">
        {editando ? '✏️ Editar Cliente' : '➕ Nuevo Cliente'}
      </h2>
      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded mb-3">
          {error}
        </div>
      )}
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          ref={nombreInputRef}
          name="nombre"
          placeholder="Nombre *"
          value={form.nombre}
          onChange={onChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={isSubmitting}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        <input
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={onChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        <input
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={onChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        <div className="flex gap-2 md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Guardando...' : (editando ? 'Guardar cambios' : 'Crear cliente')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}