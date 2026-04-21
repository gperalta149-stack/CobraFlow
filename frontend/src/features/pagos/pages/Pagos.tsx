import { usePagos } from '../hooks/usePagos'
import { usePagoForm } from '../hooks/usePagoForm'
import { PagoForm } from '../components/PagoForm'
import { PagosTable } from '../components/PagosTable'
import { EmptyState } from '../../../components/shared/EmptyState'
import { DollarSign } from 'lucide-react'

export default function Pagos() {
  const { pagos, deudas, loading, error, refetchData, loadData } = usePagos()
  const { 
    showForm, form, error: formError, isSubmitting, deudaSeleccionada,
    handleChange, handleSubmit, handleCancel, openForm
  } = usePagoForm({ deudas, onSuccess: refetchData })

  if (loading && pagos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Pagos</h1>
            <div className="bg-gray-200 h-10 w-32 rounded animate-pulse"></div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error && pagos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <div className="text-red-600">
              <p className="font-semibold text-lg">Error al cargar los datos</p>
              <p className="text-sm mt-2">{error}</p>
              <button onClick={loadData} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg">Reintentar</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Pagos</h1>
          <button
            onClick={openForm}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Registrar Pago
          </button>
        </div>

        {showForm && (
          <PagoForm
            form={form}
            deudas={deudas}
            deudaSeleccionada={deudaSeleccionada}
            error={formError}
            isSubmitting={isSubmitting}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}

        {pagos.length === 0 && !loading ? (
          <EmptyState
            title="No hay pagos registrados"
            description="Registrá tu primer pago para comenzar"
            icon={<DollarSign />}
            action={
              <button
                onClick={openForm}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                + Registrar pago
              </button>
            }
          />
        ) : (
          <PagosTable pagos={pagos} />
        )}
      </div>
    </div>
  )
}