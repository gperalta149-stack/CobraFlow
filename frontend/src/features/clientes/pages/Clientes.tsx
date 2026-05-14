import { useState } from 'react'
import { useClientes } from '../hooks/useClientes'
import { useClienteForm } from '../hooks/useClienteForm'
import { useClienteDelete } from '../hooks/useClienteDelete'
import { ClienteFilters } from '../components/ClienteFilters'
import { ClienteForm } from '../components/ClienteForm'
import { ClientesTable } from '../components/ClientesTable'
import { EmptyState } from '../../../components/shared/EmptyState'
import { ClienteDetailModal } from '../components/ClienteDetailModal'
import { ClienteHistorialPagos } from '../components/ClienteHistorialPagos'
import { ClienteResumenFinanciero } from '../components/ClienteResumenFinanciero'
import { ClienteImportModal } from '../components/ClienteImportModal'
import { clientesApi } from '../services/clientesApi'
import { Users } from 'lucide-react'
import type { Cliente } from '../types'

export default function Clientes() {
  // Estados existentes
  const { clientes, loading, error, buscar, setBuscar, refetchClientes, loadData } = useClientes()
  const { 
    showForm, editando, form, error: formError, isSubmitting, nombreInputRef,
    handleChange, handleSubmit, handleEditar, handleNuevoCliente, handleCancel 
  } = useClienteForm({ onSuccess: refetchClientes })
  const { deletingId, handleEliminar } = useClienteDelete({ onSuccess: refetchClientes })

  // NUEVOS ESTADOS para las funcionalidades
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)
  const [clienteHistorialPagos, setClienteHistorialPagos] = useState<Cliente | null>(null)
  const [clienteResumen, setClienteResumen] = useState<Cliente | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)

  // NUEVA FUNCIÓN: Exportar a Excel
  const handleExport = async () => {
    try {
      const response = await clientesApi.exportToExcel(buscar)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Error al exportar clientes')
    }
  }

  // NUEVAS FUNCIONES para los modales
  const handleVerDetalle = (cliente: Cliente) => {
    setClienteSeleccionado(cliente)
  }

  const handleVerPagos = (cliente: Cliente) => {
    setClienteHistorialPagos(cliente)
  }

  const handleVerResumen = (cliente: Cliente) => {
    setClienteResumen(cliente)
  }

  // Estados de carga y error (existentes, sin cambios)
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
        {/* HEADER CON BOTONES MEJORADOS */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
          <div className="flex flex-wrap gap-2">
            {/* Botón Importar - NUEVO */}
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              📥 Importar Excel
            </button>
            {/* Botón Exportar - NUEVO */}
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              📊 Exportar Excel
            </button>
            {/* Botón Nuevo Cliente - Existente */}
            <button
              onClick={handleNuevoCliente}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              + Nuevo Cliente
            </button>
          </div>
        </div>

        {/* Filtros - Existente */}
        <ClienteFilters buscar={buscar} setBuscar={setBuscar} disabled={loading} />

        {/* Formulario - Existente */}
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

        {/* Tabla o EmptyState - MODIFICADO: agregar nuevas props */}
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
            onVer={handleVerDetalle}           // NUEVO
            onEditar={handleEditar}             // Existente
            onVerPagos={handleVerPagos}         // NUEVO
            onVerResumen={handleVerResumen}     // NUEVO
            onEliminar={handleEliminar}         // Existente
            deletingId={deletingId}             // Existente
          />
        )}
      </div>

      {/* MODALES NUEVOS */}

      {/* Modal de detalle de cliente */}
      {clienteSeleccionado && (
        <ClienteDetailModal
          clienteId={clienteSeleccionado.id}
          onClose={() => setClienteSeleccionado(null)}
        />
      )}

      {/* Modal de historial de pagos */}
      {clienteHistorialPagos && (
        <ClienteHistorialPagos
          clienteId={clienteHistorialPagos.id}
          clienteNombre={clienteHistorialPagos.nombre}
          onClose={() => setClienteHistorialPagos(null)}
        />
      )}

      {/* Modal de resumen financiero */}
      {clienteResumen && (
        <ClienteResumenFinanciero
          clienteId={clienteResumen.id}
          onClose={() => setClienteResumen(null)}
        />
      )}

      {/* Modal de importación */}
      {showImportModal && (
        <ClienteImportModal
          onClose={() => setShowImportModal(false)}
          onSuccess={refetchClientes}
        />
      )}
    </div>
  )
}