import type { Deuda, PagoFormData } from '../types'
import { PagoSaldoInfo } from './PagoSaldoInfo'

interface PagoFormProps {
  form: PagoFormData
  deudas: Deuda[]
  deudaSeleccionada: Deuda | undefined
  error: string
  isSubmitting: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export function PagoForm({
  form,
  deudas,
  deudaSeleccionada,
  error,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel
}: PagoFormProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow mb-4">
      <h2 className="font-bold text-gray-700 mb-3">Registrar Pago</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-3">
          {error}
        </div>
      )}
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          name="deuda_id"
          value={form.deuda_id}
          onChange={onChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={isSubmitting}
        >
          <option value="">Seleccionar deuda *</option>
          {deudas.length === 0 ? (
            <option value="" disabled>No hay deudas pendientes</option>
          ) : (
            deudas.map((d) => (
              <option key={d.id} value={d.id}>
                {d.clientes?.nombre} - {d.descripcion} (Pendiente: ${d.saldo_pendiente.toLocaleString()})
              </option>
            ))
          )}
        </select>

        <input
          type="number"
          step="0.01"
          name="monto"
          placeholder="Monto *"
          value={form.monto}
          onChange={onChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={isSubmitting}
        />

        {deudaSeleccionada && (
          <PagoSaldoInfo saldoPendiente={deudaSeleccionada.saldo_pendiente} />
        )}

        <input
          name="observaciones"
          placeholder="Observaciones (opcional)"
          value={form.observaciones}
          onChange={onChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
          disabled={isSubmitting}
        />

        <div className="flex gap-2 md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting || !form.deuda_id || !form.monto}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Registrando...' : 'Registrar pago'}
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