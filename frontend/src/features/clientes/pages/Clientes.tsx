import { useClientes } from '../hooks/useClientes'
import { useClienteForm } from '../hooks/useClienteForm'
import { useClienteDelete } from '../hooks/useClienteDelete'
import { ClienteFilters } from '../components/ClienteFilters'
import { ClienteForm } from '../components/ClienteForm'
import { ClientesTable } from '../components/ClientesTable'
import { EmptyState } from '../../../components/shared/EmptyState'
import { Users } from 'lucide-react'


export default function Clientes() {
  const { clientes, loading, error, buscar, setBuscar, refetchClientes, loadData } = useClientes()
  const { 
    showForm, editando, form, error: formError, isSubmitting, nombreInputRef,
    handleChange, handleSubmit, handleEditar, handleNuevoCliente, handleCancel 
  } = useClienteForm({ onSuccess: refetchClientes })
  const { deletingId, handleEliminar } = useClienteDelete({ onSuccess: refetchClientes })

  if (loading && clientes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
            <div className="bg-gray-200 h-10 w-32 rounded animate-pulse"></div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error && clientes.length === 0) {
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
          <button
            onClick={handleNuevoCliente}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nuevo Cliente
          </button>
        </div>

        <ClienteFilters buscar={buscar} setBuscar={setBuscar} disabled={loading} />

        {showForm && (
          <ClienteForm
            form={form}
            editando={editando}
            error={formError}
            isSubmitting={isSubmitting}
            nombreInputRef={nombreInputRef}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}

        {clientes.length === 0 && !loading ? (
          <EmptyState
            title="No hay clientes"
            description="Creá tu primer cliente para comenzar"
            icon={<Users />}
            action={
              <button
                onClick={handleNuevoCliente}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                + Crear primer cliente
              </button>
            }
          />
        ) : (
          <ClientesTable
            clientes={clientes}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
            deletingId={deletingId}
          />
        )}
      </div>
    </div>
  )
}