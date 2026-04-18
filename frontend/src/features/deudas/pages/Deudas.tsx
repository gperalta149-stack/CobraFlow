import { useDeudas } from '../hooks/useDeudas'
import { useDeudaForm } from '../hooks/useDeudaForm'
import { useDeudaDelete } from '../hooks/useDeudaDelete'
import { DeudaFilters } from '../components/DeudaFilters'
import { DeudaForm } from '../components/DeudaForm'
import { DeudasTable } from '../components/DeudasTable'
import { EmptyState } from '../../../components/shared/EmptyState'

export default function Deudas() {
  const { deudas, clientes, loading, error, filtroEstado, setFiltroEstado, refetchDeudas, loadData } = useDeudas()
  const { showForm, form, error: formError, isSubmitting, descripcionInputRef, handleChange, handleSubmit, handleCancel, openForm } = useDeudaForm({ onSuccess: refetchDeudas })
  const { deletingId, handleEliminar } = useDeudaDelete({ onSuccess: refetchDeudas })

  if (loading && deudas.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Deudas</h1>
            <div className="bg-gray-200 h-10 w-32 rounded animate-pulse"></div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-48"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error && deudas.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-800">Deudas</h1>
          <button onClick={openForm} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            + Nueva Deuda
          </button>
        </div>

        <DeudaFilters filtroEstado={filtroEstado} setFiltroEstado={setFiltroEstado} disabled={loading} />

        {showForm && (
          <DeudaForm
            form={form}
            clientes={clientes}
            error={formError}
            isSubmitting={isSubmitting}
            descripcionInputRef={descripcionInputRef}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}

        {deudas.length === 0 && !loading ? (
          <EmptyState
            title="No hay deudas"
            description="Creá tu primera deuda para comenzar"
            actionText="+ Crear primera deuda"
            onAction={openForm}
          />
        ) : (
          <DeudasTable deudas={deudas} onEliminar={handleEliminar} deletingId={deletingId} />
        )}
      </div>
    </div>
  )
}