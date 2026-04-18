import type { Cliente, DeudaFormData } from '../types'
import type { RefObject } from 'react'

interface DeudaFormProps {
  form: DeudaFormData
  clientes: Cliente[]
  error: string
  isSubmitting: boolean
  descripcionInputRef: RefObject<HTMLInputElement | null>
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export function DeudaForm({
  form,
  clientes,
  error,
  isSubmitting,
  descripcionInputRef,
  onChange,
  onSubmit,
  onCancel
}: DeudaFormProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow mb-4">
      <h2 className="font-bold text-gray-700 mb-3">Nueva Deuda</h2>

      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded mb-3">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">

        <select
          name="cliente_id"
          value={form.cliente_id}
          onChange={onChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={isSubmitting}
        >
          <option value="">Seleccionar cliente *</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>

        <input
          ref={descripcionInputRef}
          name="descripcion"
          placeholder="Descripción *"
          value={form.descripcion}
          onChange={onChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={isSubmitting}
        />

        <input
          type="number"
          step="0.01"
          name="monto_total"
          placeholder="Monto total *"
          value={form.monto_total}
          onChange={onChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={isSubmitting}
        />

        <input
          type="date"
          name="fecha_vencimiento"
          value={form.fecha_vencimiento}
          onChange={onChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={isSubmitting}
        />

        <div className="flex gap-2 md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creando...' : 'Crear deuda'}
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